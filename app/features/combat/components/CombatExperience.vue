<script setup lang="ts">
import { asset, rankNames, skills } from "../data";
import { validTarget } from "../rules";
import { useCombatDemo } from "../composables/useCombatDemo";
import CombatArena from "./CombatArena.vue";
import CombatBestiary from "./CombatBestiary.vue";
import CombatFighter from "./CombatFighter.vue";
import CombatModal from "./CombatModal.vue";
import type { Fighter } from "../types";
import "../combat.scss";
const route = useRoute();
const view = ref("arena");
const demo = useCombatDemo();
const {
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
} = demo;
const modal = ref<"object" | "run" | "">("");
const potions = ref(3);
const message = ref("");
const scenarioOptions = [
  ["intent", "85 · Enemy intents"],
  ["planning", "86 · Skill & target"],
  ["locked", "87 · Locked & waiting"],
  ["resolution", "88 · Combo triggered"],
  ["missed", "89 · Combo missed"],
  ["ultimate", "90 · Team Ultimate"],
  ["swap", "91 · Swap place"],
  ["offline", "92 · Disconnected & AI"],
  ["secret", "93 · Secret discovered"],
];

const resolving = computed(() => phase.value === "resolution");
const lockedCount = computed(() =>
  phase.value === "intent"
    ? 0
    : phase.value === "locked" || scenario.value === "offline"
      ? 3
      : resolving.value
        ? 4
        : 2,
);
function isLocked(index: number) {
  return (
    phase.value !== "intent" &&
    (resolving.value ||
      index === 1 ||
      index === 3 ||
      (index === 0 && phase.value === "locked"))
  );
}
function partyStatus(index: number) {
  if (!party.value[index]?.hp) return "KO";
  if (scenario.value === "offline" && index === 3) return "OFFLINE";
  if (scenario.value === "offline" && index === 2) return "AI · LOCKED";
  return phase.value === "intent"
    ? "READING"
    : resolving.value
      ? "DONE"
      : isLocked(index)
        ? "LOCKED"
        : "CHOOSING";
}
function selectable(fighter: Fighter, ally: boolean) {
  return phase.value === "planning" && validTarget(skill.value, fighter, ally);
}
function changeView(next: string) {
  demo.stop();
  demo.dismissUltimate();
  view.value = next;
}
function enterTactics() {
  demo.loadScenario("intent");
  view.value = "tactics";
}
function changeScenario(event: Event) {
  demo.loadScenario((event.target as HTMLSelectElement).value);
}
function usePotion() {
  if (!potions.value) return;
  const me = party.value[0]!;
  me.hp = Math.min(me.maxHp, me.hp + 25);
  potions.value--;
  message.value = `Potion used · Mage ${me.hp}/${me.maxHp} HP`;
  modal.value = "";
}
function keyboard(event: KeyboardEvent) {
  if (ultimateOpen.value) {
    if (event.code === "Space" && event.target === document.body) {
      event.preventDefault();
      demo.confirmUltimate();
    }
    return;
  }
  if (
    view.value !== "tactics" ||
    modal.value ||
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLButtonElement ||
    event.target instanceof HTMLAnchorElement
  )
    return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < skills.length) {
    event.preventDefault();
    demo.selectSkill(skills[index]!.id);
  }
  if (event.key === "Escape") demo.clear();
  if (event.key === "Enter") demo.lock();
}
onMounted(() => {
  if (["tactics", "boss", "bestiary"].includes(String(route.query.view)))
    view.value = String(route.query.view);
  if (scenarioOptions.some(([id]) => id === route.query.state))
    demo.loadScenario(String(route.query.state));
  window.addEventListener("keydown", keyboard);
});
onUnmounted(() => window.removeEventListener("keydown", keyboard));
</script>

