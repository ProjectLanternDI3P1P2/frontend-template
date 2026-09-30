<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import type { Fighter } from "../types";
import { asset, rankNames } from "../presentation";
defineProps<{
  party: readonly Fighter[];
  statuses: readonly string[];
}>();
</script>

<template>
  <CombatPanel title="Party" class="combat-panel party-panel"
    ><template #actions
      ><span class="mono muted">choices hidden until resolve</span></template
    >
    <div v-for="(member, i) in party" :key="member.id" class="party-row">
      <span class="mini-portrait"
        ><img :src="asset(`imgHero${i || ''}`)" alt=""
      ></span>
      <div>
        <strong>{{ member.name }}</strong>
        <p class="mono muted">
          {{ member.role }} · {{ rankNames[member.rank] }}
        </p>
      </div>
      <small>{{ statuses[i] }}</small>
      <div class="party-row__health">
        <meter
          :value="member.hp"
          :max="member.maxHp"
          :aria-label="`${member.name} health`"
        /><span class="mono muted">{{ member.hp }}/{{ member.maxHp }}</span>
      </div>
    </div></CombatPanel
  >
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.meter;
@include primitives.portrait;
.party-panel {
  min-height: 318px;
}
.party-panel {
  --ui-panel-body-padding: var(--space-4);
}
.party-row {
  display: grid;
  grid-template-columns: 32px 1fr auto 108px;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2);
  min-height: 50px;
  background: var(--color-surface-overlay);
  margin-bottom: var(--space-2);
}
.party-row:last-child {
  margin-bottom: 0;
}
.party-row strong {
  font-size: var(--font-size-xs);
}
.party-row .mono {
  font-size: 10px;
}
.party-row small {
  font-size: 10px;
}
.party-row small {
  color: var(--color-accent);
}
.party-row__health {
  text-align: right;
}
.party-row__health meter {
  height: 4px;
  margin-bottom: var(--space-1);
}
@media (max-width: breakpoints.$compact) {
  .party-row {
    grid-template-columns: 32px 1fr auto;
  }
}
@media (max-width: breakpoints.$compact) {
  .party-row__health {
    grid-column: 2 / -1;
  }
}
@media (max-width: breakpoints.$compact) {
  .party-row__health meter {
    display: inline-block;
    width: 70%;
    margin-right: var(--space-2);
  }
}
@media (max-width: breakpoints.$stacked) {
  .party-row__health {
    grid-column: auto;
  }
}
@media (max-width: breakpoints.$stacked) {
  .party-row {
    grid-template-columns: 32px 1fr auto 90px;
  }
}
@media (max-width: breakpoints.$stacked) {
  .party-row__health meter {
    display: block;
    width: 100%;
  }
}
@media (min-width: breakpoints.$wide) {
  .party-panel {
    height: 318px;
  }
}
</style>
