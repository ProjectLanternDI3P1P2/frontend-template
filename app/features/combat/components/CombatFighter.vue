<script setup lang="ts">
import type { Fighter } from "../types";
import { stateIcon } from "../presentation";

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

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.meter;
@include primitives.pill;
.fighter {
  width: min(150px, 100%);
  margin-inline: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fighter__portrait {
  width: 88px;
  height: 88px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface-base);
  display: grid;
  place-items: center;
  padding: 0;
  margin-bottom: var(--space-2);
  cursor: pointer;
}
.fighter__portrait:disabled {
  cursor: default;
}
.fighter__portrait:not(:disabled):hover {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.fighter--selected .fighter__portrait {
  border: 2px solid var(--color-accent);
}
.fighter--selected.fighter--enemy .fighter__portrait {
  outline: 1px solid var(--color-accent);
  outline-offset: 5px;
}
.fighter--enemy .fighter__portrait {
  border-color: var(--combat-blood);
}
.fighter > strong {
  font-weight: 600;
  font-size: var(--font-size-sm);
  white-space: nowrap;
}
.fighter meter {
  margin-top: 12px;
}
.fighter__hp {
  align-self: flex-end;
  margin-top: var(--space-1);
}
.fighter .state-pill {
  align-self: flex-start;
  margin-top: var(--space-2);
}
.fighter--ko .fighter__portrait {
  opacity: 0.4;
}
@media (max-width: breakpoints.$compact) {
  .fighter > strong {
    font-size: var(--font-size-xs);
    white-space: normal;
  }
}
</style>
