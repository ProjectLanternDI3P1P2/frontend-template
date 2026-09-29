<script setup lang="ts">
import CombatExperience from "~/features/combat/components/CombatExperience.vue";
definePageMeta({ layout: false });
useHead({
  title: "Combat",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
<template><CombatExperience /></template>
