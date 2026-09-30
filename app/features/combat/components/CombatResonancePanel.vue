<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
defineProps<{
  resonance: number;
  resolving: boolean;
}>();
defineEmits<{
  propose: [];
}>();
</script>

<template>
  <CombatPanel title="Team resonance" class="combat-panel resonance-panel"
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
        :class="{ 'resonance-gauge__segment--filled': resonance >= i * 20 }"
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
    <UiButton v-if="resonance === 100 && !resolving" @click="$emit('propose')"
      >Propose Team Ultimate</UiButton
    ></CombatPanel
  >
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
.resonance-panel {
  min-height: 160px;
}
.resonance-panel {
  --ui-panel-body-padding: var(--space-4) var(--space-5) var(--space-3);
}
.resonance-gauge {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}
.resonance-gauge span {
  flex: 1;
  height: 18px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface-base);
}
.resonance-gauge .resonance-gauge__segment--filled {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.resonance-panel p {
  font-size: var(--font-size-xs);
  margin-bottom: var(--space-1);
}
.resonance-panel .mono {
  font-size: 10px;
}
.resonance-panel .ui-button {
  margin-top: var(--space-2);
  width: 100%;
}
@media (min-width: breakpoints.$wide) {
  .resonance-panel {
    height: 160px;
  }
}
</style>
