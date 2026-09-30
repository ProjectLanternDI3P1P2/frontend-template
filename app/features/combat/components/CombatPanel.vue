<script setup lang="ts">
import UiPanel from "../../../shared/ui/UiPanel.vue";
defineProps<{ title: string; headingLevel?: 2 | 3 | 4 }>();
</script>
<template>
  <UiPanel class="combat-panel" :title="title" :heading-level="headingLevel">
    <template #actions
      ><span class="combat-panel__caption"><slot name="actions" /></span
    ></template>
    <slot />
  </UiPanel>
</template>
<style scoped lang="scss">
@use "../styles/breakpoints";
.combat-panel {
  --ui-panel-shadow: none;
  --ui-panel-header-min-height: 54px;
  --ui-panel-title-font: var(--font-family-body);
  --ui-panel-title-size: 11px;
  --ui-panel-title-color: var(--color-accent);
  --ui-panel-title-transform: uppercase;
  --ui-panel-title-spacing: 0.08em;
  --ui-panel-actions-align: right;
  min-width: 0;
}
@media (max-width: breakpoints.$compact) {
  .combat-panel__caption {
    --combat-mono-size: 9px;
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-panel {
    --ui-panel-header-padding: var(--space-3);
    --ui-panel-header-wrap: wrap;
    --ui-panel-header-gap: var(--space-2);
    --ui-panel-body-padding: var(--space-3);
  }
}
</style>
