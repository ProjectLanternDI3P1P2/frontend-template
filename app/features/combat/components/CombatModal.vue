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
