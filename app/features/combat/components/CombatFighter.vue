<script setup lang="ts">
import type { Fighter } from "../types";
import { asset } from "../data";
function stateIcon(state: string) {
  const index = [
    "Off-balance",
    "Soaked",
    "Burning",
    "Stunned",
    "Marked",
    "Blinded",
  ].indexOf(state);
  return asset(`imgPillGlyph${index > 0 ? index : ""}`, "271-19260");
}
defineProps<{
  fighter: Fighter;
  selected?: boolean;
  selectable?: boolean;
  enemy?: boolean;
}>();
defineEmits<{ select: [id: string] }>();
</script>
<template>
  <div
    class="fighter"
    :class="{
      'fighter--selected': selected,
      'fighter--enemy': enemy,
      'fighter--ko': fighter.hp === 0,
    }"
  >
    <button
      class="fighter__portrait"
      :aria-label="`Target ${fighter.name}`"
      :aria-pressed="selected"
      :disabled="!selectable"
      @click="$emit('select', fighter.id)"
    >
      <img :src="fighter.sprite" alt="" >
    </button>
    <strong>{{ fighter.name }}</strong>
    <span class="mono muted"
      >{{ fighter.role }} ·
      {{ fighter.hp ? `SPD ${fighter.speed}` : "KO" }}</span
    >
    <meter
      :value="fighter.hp"
      :max="fighter.maxHp"
      :aria-label="`${fighter.name} health`"
    />
    <span class="fighter__hp mono muted"
      >{{ fighter.hp }}/{{ fighter.maxHp }}</span
    >
    <span
      v-if="fighter.state"
      class="state-pill"
      :class="`state-pill--${fighter.state.toLowerCase().split(' ')[0]}`"
    >
      <img :src="stateIcon(fighter.state)" alt="" >{{ fighter.state
      }}<template
        v-if="!fighter.state.includes('Offline') && fighter.state !== 'KO'"
      >
        · 1t</template
      >
    </span>
  </div>
</template>
