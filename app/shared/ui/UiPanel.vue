<script setup lang="ts">
/** ADR-FE-010 — Surface wrapper. Presentational only. */
defineProps<{
  title: string;
  /** Heading level, so each page keeps a correct outline (ADR-FE-015). */
  headingLevel?: 2 | 3 | 4;
}>();
</script>

<template>
  <section class="ui-panel">
    <header class="ui-panel__header">
      <component :is="`h${headingLevel ?? 2}`" class="ui-panel__title">
        {{ title }}
      </component>
      <div class="ui-panel__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ui-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.ui-panel {
  background-color: var(--color-surface-raised);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--ui-panel-shadow, var(--shadow-md));

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ui-panel-header-gap, var(--space-4));
    min-height: var(--ui-panel-header-min-height, auto);
    flex-wrap: var(--ui-panel-header-wrap, nowrap);
    padding: var(--ui-panel-header-padding, var(--space-4) var(--space-5));
    border-bottom: 1px solid var(--color-border-subtle);
  }

  &__title {
    margin: 0;
    font-size: var(--ui-panel-title-size, var(--font-size-lg));
    font-family: var(--ui-panel-title-font, var(--font-family-display));
    color: var(--ui-panel-title-color, inherit);
    text-transform: var(--ui-panel-title-transform, none);
    letter-spacing: var(--ui-panel-title-spacing, normal);
  }

  &__actions {
    text-align: var(--ui-panel-actions-align, start);
  }

  &__body {
    padding: var(--ui-panel-body-padding, var(--space-5));
  }
}
</style>
