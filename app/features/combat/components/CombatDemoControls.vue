<script setup lang="ts">
import type { Phase } from "../types";
defineProps<{
  view: string;
  scenario: string;
  scenarioOptions: readonly (readonly string[])[];
  running: boolean;
  resolving: boolean;
  phase: Phase;
  message: string;
}>();
const emit = defineEmits<{
  view: [view: string];
  scenario: [scenario: string];
  timer: [];
  resolve: [];
  fight: [];
}>();
function changeScenario(event: Event) {
  emit("scenario", (event.target as HTMLSelectElement).value);
}
</script>

<template>
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
        @click="$emit('view', tab.id)"
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
      ><UiButton variant="ghost" @click="$emit('timer')">{{
        running ? "Pause" : resolving ? "Play replay" : "Start timer"
      }}</UiButton
      ><UiButton v-if="phase === 'locked'" @click="$emit('resolve')"
        >Simulate party ready</UiButton
      ></template
    ><UiButton v-if="view === 'boss'" @click="$emit('fight')">Fight</UiButton
    ><span role="status">{{ message }}</span>
  </nav>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
.combat-demo-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border-subtle);
  background: var(--color-surface-raised);
}
.combat-demo-bar__label {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}
.combat-demo-bar select {
  background: var(--color-surface-overlay);
  border: 1px solid var(--color-border-strong);
  padding: var(--space-2);
  min-height: 40px;
  max-width: 100%;
}
.combat-demo-bar [aria-pressed="true"] {
  color: var(--color-accent-strong);
  border-color: var(--color-accent);
}
@media (max-width: breakpoints.$mobile) {
  .combat-demo-bar {
    padding: var(--space-3);
    gap: var(--space-3);
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-demo-bar .ui-button {
    padding-inline: var(--space-3);
  }
}
</style>
