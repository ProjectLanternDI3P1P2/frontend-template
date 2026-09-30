<script setup lang="ts">
import { asset } from "../presentation";
import type { Fighter, Phase } from "../types";
defineProps<{
  view: string;
  party: readonly Fighter[];
  turn: number;
  resolving: boolean;
  phase: Phase;
  locked: readonly boolean[];
  statuses: readonly string[];
  lockedCount: number;
  replayIndex: number;
  eventCount: number;
  seconds: number;
}>();
defineEmits<{
  back: [];
}>();
</script>

<template>
  <header class="combat-topbar">
    <h1>{{ view === "bestiary" ? "Combo bestiary" : "Combat" }}</h1>
    <div class="combat-topbar__location">
      <p>
        {{
          view === "bestiary"
            ? "Party · Lantern Wardens"
            : "Crypt of Ashes · Ossuary"
        }}
      </p>
      <p class="mono muted">
        {{
          view === "bestiary"
            ? "shared by 4 members · combat discoveries"
            : `Turn ${String(turn).padStart(2, "0")} · Hard · seed 7F3A-91C2 · enc_0440`
        }}
      </p>
    </div>
    <template v-if="view === 'tactics'">
      <div class="combat-topbar__party">
        <small>Locked in</small>
        <div class="mini-party">
          <span
            v-for="(member, i) in party"
            :key="member.id"
            class="mini-portrait"
            :class="{ 'mini-portrait--locked': locked[i] }"
            ><img
              :src="asset(`imgHero${i || ''}`)"
              :alt="`${member.name}: ${statuses[i]}`" ><img
              v-if="locked[i]"
              class="mini-portrait__lock"
              :src="asset('imgLockDot')"
              alt="" ></span
          ><span class="muted">{{
            resolving ? `replaying turn ${turn}` : `${lockedCount} of 4 locked`
          }}</span>
        </div>
      </div>
      <span class="state-pill state-pill--phase"
        ><img :src="asset('imgPillGlyph')" alt="" >{{
          resolving
            ? "Resolving"
            : phase === "intent"
              ? "Enemy intent"
              : "Planning"
        }}</span
      >
      <div class="combat-topbar__timer">
        <small>{{ resolving ? "Replay" : "Planning" }}</small
        ><strong class="mono">{{
          resolving
            ? `${replayIndex} / ${eventCount}`
            : `${String(seconds).padStart(2, "0")} s`
        }}</strong>
      </div>
    </template>
    <template v-else
      ><span class="state-pill">◇ 7 / 12 found</span
      ><UiButton variant="ghost" @click="$emit('back')"
        >Back to combat</UiButton
      ></template
    >
  </header>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.portrait;
@include primitives.pill;
.combat-topbar {
  min-height: 81px;
  padding: var(--space-3) var(--space-6);
  background: var(--color-surface-raised);
  border-bottom: 1px solid var(--color-border-subtle);
  display: grid;
  grid-template-columns: 1.05fr 1.3fr 0.95fr 0.5fr auto;
  align-items: center;
  gap: var(--space-5);
}
.combat-topbar h1 {
  font-size: var(--font-size-xl);
  white-space: nowrap;
}
.combat-topbar__party > small {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-text-muted);
}
.combat-topbar__timer {
  text-align: right;
  min-width: 72px;
}
.combat-topbar__timer small {
  display: block;
  color: var(--color-text-muted);
}
.combat-topbar__timer strong {
  display: block;
  font-size: 28px !important;
  color: var(--color-accent);
  font-weight: 400;
}
.mini-party {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.mini-party > .muted {
  margin-left: var(--space-2);
  white-space: nowrap;
}
.mini-party .mini-portrait:not(.mini-portrait--locked) > img {
  opacity: 0.5;
}
.state-pill--phase {
  color: var(--combat-fire);
}
@media (max-width: breakpoints.$compact) {
  .combat-topbar {
    grid-template-columns: 0.7fr 1fr 1.2fr auto auto;
    padding-inline: var(--space-5);
  }
}
@media (max-width: breakpoints.$stacked) {
  .combat-topbar {
    display: flex;
    flex-wrap: wrap;
  }
}
@media (max-width: breakpoints.$stacked) {
  .combat-topbar h1 {
    margin-right: auto;
  }
}
@media (max-width: breakpoints.$stacked) {
  .combat-topbar__party {
    order: 4;
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-topbar {
    padding: var(--space-4);
    gap: var(--space-3);
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-topbar h1 {
    font-size: 23px;
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-topbar__location {
    width: 100%;
    order: 3;
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-topbar__party {
    width: 100%;
  }
}
</style>
