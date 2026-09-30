<script setup lang="ts">
const props = defineProps<{ open: boolean; label: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    if (open && !dialog.value?.open) dialog.value?.showModal();
    else if (!open && dialog.value?.open) dialog.value.close();
  },
);
onMounted(() => {
  if (props.open) dialog.value?.showModal();
});
</script>
<template>
  <dialog
    ref="dialog"
    class="combat-modal"
    :aria-label="label"
    @cancel.prevent="emit('close')"
    @close="emit('close')"
  >
    <slot />
  </dialog>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";

.combat-modal {
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent);
  padding: var(--space-6);
  width: min(800px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow: auto;
  margin: auto;
}
.combat-modal::backdrop {
  background: var(--combat-backdrop);
}
@media (max-width: breakpoints.$mobile) {
  .combat-modal {
    padding: var(--space-4);
  }
}
</style>
