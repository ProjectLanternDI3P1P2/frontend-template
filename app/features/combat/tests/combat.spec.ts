import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import {
  initialEnemies,
  initialParty,
  skills,
} from "../fixtures/combatFixtures";
import { previewAction, validTarget } from "../rules";
import { useCombatDemo } from "../composables/useCombatDemo";

const cleanups: (() => void)[] = [];
function setup() {
  let demo!: ReturnType<typeof useCombatDemo>;
  const wrapper = mount(
    defineComponent({
      setup() {
        demo = useCombatDemo();
        return () => null;
      },
    }),
  );
  cleanups.push(() => wrapper.unmount());
  return demo;
}
afterEach(() => {
  cleanups.splice(0).forEach((fn) => fn());
  vi.useRealTimers();
});

describe("combat targeting and preview", () => {
  it("only previews a combo when the target has the consumed state", () => {
    expect(previewAction(skills[1], initialEnemies[0])).toMatchObject({
      combo: "Electrocution",
      damage: 36,
      resonance: 20,
    });
    expect(previewAction(skills[1], initialEnemies[1])).toMatchObject({
      combo: undefined,
      damage: 18,
      resonance: 0,
    });
  });
  it("excludes enemies, yourself and defeated allies from swap targets", () => {
    expect(validTarget(skills[5], initialEnemies[0], false)).toBe(false);
    expect(validTarget(skills[5], initialParty[0], true)).toBe(false);
    expect(validTarget(skills[5], { ...initialParty[2]!, hp: 0 }, true)).toBe(
      false,
    );
    expect(validTarget(skills[5], initialParty[2], true)).toBe(true);
  });
  it("requires a target and prevents changing a locked action", () => {
    const d = setup();
    d.selectSkill("fireball");
    d.lock();
    expect(d.phase.value).toBe("planning");
    d.selectTarget("slime");
    d.lock();
    d.selectSkill("wave");
    d.selectTarget("bat");
    expect(d.skillId.value).toBe("fireball");
    expect(d.targetId.value).toBe("slime");
    d.unlock();
    d.selectSkill("wave");
    expect(d.skillId.value).toBe("wave");
  });
  it("resolves a locked combo only once", () => {
    const d = setup();
    d.lock();
    d.resolve();
    d.resolve();
    expect(d.enemies.value[0]!.hp).toBe(52);
    expect(d.enemies.value[0]!.state).toBe("Stunned");
    expect(d.resonance.value).toBe(80);
  });
  it("swaps ally ranks without damaging the enemy", () => {
    const d = setup();
    d.selectSkill("swap");
    d.selectTarget("p3");
    d.lock();
    d.resolve();
    expect(d.party.value[0]!.rank).toBe(1);
    expect(d.party.value[2]!.rank).toBe(0);
    expect(d.enemies.value[0]!.hp).toBe(88);
  });
});
describe("combat demo timers", () => {
  it("does not advance a preview until the timer is started", () => {
    vi.useFakeTimers();
    const d = setup();
    vi.advanceTimersByTime(30000);
    expect(d.phase.value).toBe("planning");
  });
  it("falls back to Defend for an unlocked selection at the deadline", () => {
    vi.useFakeTimers();
    const d = setup();
    d.toggleTimer();
    vi.advanceTimersByTime(10000);
    expect(d.phase.value).toBe("resolution");
    expect(d.skillId.value).toBe("defend");
    expect(d.enemies.value[0]!.hp).toBe(88);
  });
  it("keeps the full gauge when ultimate confirmation expires", () => {
    vi.useFakeTimers();
    const d = setup();
    d.loadScenario("ultimate");
    d.proposeUltimate();
    vi.advanceTimersByTime(3100);
    expect(d.ultimateOpen.value).toBe(false);
    expect(d.resonance.value).toBe(100);
    d.confirmUltimate();
    expect(d.resonance.value).toBe(100);
  });
  it("spends resonance exactly once when the ultimate is confirmed", () => {
    vi.useFakeTimers();
    const d = setup();
    d.loadScenario("ultimate");
    d.proposeUltimate();
    d.confirmUltimate();
    d.confirmUltimate();
    vi.advanceTimersByTime(4000);
    expect(d.resonance.value).toBe(0);
    expect(d.enemies.value[0]!.hp).toBe(28);
    expect(d.ultimateOpen.value).toBe(false);
  });
  it("cleans up active timers on unmount", () => {
    vi.useFakeTimers();
    const d = setup();
    d.toggleTimer();
    cleanups.splice(0).forEach((fn) => fn());
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("combat demo commands", () => {
  it("caps potion healing and does not consume an item at full health", () => {
    const d = setup();
    expect(d.usePotion()).toBe(true);
    expect(d.party.value[0]!.hp).toBe(70);
    expect(d.potions.value).toBe(2);
    expect(d.usePotion()).toBe(false);
    expect(d.potions.value).toBe(2);
    expect(d.message.value).toContain("70/70 HP");
  });
  it("keeps inventory across previews and cannot consume an empty stock", () => {
    const d = setup();
    for (let i = 0; i < 3; i++) {
      d.loadScenario("planning");
      expect(d.usePotion()).toBe(true);
    }
    d.loadScenario("planning");
    expect(d.usePotion()).toBe(false);
    expect(d.party.value[0]!.hp).toBe(58);
    expect(d.potions.value).toBe(0);
  });
  it("skips a playing replay without leaving a timer running", () => {
    vi.useFakeTimers();
    const d = setup();
    d.resolve();
    d.toggleTimer();
    d.skipReplay();
    expect(d.replayIndex.value).toBe(d.events.value.length);
    expect(d.running.value).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("isolates encounters from each other and from the fixtures", () => {
    const first = setup();
    const second = setup();
    first.usePotion();
    first.resolve();
    expect(second.party.value[0]!.hp).toBe(initialParty[0]!.hp);
    expect(second.enemies.value[0]!.hp).toBe(initialEnemies[0]!.hp);
    expect(second.potions.value).toBe(3);
  });
});