<template>
  <div class="combat-root">
    <a href="#combat-main" class="skip-link">Skip to combat</a>
    <main id="combat-main">
      <CombatArena
        v-if="view === 'arena' || view === 'boss'"
        :boss="view === 'boss'"
        @fight="enterTactics"
        @object="modal = 'object'"
        @run="modal = 'run'"
      />
      <template v-else>
        <header class="combat-topbar">
          <h1>{{ view === "bestiary" ? "Combo bestiary" : "Combat" }}</h1>
          <div class="combat-topbar__location">
            <p>
              {{
                view === "bestiary"
                  ? "Party · Lantern Wardens"
                  : "Crypt of Ashes · Ossuary"
              }}
            </p>
            <p class="mono muted">
              {{
                view === "bestiary"
                  ? "shared by 4 members · combat discoveries"
                  : `Turn ${String(turn).padStart(2, "0")} · Hard · seed 7F3A-91C2 · enc_0440`
              }}
            </p>
          </div>
          <template v-if="view === 'tactics'">
            <div class="combat-topbar__party">
              <small>Locked in</small>
              <div class="mini-party">
                <span
                  v-for="(member, i) in party"
                  :key="member.id"
                  class="mini-portrait"
                  :class="{ 'is-locked': isLocked(i) }"
                  ><img
                    :src="asset(`imgHero${i || ''}`)"
                    :alt="`${member.name}: ${partyStatus(i)}`" ><img
                    v-if="isLocked(i)"
                    class="lock-dot"
                    :src="asset('imgLockDot')"
                    alt="" ></span
                ><span class="muted">{{
                  resolving
                    ? `replaying turn ${turn}`
                    : `${lockedCount} of 4 locked`
                }}</span>
              </div>
            </div>
            <span class="state-pill phase-pill"
              ><img :src="asset('imgPillGlyph')" alt="" >{{
                resolving
                  ? "Resolving"
                  : phase === "intent"
                    ? "Enemy intent"
                    : "Planning"
              }}</span
            >
            <div class="combat-topbar__timer">
              <small>{{ resolving ? "Replay" : "Planning" }}</small
              ><strong class="mono">{{
                resolving
                  ? `${replayIndex} / ${events.length}`
                  : `${String(seconds).padStart(2, "0")} s`
              }}</strong>
            </div>
          </template>
          <template v-else
            ><span class="state-pill">◇ 7 / 12 found</span
            ><UiButton variant="ghost" @click="changeView('tactics')"
              >Back to combat</UiButton
            ></template
          >
        </header>
        <CombatBestiary v-if="view === 'bestiary'" />
        <div v-else class="combat-grid">
          <div class="combat-primary">
            <UiPanel
              :title="`Battlefield · Turn ${String(turn).padStart(2, '0')}${resolving ? ' · Resolving' : ''}`"
              class="combat-panel battlefield"
            >
              <template #actions
                ><span class="mono muted"
                  >3 ranks per side · enemies act on their revealed intent</span
                ></template
              >
              <div class="battlefield__scroll">
                <div class="battlefield__ranks">
                  <div class="battlefield__side battlefield__side--party">
                    <div
                      v-for="(rank, i) in rankNames"
                      :key="rank"
                      class="rank-lane"
                    >
                      <small>{{ rank }}</small>
                      <div
                        class="rank-lane__fighters"
                        :class="{ 'rank-lane__fighters--middle': i !== 0 }"
                      >
                        <CombatFighter
                          v-for="member in party.filter((p) => p.rank === i)"
                          :key="member.id"
                          :fighter="member"
                          :selected="
                            targetId === member.id || member.id === 'p1'
                          "
                          :selectable="selectable(member, true)"
                          @select="demo.selectTarget"
                        />
                      </div>
                    </div>
                    <small class="side-label">Party</small>
                  </div>
                  <div class="battlefield__versus"><span>VS</span></div>
                  <div class="battlefield__side battlefield__side--enemies">
                    <div
                      v-for="(enemy, i) in enemies"
                      :key="enemy.id"
                      class="rank-lane"
                    >
                      <small>{{ rankNames[2 - i] }}</small>
                      <div v-if="!resolving" class="enemy-intent">
                        <div>
                          <small>Intent</small
                          ><span class="mono">SPD {{ enemy.speed }}</span>
                        </div>
                        <strong>{{ enemy.intent }}</strong>
                        <p>→ {{ i === 2 ? "Back" : "Front" }} rank</p>
                        <p>{{ enemy.threat }}</p>
                      </div>
                      <CombatFighter
                        :fighter="enemy"
                        enemy
                        :selected="targetId === enemy.id"
                        :selectable="selectable(enemy, false)"
                        @select="demo.selectTarget"
                      />
                      <div
                        v-if="
                          preview.combo && targetId === enemy.id && !resolving
                        "
                        class="combo-tooltip"
                      >
                        <small>Combo ready</small>
                        <p>{{ skill?.name }} × {{ enemy.state }}</p>
                        <p>= {{ preview.combo?.toUpperCase() }}</p>
                        <p>
                          dmg ×{{ skillId === "lightning" ? 2 : 1 }} ·
                          {{ skillId === "lightning" ? "Stunned" : "Blinded" }}
                          1t
                        </p>
                      </div>
                    </div>
                    <small class="side-label">Enemies</small>
                  </div>
                  <div
                    v-if="skillId === 'swap' && target && !resolving"
                    class="swap-preview-arrow"
                  >
                    <img
                      :src="asset('imgSwapArrow', '271-17921')"
                      alt=""
                    ><small>Swap · SPD 20</small>
                    <p>Mage ↔ {{ target.role }}</p>
                  </div>
                  <div
                    v-if="notice && resolving"
                    class="battlefield__notice"
                    :class="{
                      'battlefield__notice--warning': scenario === 'missed',
                    }"
                  >
                    <small>{{
                      scenario === "secret"
                        ? "Secret combo discovered"
                        : scenario === "missed"
                          ? "Combo missed · order"
                          : preview.combo || "Action resolved"
                    }}</small
                    ><strong>{{
                      scenario === "secret" ? "Wildfire" : notice
                    }}</strong>
                    <p v-if="scenario === 'missed'">
                      Rogue SPD 16 acted before Shield bash SPD 8. Off-balance
                      is available next turn.
                    </p>
                  </div>
                </div>
              </div>
              <p
                v-if="
                  phase === 'locked' ||
                  phase === 'intent' ||
                  scenario === 'offline'
                "
                class="battlefield__banner"
              >
                {{
                  phase === "locked"
                    ? "Waiting for Player 3 — the phase ends as soon as everyone is locked"
                    : scenario === "offline"
                      ? "Player 4 lost connection — plays Defend until they are back"
                      : `Turn ${turn} — the enemies reveal their intent`
                }}
              </p>
            </UiPanel>
            <UiPanel
              v-if="!resolving"
              title="Actions — Player 1 · Mage"
              class="combat-panel combat-actions"
            >
              <template #actions
                ><span class="mono muted">{{
                  phase === "locked"
                    ? "locked · waiting for the party"
                    : "choose 1 skill + 1 target · secret until resolve"
                }}</span></template
              >
              <div class="skill-grid">
                <button
                  v-for="(action, i) in skills"
                  :key="action.id"
                  class="skill-card"
                  :class="[
                    `tone-${action.tone}`,
                    { 'is-selected': skillId === action.id },
                  ]"
                  :disabled="phase !== 'planning'"
                  :aria-pressed="skillId === action.id"
                  @click="demo.selectSkill(action.id)"
                >
                  <span class="skill-card__header"
                    ><span class="skill-card__icon">{{ action.glyph }}</span
                    ><span
                      ><strong>{{ action.name }}</strong
                      ><span class="mono muted"
                        >SPD {{ action.speed || "—" }} ·
                        {{
                          action.target === "self"
                            ? "self"
                            : `1 ${action.target}`
                        }}</span
                      ></span
                    ><kbd>{{ i + 1 }}</kbd></span
                  >
                  <span v-if="action.sets" class="skill-card__rule"
                    ><small>Sets</small>{{ action.sets }}</span
                  >
                  <span v-if="action.consumes" class="skill-card__rule"
                    ><small class="tone-water">Consumes</small
                    >{{ action.consumes }}</span
                  >
                  <span v-if="action.id === 'arcane'" class="skill-card__rule"
                    ><small>Plain</small>no state</span
                  >
                  <span v-if="action.id === 'swap'" class="skill-card__rule"
                    ><small>Moves</small>ends your turn</span
                  >
                  <span v-if="action.combo" class="skill-card__combo"
                    >→ {{ action.combo }}</span
                  >
                </button>
              </div>
              <div class="combat-actions__footer">
                <div>
                  <strong>{{
                    phase === "intent"
                      ? "Read the intents — planning opens in 2 s"
                      : `${phase === "locked" ? "Locked: " : ""}${actionLabel}`
                  }}</strong>
                  <p class="mono muted">
                    {{
                      phase === "locked"
                        ? "resolution starts when all players are locked or at 0 s"
                        : "Esc to change target · Enter to lock · choice stays secret"
                    }}
                  </p>
                </div>
                <div class="button-row">
                  <UiButton
                    v-if="phase === 'planning'"
                    variant="ghost"
                    @click="demo.clear"
                    >Clear</UiButton
                  ><UiButton
                    v-if="phase === 'locked'"
                    variant="ghost"
                    @click="demo.unlock"
                    >Unlock</UiButton
                  ><UiButton v-else :disabled="!canLock" @click="demo.lock"
                    >Lock action</UiButton
                  >
                </div>
              </div>
            </UiPanel>
            <UiPanel
              v-else
              title="Replay · Resolution order"
              class="combat-panel replay-panel"
            >
              <template #actions
                ><span class="mono muted"
                  >sorted by SPD · local demonstration</span
                ></template
              >
              <ol class="replay-list">
                <li
                  v-for="(event, i) in events"
                  :key="i"
                  :class="{ 'is-selected': i === replayIndex - 1 }"
                >
                  <small
                    >{{ String(i + 1).padStart(2, "0") }}
                    <span class="muted">SPD {{ event.speed }}</span></small
                  ><strong>{{ event.actor }}</strong>
                  <p>{{ event.action }}</p>
                  <span class="mono muted">{{ event.effect }}</span>
                </li>
              </ol>
              <div class="combat-actions__footer">
                <p class="mono muted">
                  event {{ replayIndex }} of {{ events.length }}
                </p>
                <div class="button-row">
                  <UiButton
                    v-for="speed in [1, 2]"
                    :key="speed"
                    variant="ghost"
                    :aria-pressed="replaySpeed === speed"
                    @click="demo.setReplaySpeed(speed)"
                    >{{ speed }}×</UiButton
                  ><UiButton
                    variant="ghost"
                    @click="replayIndex = events.length"
                    >Skip to end</UiButton
                  ><UiButton @click="demo.nextTurn">Next turn</UiButton>
                </div>
              </div>
            </UiPanel>
          </div>
          <aside
            class="combat-sidebar"
            aria-label="Party and combat information"
          >
            <UiPanel title="Team resonance" class="combat-panel resonance-panel"
              ><template #actions
                ><span class="mono muted">{{ resonance }} / 100</span></template
              >
              <div
                class="resonance-gauge"
                role="meter"
                aria-label="Team resonance"
                :aria-valuenow="resonance"
                :aria-valuemin="0"
                :aria-valuemax="100"
              >
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="{ filled: resonance >= i * 20 }"
                />
              </div>
              <p>
                {{
                  resonance === 100
                    ? "Gauge full · Team Ultimate available"
                    : "+20 per combo · full gauge unlocks a Team Ultimate"
                }}
              </p>
              <p class="mono muted">
                Shared by the whole party · resets after the Ultimate
              </p>
              <UiButton
                v-if="resonance === 100 && !resolving"
                @click="demo.proposeUltimate"
                >Propose Team Ultimate</UiButton
              ></UiPanel
            >
            <UiPanel title="Party" class="combat-panel party-panel"
              ><template #actions
                ><span class="mono muted"
                  >choices hidden until resolve</span
                ></template
              >
              <div
                v-for="(member, i) in party"
                :key="member.id"
                class="party-row"
              >
                <span class="mini-portrait"
                  ><img :src="asset(`imgHero${i || ''}`)" alt=""
                ></span>
                <div>
                  <strong>{{ member.name }}</strong>
                  <p class="mono muted">
                    {{ member.role }} · {{ rankNames[member.rank] }}
                  </p>
                </div>
                <small>{{ partyStatus(i) }}</small>
                <div class="party-row__health">
                  <meter
                    :value="member.hp"
                    :max="member.maxHp"
                    :aria-label="`${member.name} health`"
                  /><span class="mono muted"
                    >{{ member.hp }}/{{ member.maxHp }}</span
                  >
                </div>
              </div></UiPanel
            >
            <UiPanel
              v-if="phase === 'intent'"
              title="Threat by rank"
              class="combat-panel detail-panel"
              ><template #actions
                ><span class="mono muted">from revealed intents</span></template
              >
              <div
                v-for="(rank, i) in ['Front rank', 'Mid rank', 'Back rank']"
                :key="rank"
                class="combo-step"
                :class="i === 1 ? 'tone-green' : 'tone-fire'"
              >
                <small>{{ rank }}</small>
                <h3>
                  {{
                    [
                      "Bone cleave + Fire breath",
                      "No attack",
                      "Screech · SPD 19, acts first",
                    ][i]
                  }}
                </h3>
                <p class="mono muted">
                  {{
                    [
                      "72 dmg · Off-balance · Burning 2t",
                      "no incoming damage",
                      "12 dmg each · Blinded 1t",
                    ][i]
                  }}
                </p>
              </div>
              <small>Counter-play</small>
              <p>
                Swap the Warrior out of the front, Defend, or stun the warden
                before it acts (it is Soaked → Lightning).
              </p></UiPanel
            >
            <UiPanel
              v-else-if="phase === 'locked'"
              title="Lock-in status"
              class="combat-panel detail-panel"
              ><h2>3 of 4 ready</h2>
              <p class="mono muted">{{ seconds }} s left of 10 s</p>
              <dl class="combat-facts">
                <dt>Ends early</dt>
                <dd>when every living player has locked</dd>
                <dt>Timer out</dt>
                <dd>unlocked players play Defend</dd>
                <dt>Disconnected</dt>
                <dd>plays Defend automatically</dd>
                <dt>Secret</dt>
                <dd>others only see the lit portrait</dd>
              </dl>
              <div class="combo-step">
                <small>Your action · locked</small>
                <p>{{ actionLabel }}</p>
                <p class="muted">you can unlock until the timer ends</p>
              </div></UiPanel
            >
            <UiPanel
              v-else-if="scenario === 'offline'"
              title="Seats & fallbacks"
              class="combat-panel detail-panel"
              ><div class="combo-step tone-fire">
                <small>Disconnected · Player 4</small>
                <h3>Locked automatically on Defend</h3>
                <p>
                  Seat and loot rights are kept; control returns at the next
                  planning phase after reconnect.
                </p>
              </div>
              <div class="combo-step">
                <small>AI companion · seat 3</small>
                <h3>Plans like a player, instantly</h3>
                <p>
                  Reads states on targets and prefers consumers when a combo is
                  available.
                </p>
              </div>
              <small>Solo run</small>
              <p>
                3 companions fill the party. Planning ends once you lock.
              </p></UiPanel
            >
            <UiPanel
              v-else-if="resolving"
              :title="
                scenario === 'secret'
                  ? 'New bestiary entry'
                  : scenario === 'missed'
                    ? 'Why it failed'
                    : 'Event log'
              "
              class="combat-panel detail-panel"
            >
              <template v-if="scenario === 'secret'"
                ><h2>Wildfire</h2>
                <dl class="combat-facts">
                  <dt>State</dt>
                  <dd>Burning</dd>
                  <dt>Set by</dt>
                  <dd>Fireball · Mage</dd>
                  <dt>Consumed by</dt>
                  <dd>Gust · Druid</dd>
                  <dt>Effect</dt>
                  <dd>Burning 2t on every enemy</dd>
                </dl>
                <p>Saved to the party bestiary for everyone who took part.</p>
                <UiButton variant="ghost" @click="changeView('bestiary')"
                  >Open combo bestiary</UiButton
                ></template
              >
              <template v-else-if="scenario === 'missed'"
                ><div class="combo-step tone-fire">
                  <small>#2 · SPD 16 · No combo</small>
                  <h3>Player 3 · Assassinate</h3>
                  <p>needs Off-balance on the slime</p>
                </div>
                <p class="mono muted">↓ 4 actions later</p>
                <div class="combo-step tone-green">
                  <small>#6 · SPD 8 · Set</small>
                  <h3>Player 2 · Shield bash</h3>
                  <p>sets Off-balance · 2t</p>
                </div>
                <small>Rule</small>
                <p>
                  A consumer only triggers a combo if the state is already on
                  the target when it acts.
                </p></template
              >
              <ol v-else class="event-log">
                <li
                  v-for="(event, i) in events"
                  :key="i"
                  :class="{ 'is-selected': i === replayIndex - 1 }"
                >
                  <small>{{ String(i + 1).padStart(2, "0") }}</small>
                  <div>
                    <strong>{{ event.actor }} · {{ event.action }}</strong>
                    <p class="mono muted">{{ event.effect }}</p>
                  </div>
                </li>
              </ol>
            </UiPanel>
            <UiPanel
              v-else
              :title="skillId === 'swap' ? 'Swap preview' : 'Combo preview'"
              class="combat-panel detail-panel"
              ><template #actions
                ><span class="mono muted">your action only</span></template
              >
              <h3>{{ actionLabel }}</h3>
              <p class="mono muted">
                {{
                  skill
                    ? `SPD ${skill.speed} · ${skill.damage} base dmg`
                    : "Select a skill, then a highlighted target."
                }}
              </p>
              <template v-if="skillId === 'swap' && target"
                ><dl class="combat-facts">
                  <dt>Before</dt>
                  <dd>Mage: {{ rankNames[party[0]!.rank] }}</dd>
                  <dt>After</dt>
                  <dd>Mage: {{ rankNames[target.rank] }}</dd>
                  <dt>Ally</dt>
                  <dd>
                    {{ target.role }} moves to {{ rankNames[party[0]!.rank] }}
                  </dd>
                  <dt>Cost</dt>
                  <dd>no skill this turn · Soaked may expire</dd>
                </dl>
                <div class="combo-step tone-fire">
                  <small>Ally is notified, not asked</small>
                  <p>
                    {{ target.name }} sees the new position when resolution
                    starts.
                  </p>
                </div></template
              >
              <template v-else
                ><dl class="combat-facts">
                  <dt>Target state</dt>
                  <dd>{{ target?.state || "—" }}</dd>
                  <dt>Set by</dt>
                  <dd>
                    {{
                      target?.state === "Soaked"
                        ? "Player 4 · Rain call (turn 02)"
                        : "—"
                    }}
                  </dd>
                  <dt>Combo</dt>
                  <dd class="gold">{{ preview.combo || "No combo" }}</dd>
                  <dt>Effect</dt>
                  <dd>
                    {{ preview.damage }} dmg{{
                      preview.combo === "Electrocution"
                        ? " (×2) · Stunned 1t"
                        : ""
                    }}
                  </dd>
                  <dt>Resonance</dt>
                  <dd class="gold">
                    +{{ preview.resonance }} →
                    {{ Math.min(100, resonance + preview.resonance) }} / 100
                  </dd>
                </dl>
                <div class="combo-step tone-fire">
                  <small>Order matters</small>
                  <p>
                    A combo requires its state to still be on the target when
                    your action resolves. A faster ally can consume it first.
                  </p>
                </div></template
              >
              <p class="muted">
                Allies see that you locked in — never which skill.
              </p>
              <p class="muted">Timer out → your action becomes Defend.</p>
            </UiPanel>
          </aside>
        </div>
      </template>
    </main>
    <nav class="combat-demo-bar" aria-label="Combat demonstration controls">
      <NuxtLink to="/">← Project Lantern</NuxtLink
      ><span class="combat-demo-bar__label">Interactive demo · local data</span>
      <div class="button-row">
        <UiButton
          v-for="tab in [
            { id: 'arena', name: 'Encounter' },
            { id: 'boss', name: 'Boss' },
            { id: 'tactics', name: 'Tactics' },
            { id: 'bestiary', name: 'Bestiary' },
          ]"
          :key="tab.id"
          variant="ghost"
          :aria-pressed="view === tab.id"
          @click="changeView(tab.id)"
          >{{ tab.name }}</UiButton
        >
      </div>
      <template v-if="view === 'tactics'"
        ><label for="combat-state" class="visually-hidden"
          >Preview combat state</label
        ><select id="combat-state" :value="scenario" @change="changeScenario">
          <option
            v-for="option in scenarioOptions"
            :key="option[0]"
            :value="option[0]"
          >
            {{ option[1] }}
          </option></select
        ><UiButton variant="ghost" @click="demo.toggleTimer">{{
          running ? "Pause" : resolving ? "Play replay" : "Start timer"
        }}</UiButton
        ><UiButton v-if="phase === 'locked'" @click="demo.resolve"
          >Simulate party ready</UiButton
        ></template
      ><UiButton v-if="view === 'boss'" @click="enterTactics">Fight</UiButton
      ><span role="status">{{ message }}</span>
    </nav>
    <CombatModal
      :open="ultimateOpen"
      label="Team Ultimate confirmation"
      @close="demo.dismissUltimate"
      ><div class="ultimate-heading">
        <div>
          <small>Proposed by Player 2 · Resonance 100 / 100</small>
          <h2>Team Ultimate</h2>
          <p class="muted">
            Resonant Cataclysm — its effect is built from the classes still
            standing.
          </p>
        </div>
        <div class="ultimate-clock">
          <img :src="asset('imgRingTrack', '271-17398')" alt="" ><img
            class="ultimate-clock__progress"
            :src="asset('imgRingProgress', '271-17398')"
            alt=""
          ><strong>{{ ultimateSeconds.toFixed(1) }}</strong
          ><span>seconds</span>
        </div>
      </div>
      <small>Confirmations · all living players</small>
      <div class="ultimate-party">
        <div
          v-for="(member, i) in party"
          :key="member.id"
          :class="{ 'is-ko': !member.hp }"
        >
          <span class="mini-portrait"
            ><img :src="asset(`imgHero${i || ''}`)" alt="" ></span
          ><strong>{{ member.name }}</strong>
          <p>{{ member.role }}{{ !member.hp ? " · KO" : "" }}</p>
          <small>{{
            !member.hp ? "Not required" : i ? "Confirmed" : "Waiting for you"
          }}</small>
        </div>
      </div>
      <small>Combined effect</small>
      <dl class="ultimate-effects">
        <div>
          <dt>Mage</dt>
          <dd>
            Arcane storm <span>60 dmg to every enemy, ignores ranks</span>
          </dd>
        </div>
        <div>
          <dt>Warrior</dt>
          <dd>Bulwark <span>party takes −50 % damage until next turn</span></dd>
        </div>
        <div>
          <dt>Rogue</dt>
          <dd>
            Shadow mark
            <span>all enemies Marked 2t · next hit is a critical</span>
          </dd>
        </div>
        <div class="muted">
          <dt>Druid</dt>
          <dd>
            Verdant surge
            <span>{{
              party[3]?.hp
                ? "heal 25 % for every living ally"
                : "heal 25 % — absent, player is KO"
            }}</span>
          </dd>
        </div>
      </dl>
      <p class="muted">
        If anyone does not confirm within 3 s, nothing is spent: the gauge stays
        full. The Ultimate replaces every confirmer’s action and resolves first.
      </p>
      <div class="combat-modal__footer">
        <UiButton variant="ghost" @click="demo.dismissUltimate"
          >Not now</UiButton
        ><UiButton @click="demo.confirmUltimate">Confirm · Space</UiButton>
      </div></CombatModal
    >
    <CombatModal
      :open="modal === 'object'"
      label="Combat objects"
      @close="modal = ''"
      ><h2>Objects</h2>
      <p>Healing potion · restores up to 25 HP to the Mage.</p>
      <p>
        {{ potions }} remaining · {{ party[0]!.hp }}/{{ party[0]!.maxHp }} HP
      </p>
      <div class="combat-modal__footer">
        <UiButton variant="ghost" @click="modal = ''">Back</UiButton
        ><UiButton
          :disabled="!potions || party[0]!.hp === party[0]!.maxHp"
          @click="usePotion"
          >Use potion</UiButton
        >
      </div></CombatModal
    >
    <CombatModal
      :open="modal === 'run'"
      label="Leave combat"
      @close="modal = ''"
      ><h2>Leave combat?</h2>
      <p>This ends the local encounter demonstration.</p>
      <div class="combat-modal__footer">
        <UiButton variant="ghost" @click="modal = ''">Stay</UiButton
        ><UiButton
          @click="
            modal = '';
            navigateTo('/');
          "
          >Leave combat</UiButton
        >
      </div></CombatModal
    >
    <p class="visually-hidden" aria-live="polite">{{ notice }}</p>
  </div>
</template>
