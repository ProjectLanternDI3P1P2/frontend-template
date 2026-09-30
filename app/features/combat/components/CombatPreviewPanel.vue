<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import type {
  Fighter,
  Phase,
  Skill,
  SkillId,
  CombatEvent,
  ActionPreview,
} from "../types";
import { rankNames } from "../presentation";
defineProps<{
  phase: Phase;
  scenario: string;
  resolving: boolean;
  seconds: number;
  actionLabel: string;
  party: readonly Fighter[];
  events: readonly CombatEvent[];
  replayIndex: number;
  skillId: SkillId | undefined;
  skill: Skill | undefined;
  target: Fighter | undefined;
  preview: ActionPreview;
  resonance: number;
}>();
defineEmits<{
  bestiary: [];
}>();
</script>

<template>
  <CombatPanel
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
      :class="i === 1 ? 'tone--green' : 'tone--fire'"
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
    <small class="detail-panel__label">Counter-play</small>
    <p class="detail-panel__text">
      Swap the Warrior out of the front, Defend, or stun the warden before it
      acts (it is Soaked → Lightning).
    </p></CombatPanel
  >
  <CombatPanel
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
    </div></CombatPanel
  >
  <CombatPanel
    v-else-if="scenario === 'offline'"
    title="Seats & fallbacks"
    class="combat-panel detail-panel"
    ><div class="combo-step tone--fire">
      <small>Disconnected · Player 4</small>
      <h3>Locked automatically on Defend</h3>
      <p>
        Seat and loot rights are kept; control returns at the next planning
        phase after reconnect.
      </p>
    </div>
    <div class="combo-step">
      <small>AI companion · seat 3</small>
      <h3>Plans like a player, instantly</h3>
      <p>
        Reads states on targets and prefers consumers when a combo is available.
      </p>
    </div>
    <small class="detail-panel__label">Solo run</small>
    <p class="detail-panel__text">
      3 companions fill the party. Planning ends once you lock.
    </p></CombatPanel
  >
  <CombatPanel
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
      <UiButton variant="ghost" @click="$emit('bestiary')"
        >Open combo bestiary</UiButton
      ></template
    >
    <template v-else-if="scenario === 'missed'"
      ><div class="combo-step tone--fire">
        <small>#2 · SPD 16 · No combo</small>
        <h3>Player 3 · Assassinate</h3>
        <p>needs Off-balance on the slime</p>
      </div>
      <p class="mono muted">↓ 4 actions later</p>
      <div class="combo-step tone--green">
        <small>#6 · SPD 8 · Set</small>
        <h3>Player 2 · Shield bash</h3>
        <p>sets Off-balance · 2t</p>
      </div>
      <small>Rule</small>
      <p>
        A consumer only triggers a combo if the state is already on the target
        when it acts.
      </p></template
    >
    <ol v-else class="event-log">
      <li
        v-for="(event, i) in events"
        :key="i"
        :class="{ 'event-log__item--selected': i === replayIndex - 1 }"
      >
        <small>{{ String(i + 1).padStart(2, "0") }}</small>
        <div>
          <strong>{{ event.actor }} · {{ event.action }}</strong>
          <p class="mono muted">{{ event.effect }}</p>
        </div>
      </li>
    </ol>
  </CombatPanel>
  <CombatPanel
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
        <dd>{{ target.role }} moves to {{ rankNames[party[0]!.rank] }}</dd>
        <dt>Cost</dt>
        <dd>no skill this turn · Soaked may expire</dd>
      </dl>
      <div class="combo-step tone--fire">
        <small>Ally is notified, not asked</small>
        <p>{{ target.name }} sees the new position when resolution starts.</p>
      </div></template
    >
    <template v-else
      ><dl class="combat-facts">
        <dt>Target state</dt>
        <dd>{{ target?.state || "—" }}</dd>
        <dt>Set by</dt>
        <dd>
          {{
            target?.state === "Soaked" ? "Player 4 · Rain call (turn 02)" : "—"
          }}
        </dd>
        <dt>Combo</dt>
        <dd class="gold">{{ preview.combo || "No combo" }}</dd>
        <dt>Effect</dt>
        <dd>
          {{ preview.damage }} dmg{{
            preview.combo === "Electrocution" ? " (×2) · Stunned 1t" : ""
          }}
        </dd>
        <dt>Resonance</dt>
        <dd class="gold">
          +{{ preview.resonance }} →
          {{ Math.min(100, resonance + preview.resonance) }} / 100
        </dd>
      </dl>
      <div class="combo-step tone--fire">
        <small>Order matters</small>
        <p>
          A combo requires its state to still be on the target when your action
          resolves. A faster ally can consume it first.
        </p>
      </div></template
    >
    <p class="detail-panel__text muted">
      Allies see that you locked in — never which skill.
    </p>
    <p class="detail-panel__text muted">
      Timer out → your action becomes Defend.
    </p>
  </CombatPanel>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.tones;
@include primitives.facts;
@include primitives.steps;
.detail-panel {
  flex: 1;
}
.detail-panel h3 {
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
}
.detail-panel h2 {
  font-family: var(--font-family-body);
  margin-bottom: var(--space-2);
}
.detail-panel p + p {
  margin-top: var(--space-2);
}
.detail-panel__label {
  color: var(--color-accent);
}
.event-log .event-log__item--selected {
  border-color: var(--color-accent);
  background: var(--combat-selection);
}
.event-log {
  list-style: none;
  margin: 0;
  padding: 0;
}
.event-log li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--color-border-subtle);
}
.event-log small {
  color: var(--color-accent);
}
.event-log .mono {
  font-size: 10px;
}
@media (max-width: breakpoints.$stacked) {
  .detail-panel {
    grid-column: 1 / -1;
  }
}
.detail-panel {
  --ui-panel-body-padding: 14px var(--space-5);
}
.detail-panel .combat-facts {
  margin-block: 16px;
  padding-block: 12px;
  row-gap: 6px;
}
.detail-panel__text {
  font-size: var(--font-size-xs);
  line-height: 18px;
}
</style>
