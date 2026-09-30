<script setup lang="ts">
import type { Fighter } from "../types";
import { asset } from "../presentation";
import CombatModal from "./CombatModal.vue";
defineProps<{
  ultimateOpen: boolean;
  ultimateSeconds: number;
  party: readonly Fighter[];
}>();
defineEmits<{
  close: [];
  confirm: [];
}>();
</script>

<template>
  <CombatModal
    :open="ultimateOpen"
    label="Team Ultimate confirmation"
    @close="$emit('close')"
    ><div class="ultimate-heading">
      <div>
        <small>Proposed by Player 2 · Resonance 100 / 100</small>
        <h2 class="combat-dialog__title">Team Ultimate</h2>
        <p class="muted">
          Resonant Cataclysm — its effect is built from the classes still
          standing.
        </p>
      </div>
      <div class="ultimate-clock">
        <img :src="asset('imgRingTrack', '271-17398')" alt="" ><img
          class="ultimate-clock__progress"
          :src="asset('imgRingProgress', '271-17398')"
          alt=""
        ><strong>{{ ultimateSeconds.toFixed(1) }}</strong
        ><span>seconds</span>
      </div>
    </div>
    <small class="combat-dialog__label"
      >Confirmations · all living players</small
    >
    <div class="ultimate-party">
      <div
        v-for="(member, i) in party"
        :key="member.id"
        :class="{ 'ultimate-party__member--ko': !member.hp }"
      >
        <span class="mini-portrait"
          ><img :src="asset(`imgHero${i || ''}`)" alt="" ></span
        ><strong>{{ member.name }}</strong>
        <p>{{ member.role }}{{ !member.hp ? " · KO" : "" }}</p>
        <small>{{
          !member.hp ? "Not required" : i ? "Confirmed" : "Waiting for you"
        }}</small>
      </div>
    </div>
    <small class="combat-dialog__label">Combined effect</small>
    <dl class="ultimate-effects">
      <div>
        <dt>Mage</dt>
        <dd>Arcane storm <span>60 dmg to every enemy, ignores ranks</span></dd>
      </div>
      <div>
        <dt>Warrior</dt>
        <dd>Bulwark <span>party takes −50 % damage until next turn</span></dd>
      </div>
      <div>
        <dt>Rogue</dt>
        <dd>
          Shadow mark
          <span>all enemies Marked 2t · next hit is a critical</span>
        </dd>
      </div>
      <div class="muted">
        <dt>Druid</dt>
        <dd>
          Verdant surge
          <span>{{
            party[3]?.hp
              ? "heal 25 % for every living ally"
              : "heal 25 % — absent, player is KO"
          }}</span>
        </dd>
      </div>
    </dl>
    <p class="muted">
      If anyone does not confirm within 3 s, nothing is spent: the gauge stays
      full. The Ultimate replaces every confirmer’s action and resolves first.
    </p>
    <div class="combat-dialog-footer">
      <UiButton variant="ghost" @click="$emit('close')">Not now</UiButton
      ><UiButton @click="$emit('confirm')">Confirm · Space</UiButton>
    </div></CombatModal
  >
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.portrait;
@include primitives.dialog-content;
.ultimate-heading {
  display: flex;
  justify-content: space-between;
  gap: var(--space-5);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border-subtle);
}
.ultimate-heading small {
  color: var(--color-accent);
}
.ultimate-clock {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  text-align: center;
}
.ultimate-clock > img {
  position: absolute;
  top: 0;
  left: 0;
}
.ultimate-clock > img.ultimate-clock__progress {
  left: auto;
  right: 0;
}
.ultimate-clock strong {
  display: block;
  padding-top: 26px;
  font: 700 38px var(--font-family-display);
  color: var(--color-accent-strong);
}
.ultimate-clock span {
  color: var(--color-text-muted);
}
.ultimate-party {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.ultimate-party > div {
  padding: var(--space-3);
  border: 1px solid var(--combat-green);
  background: var(--color-surface-overlay);
}
.ultimate-party > div:first-child {
  border-color: var(--color-accent);
  background: var(--combat-selection);
}
.ultimate-party .mini-portrait {
  float: left;
  margin-right: var(--space-2);
}
.ultimate-party strong {
  font-size: var(--font-size-xs);
}
.ultimate-party p {
  font-size: 11px;
}
.ultimate-party small {
  display: block;
  margin-top: var(--space-5);
  font-size: 10px;
  color: var(--combat-green);
}
.ultimate-party > div:first-child small {
  color: var(--combat-fire);
}
.ultimate-party .ultimate-party__member--ko {
  opacity: 0.4;
  border-color: var(--color-border-strong);
}
.ultimate-effects > div {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  background: var(--color-surface-overlay);
  margin-block: var(--space-2);
  border-left: 2px solid var(--combat-arcane);
}
.ultimate-effects dt {
  width: 90px;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--color-accent);
}
.ultimate-effects dd {
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: var(--space-3);
}
.ultimate-effects dd span {
  font: 10px var(--font-family-mono);
  color: var(--color-text-muted);
  text-align: right;
}
@media (max-width: breakpoints.$mobile) {
  .ultimate-heading {
    flex-direction: column-reverse;
  }
}
@media (max-width: breakpoints.$mobile) {
  .ultimate-clock {
    align-self: center;
  }
}
@media (max-width: breakpoints.$mobile) {
  .ultimate-party {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: breakpoints.$mobile) {
  .ultimate-effects dd {
    flex-direction: column;
  }
}
@media (max-width: breakpoints.$mobile) {
  .ultimate-effects dd span {
    text-align: left;
  }
}
</style>
