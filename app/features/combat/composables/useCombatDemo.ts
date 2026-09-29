import { computed, onUnmounted, ref } from "vue";
import { initialEnemies, initialParty, skills } from "../data";
import { previewAction, validTarget } from "../rules";
import type { Phase, SkillId } from "../types";

/** Isolated interactive fixture. Never sends requests or persists player rewards. */
export function useCombatDemo() {
  const party = ref(initialParty.map((p) => ({ ...p })));
  const enemies = ref(initialEnemies.map((p) => ({ ...p })));
  const phase = ref<Phase>("planning");
  const scenario = ref("planning");
  const skillId = ref<SkillId | undefined>("lightning");
  const targetId = ref<string | undefined>("skeleton");
  const resonance = ref(60);
  const turn = ref(3);
  const seconds = ref(10);
  const running = ref(false);
  const replayIndex = ref(0);
  const replaySpeed = ref(1);
  const notice = ref("");
  const ultimateOpen = ref(false);
  const ultimateSeconds = ref(3);
  const ultimateAccepted = ref(false);
  const events = ref<
    { actor: string; action: string; effect: string; speed: number }[]
  >([]);
  let timer: ReturnType<typeof setInterval> | undefined;
  let ultimateTimer: ReturnType<typeof setInterval> | undefined;
  const skill = computed(() => skills.find((s) => s.id === skillId.value));
  const target = computed(() =>
    [...party.value, ...enemies.value].find((p) => p.id === targetId.value),
  );
  const preview = computed(() => previewAction(skill.value, target.value));
  const canLock = computed(
    () =>
      phase.value === "planning" &&
      validTarget(
        skill.value,
        target.value,
        party.value.some((p) => p.id === targetId.value),
      ),
  );
  const actionLabel = computed(() =>
    skill.value
      ? `${skill.value.name}${target.value ? " → " + target.value.name : " — choose a target"}`
      : "Pick a skill",
  );
  function stop() {
    clearInterval(timer);
    timer = undefined;
    running.value = false;
  }
  function selectSkill(id: SkillId) {
    if (phase.value !== "planning") return;
    skillId.value = id;
    targetId.value = id === "defend" ? "p1" : undefined;
  }
  function selectTarget(id: string) {
    const fighter = [...party.value, ...enemies.value].find((p) => p.id === id);
    if (
      phase.value === "planning" &&
      validTarget(
        skill.value,
        fighter,
        party.value.some((p) => p.id === id),
      )
    )
      targetId.value = id;
  }
  function clear() {
    if (phase.value === "planning") {
      skillId.value = undefined;
      targetId.value = undefined;
    }
  }
  function lock() {
    if (canLock.value) phase.value = "locked";
  }
  function unlock() {
    if (phase.value === "locked") phase.value = "planning";
  }
  function resolve() {
    stop();
    if (phase.value === "resolution") return;
    if (
      !skill.value ||
      !validTarget(
        skill.value,
        target.value,
        party.value.some((p) => p.id === targetId.value),
      )
    ) {
      skillId.value = "defend";
      targetId.value = "p1";
    }
    const chosen = skill.value!;
    const chosenTarget = target.value!;
    const result = preview.value;
    let effect: string;
    if (chosen.id === "swap") {
      const me = party.value[0]!;
      const oldRank = me.rank;
      me.rank = chosenTarget.rank;
      chosenTarget.rank = oldRank;
      effect = `Mage ↔ ${chosenTarget.role} · ranks swapped`;
    } else if (chosen.id === "defend") {
      chosenTarget.state = "Defending";
      effect = "Defending · 1t";
    } else {
      chosenTarget.hp = Math.max(0, chosenTarget.hp - result.damage);
      effect = `${chosenTarget.name} −${result.damage}${result.combo ? " · " + result.combo : ""}`;
      if (result.combo)
        chosenTarget.state = chosen.id === "lightning" ? "Stunned" : "Blinded";
      else if (chosen.sets) chosenTarget.state = chosen.sets.split(" · ")[0];
      resonance.value = Math.min(100, resonance.value + result.resonance);
    }
    events.value = [
      {
        actor: "Cave bat",
        action: "Screech",
        effect: "Back rank · Blinded 1t",
        speed: 19,
      },
      {
        actor: "P3 · Rogue",
        action: "Assassinate",
        effect: "No Off-balance · normal hit",
        speed: 16,
      },
      { actor: "P1 · Mage", action: chosen.name, effect, speed: chosen.speed },
      {
        actor: "P4 · Druid",
        action: "Rain call",
        effect: "Slime · sets Soaked 2t",
        speed: 11,
      },
      {
        actor: "Skeleton warden",
        action: "Bone cleave",
        effect:
          enemies.value[0]?.state === "Stunned"
            ? "Stunned → skipped"
            : "Front rank · Off-balance",
        speed: 9,
      },
      {
        actor: "P2 · Warrior",
        action: "Shield bash",
        effect: "Slime · sets Off-balance",
        speed: 8,
      },
      {
        actor: "Ember slime",
        action: "Fire breath",
        effect: "Front rank · Burning",
        speed: 6,
      },
    ].sort((a, b) => b.speed - a.speed);
    replayIndex.value = 0;
    phase.value = "resolution";
    notice.value = effect;
  }
  function nextTurn() {
    stop();
    turn.value++;
    phase.value = "intent";
    seconds.value = 2;
    skillId.value = undefined;
    targetId.value = undefined;
    notice.value = "";
  }
  function tick() {
    if (ultimateOpen.value) return;
    if (phase.value === "resolution") {
      replayIndex.value = Math.min(events.value.length, replayIndex.value + 1);
      if (replayIndex.value >= events.value.length) stop();
      return;
    }
    seconds.value--;
    if (seconds.value > 0) return;
    if (phase.value === "intent") {
      phase.value = "planning";
      seconds.value = 10;
    } else {
      if (phase.value === "planning") {
        skillId.value = "defend";
        targetId.value = "p1";
      }
      resolve();
    }
  }
  function toggleTimer() {
    if (running.value) {
      stop();
      return;
    }
    running.value = true;
    timer = setInterval(
      tick,
      1000 / (phase.value === "resolution" ? replaySpeed.value : 1),
    );
  }
  function setReplaySpeed(speed: number) {
    const wasRunning = running.value;
    stop();
    replaySpeed.value = speed;
    if (wasRunning) toggleTimer();
  }
  function dismissUltimate() {
    clearInterval(ultimateTimer);
    ultimateTimer = undefined;
    ultimateOpen.value = false;
  }
  function proposeUltimate() {
    if (resonance.value < 100 || !["planning", "locked"].includes(phase.value))
      return;
    stop();
    dismissUltimate();
    ultimateSeconds.value = 3;
    ultimateOpen.value = true;
    ultimateTimer = setInterval(() => {
      ultimateSeconds.value = Math.max(
        0,
        Number((ultimateSeconds.value - 0.1).toFixed(1)),
      );
      if (ultimateSeconds.value <= 0) {
        dismissUltimate();
        notice.value = "Confirmation expired — no Resonance spent.";
      }
    }, 100);
  }
  function confirmUltimate() {
    if (
      !ultimateOpen.value ||
      ultimateSeconds.value <= 0 ||
      resonance.value < 100
    )
      return;
    dismissUltimate();
    resonance.value = 0;
    ultimateAccepted.value = true;
    if (party.value[3]!.hp > 0) {
      party.value.forEach((member) => {
        if (member.hp > 0)
          member.hp = Math.min(
            member.maxHp,
            member.hp + Math.round(member.maxHp * 0.25),
          );
      });
    }
    enemies.value.forEach((e) => {
      e.hp = Math.max(0, e.hp - 60);
      e.state = "Marked";
    });
    phase.value = "resolution";
    replayIndex.value = 1;
    events.value = [
      {
        actor: "Party",
        action: "Resonant Cataclysm",
        effect: "60 dmg to every enemy · Bulwark · Marked 2t",
        speed: 99,
      },
    ];
    notice.value = "Team Ultimate confirmed · Resonance spent: 100";
  }
  function loadScenario(value: string) {
    stop();
    dismissUltimate();
    scenario.value = value;
    ultimateAccepted.value = false;
    party.value = initialParty.map((p) => ({ ...p }));
    enemies.value = initialEnemies.map((p) => ({ ...p }));
    phase.value = "planning";
    turn.value = 3;
    seconds.value = 10;
    resonance.value = 60;
    skillId.value = "lightning";
    targetId.value = "skeleton";
    notice.value = "";
    events.value = [];
    replayIndex.value = 0;
    if (value === "intent") {
      phase.value = "intent";
      seconds.value = 2;
      skillId.value = undefined;
      targetId.value = undefined;
    }
    if (value === "locked") {
      phase.value = "locked";
      seconds.value = 3;
    }
    if (value === "swap") {
      skillId.value = "swap";
      targetId.value = "p3";
      seconds.value = 5;
    }
    if (value === "offline") {
      party.value[2]!.name = "Companion · AI";
      party.value[3]!.state = "Offline · auto Defend";
      skillId.value = undefined;
      targetId.value = undefined;
      seconds.value = 8;
    }
    if (["resolution", "missed", "secret"].includes(value)) {
      resolve();
      replayIndex.value = value === "missed" ? 6 : 3;
      if (value === "missed")
        notice.value =
          "COMBO MISSED · ORDER — Assassinate hit before Off-balance existed";
      if (value === "secret") {
        turn.value = 4;
        notice.value = "SECRET COMBO DISCOVERED · Wildfire";
        enemies.value.forEach((e) => (e.state = "Burning"));
      }
    }
    if (value === "ultimate") {
      resonance.value = 100;
      party.value[3]!.hp = 0;
      party.value[3]!.state = "KO";
      turn.value = 5;
    }
  }
  onUnmounted(() => {
    stop();
    dismissUltimate();
  });
  return {
    party,
    enemies,
    phase,
    scenario,
    skill,
    skillId,
    target,
    targetId,
    resonance,
    turn,
    seconds,
    running,
    replayIndex,
    replaySpeed,
    notice,
    events,
    preview,
    canLock,
    actionLabel,
    ultimateOpen,
    ultimateSeconds,
    ultimateAccepted,
    selectSkill,
    selectTarget,
    clear,
    lock,
    unlock,
    resolve,
    nextTurn,
    toggleTimer,
    setReplaySpeed,
    proposeUltimate,
    dismissUltimate,
    confirmUltimate,
    loadScenario,
    stop,
  };
}
