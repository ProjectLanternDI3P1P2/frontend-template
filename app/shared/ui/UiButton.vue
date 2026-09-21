<script setup lang="ts">
/**
 * ADR-FE-009 / ADR-FE-010 — Reusable presentational control.
 * One responsibility, typed props, explicit events, no HTTP call, no business
 * rule. Styled with BEM class names built from design tokens.
 */
withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
  /** Renders a busy state and blocks interaction without removing the button. */
  busy?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  busy: false,
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${variant}`, { 'ui-button--busy': busy }]"
    :type="type"
    :disabled="disabled || busy"
    :aria-busy="busy"
    @click="$emit('click', $event)"
  >
    <span class="ui-button__label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 2.75rem; // ADR-FE-015: comfortable pointer target.
  padding: var(--space-2) var(--space-5);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background-color: var(--color-accent);
    color: var(--color-text-inverse);

    &:hover:not(:disabled) { background-color: var(--color-accent-strong); }
  }

  &--ghost {
    background-color: transparent;
    border-color: var(--color-border-strong);
    color: var(--color-text-primary);

    &:hover:not(:disabled) { background-color: var(--color-surface-overlay); }
  }

  &--danger {
    background-color: var(--color-danger);
    color: var(--color-text-primary);

    &:hover:not(:disabled) { background-color: var(--color-danger-strong); }
  }

  &--busy { cursor: progress; }

  &__label { line-height: 1; }
}
</style>
