<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import { stateIcon } from "../presentation";
import type { Combo } from "../types";
const props = defineProps<{ combos: readonly Combo[] }>();
const filter = ref("All");
const selected = ref(props.combos[3] ?? props.combos[0]!);
const pinned = ref("");
const visible = computed(() =>
  props.combos.filter(
    (c) =>
      filter.value === "All" ||
      (filter.value === "Secret"
        ? c.secret
        : c.role === filter.value || c.setter.includes(filter.value)),
  ),
);
</script>
<template>
  <div class="bestiary combat-grid">
    <CombatPanel title="Known combos" class="combat-panel bestiary__list">
      <template #actions
        ><span class="mono muted">7 / 12 discovered</span></template
      >
      <div class="bestiary__filters" aria-label="Filter combos">
        <UiButton
          v-for="role in ['All', 'Mage', 'Warrior', 'Rogue', 'Druid', 'Secret']"
          :key="role"
          :variant="filter === role ? 'primary' : 'ghost'"
          :aria-pressed="filter === role"
          @click="filter = role"
          >{{ role }}</UiButton
        >
      </div>
      <div class="bestiary__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Combo</th>
              <th scope="col">State</th>
              <th scope="col">Set by</th>
              <th scope="col">Consumed by</th>
              <th scope="col">Effect</th>
              <th scope="col">Found</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(combo, i) in visible"
              :key="combo.name + i"
              :class="{
                'bestiary__row--selected': selected.name === combo.name,
                'bestiary__row--unknown': combo.unknown,
              }"
            >
              <th scope="row">
                <button
                  :disabled="combo.unknown"
                  :aria-pressed="selected.name === combo.name"
                  @click="selected = combo"
                >
                  {{ combo.name
                  }}<span v-if="combo.name === 'Wildfire'" class="state-pill"
                    >◇ NEW</span
                  >
                </button>
              </th>
              <td>
                <span
                  class="state-pill"
                  :class="`state-pill--${combo.state.toLowerCase()}`"
                  ><img
                    v-if="combo.state !== '???'"
                    :src="stateIcon(combo.state)"
                    alt=""
                  >{{ combo.state }}</span
                >
              </td>
              <td>{{ combo.setter }}</td>
              <td>{{ combo.consumer }}</td>
              <td>{{ combo.effect }}</td>
              <td>{{ combo.found }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!visible.length" class="muted">
        No combos found for this class.
      </p>
    </CombatPanel>
    <CombatPanel :title="selected.name" class="combat-panel bestiary__detail">
      <h3 class="bestiary__entry-title">{{ selected.name }}</h3>
      <p class="muted">
        {{ selected.consumer.split(" · ")[0] }} consumes {{ selected.state }}
      </p>
      <div class="combo-step tone--fire">
        <small>1 · Setter</small>
        <p>{{ selected.setter }} sets {{ selected.state }}</p>
      </div>
      <p class="mono muted bestiary__arrow">↓ must act first (higher SPD)</p>
      <div class="combo-step tone--green">
        <small>2 · Consumer</small>
        <p>{{ selected.consumer }} consumes {{ selected.state }}</p>
      </div>
      <p class="mono muted bestiary__arrow">↓ combo triggers</p>
      <div class="combo-step">
        <small>3 · Effect</small>
        <p>{{ selected.effect }} · +20 Resonance</p>
      </div>
      <dl class="combat-facts">
        <dt>Discovered</dt>
        <dd>{{ selected.found }}</dd>
        <dt>Location</dt>
        <dd>Crypt of Ashes</dd>
        <dt>Resonance</dt>
        <dd>+20</dd>
      </dl>
      <p class="muted">
        Secret entries show only their state and a hint until someone in the
        party triggers them.
      </p>
      <UiButton
        variant="ghost"
        class="bestiary__pin"
        @click="pinned = selected.name"
        >{{
          pinned === selected.name
            ? "Pinned for the party"
            : "Pin as combo hint for the party"
        }}</UiButton
      >
      <p class="visually-hidden" role="status">
        {{ pinned ? `${pinned} pinned in this demonstration` : "" }}
      </p>
    </CombatPanel>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.tones;
@include primitives.pill;
@include primitives.grid;
@include primitives.facts;
@include primitives.steps;
.bestiary {
  min-height: 999px;
}
.bestiary__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.bestiary__filters .ui-button {
  min-height: 32px;
  padding-inline: var(--space-4);
}
.bestiary__scroll {
  overflow-x: auto;
}
.bestiary table {
  width: 100%;
  border-spacing: 0 8px;
  min-width: 900px;
}
.bestiary thead th {
  font-size: 11px;
  text-transform: uppercase;
  text-align: left;
  font-weight: 400;
  padding: var(--space-2);
  border-bottom: 1px solid var(--color-border-subtle);
}
.bestiary tbody td {
  background: var(--color-surface-overlay);
  padding: var(--space-4) var(--space-2);
  border-block: 1px solid var(--color-border-subtle);
  font: 10px var(--font-family-mono);
  text-align: left;
}
.bestiary tbody th {
  background: var(--color-surface-overlay);
  padding: var(--space-4) var(--space-2);
  border-block: 1px solid var(--color-border-subtle);
  font: 10px var(--font-family-mono);
  text-align: left;
}
.bestiary tbody th {
  width: 19%;
  border-left: 1px solid var(--color-border-subtle);
}
.bestiary tbody td:last-child {
  border-right: 1px solid var(--color-border-subtle);
}
.bestiary tbody button {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font: 600 16px var(--font-family-body);
  width: 100%;
  text-align: left;
}
.bestiary .bestiary__row--selected > * {
  background: var(--combat-selection);
  border-color: var(--color-accent);
}
.bestiary .bestiary__row--unknown {
  opacity: 0.45;
}
.bestiary .bestiary__row--unknown button {
  cursor: default;
}
.bestiary__detail h3 {
  color: var(--color-accent-strong);
  font-size: 38px;
  margin-bottom: var(--space-2);
}
.bestiary__arrow {
  text-align: center;
}
.bestiary__detail .combo-step {
  margin-block: var(--space-3);
}
.bestiary__pin {
  width: 100%;
  margin-top: var(--space-7);
}
@media (max-width: breakpoints.$stacked) {
  .bestiary__detail {
    grid-column: 1;
  }
}
.bestiary__list,
.bestiary__detail {
  --ui-panel-body-padding: var(--space-5);
}
.bestiary tbody td {
  padding-block: 13px;
}
.bestiary tbody th {
  padding-block: 13px;
}
.bestiary__scroll {
  max-width: 100%;
}
</style>
