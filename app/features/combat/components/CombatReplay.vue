<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import type { CombatEvent } from "../types";
defineProps<{
  events: readonly CombatEvent[];
  replayIndex: number;
  replaySpeed: number;
}>();
defineEmits<{
  speed: [speed: number];
  skip: [];
  nextTurn: [];
}>();
</script>

<template>
  <CombatPanel
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
        :class="{ 'replay-list__item--selected': i === replayIndex - 1 }"
      >
        <small
          >{{ String(i + 1).padStart(2, "0") }}
          <span class="muted">SPD {{ event.speed }}</span></small
        ><strong>{{ event.actor }}</strong>
        <p>{{ event.action }}</p>
        <span class="mono muted">{{ event.effect }}</span>
      </li>
    </ol>
    <div class="combat-action-footer">
      <p class="mono muted">event {{ replayIndex }} of {{ events.length }}</p>
      <div class="button-row">
        <UiButton
          v-for="speed in [1, 2]"
          :key="speed"
          variant="ghost"
          :aria-pressed="replaySpeed === speed"
          @click="$emit('speed', speed)"
          >{{ speed }}×</UiButton
        ><UiButton variant="ghost" @click="$emit('skip')">Skip to end</UiButton
        ><UiButton @click="$emit('nextTurn')">Next turn</UiButton>
      </div>
    </div>
  </CombatPanel>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.action-footer;
.replay-list {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}
.replay-list li {
  background: var(--color-surface-overlay);
  border: 1px solid var(--color-border-subtle);
  min-height: 150px;
  padding: var(--space-3);
}
.replay-list small {
  display: flex;
  justify-content: space-between;
  color: var(--color-accent);
  margin-bottom: var(--space-4);
}
.replay-list strong {
  display: block;
  margin-bottom: var(--space-2);
}
.replay-list .mono {
  display: block;
  font-size: 10px;
  margin-top: var(--space-2);
}
.replay-list .replay-list__item--selected {
  border-color: var(--color-accent);
  background: var(--combat-selection);
}
@media (max-width: breakpoints.$compact) {
  .replay-list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: breakpoints.$mobile) {
  .replay-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.replay-panel {
  --ui-panel-body-padding: 14px 24px 20px;
}
</style>
