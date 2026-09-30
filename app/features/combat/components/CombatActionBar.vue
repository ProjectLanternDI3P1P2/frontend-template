<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import type { Phase, Skill, SkillId } from "../types";
defineProps<{
  skills: readonly Skill[];
  phase: Phase;
  skillId: SkillId | undefined;
  actionLabel: string;
  canLock: boolean;
}>();
defineEmits<{
  selectSkill: [id: SkillId];
  clear: [];
  unlock: [];
  lock: [];
}>();
</script>

<template>
  <CombatPanel
    title="Actions — Player 1 · Mage"
    class="combat-panel combat-actions"
  >
    <template #actions
      ><span class="mono muted">{{
        phase === "locked"
          ? "locked · waiting for the party"
          : "choose 1 skill + 1 target · secret until resolve"
      }}</span></template
    >
    <div class="skill-grid">
      <button
        v-for="(action, i) in skills"
        :key="action.id"
        class="skill-card"
        :class="[
          `tone--${action.tone}`,
          { 'skill-card--selected': skillId === action.id },
        ]"
        :disabled="phase !== 'planning'"
        :aria-pressed="skillId === action.id"
        @click="$emit('selectSkill', action.id)"
      >
        <span class="skill-card__header"
          ><span class="skill-card__icon">{{ action.glyph }}</span
          ><span
            ><strong>{{ action.name }}</strong
            ><span class="mono muted"
              >SPD {{ action.speed || "—" }} ·
              {{
                action.target === "self" ? "self" : `1 ${action.target}`
              }}</span
            ></span
          ><kbd>{{ i + 1 }}</kbd></span
        >
        <span v-if="action.sets" class="skill-card__rule"
          ><small>Sets</small>{{ action.sets }}</span
        >
        <span v-if="action.consumes" class="skill-card__rule"
          ><small class="tone--water">Consumes</small
          >{{ action.consumes }}</span
        >
        <span v-if="action.id === 'arcane'" class="skill-card__rule"
          ><small>Plain</small>no state</span
        >
        <span v-if="action.id === 'swap'" class="skill-card__rule"
          ><small>Moves</small>ends your turn</span
        >
        <span v-if="action.combo" class="skill-card__combo"
          >→ {{ action.combo }}</span
        >
      </button>
    </div>
    <div class="combat-action-footer">
      <div>
        <strong>{{
          phase === "intent"
            ? "Read the intents — planning opens in 2 s"
            : `${phase === "locked" ? "Locked: " : ""}${actionLabel}`
        }}</strong>
        <p class="mono muted">
          {{
            phase === "locked"
              ? "resolution starts when all players are locked or at 0 s"
              : "Esc to change target · Enter to lock · choice stays secret"
          }}
        </p>
      </div>
      <div class="button-row">
        <UiButton
          v-if="phase === 'planning'"
          variant="ghost"
          @click="$emit('clear')"
          >Clear</UiButton
        ><UiButton
          v-if="phase === 'locked'"
          variant="ghost"
          @click="$emit('unlock')"
          >Unlock</UiButton
        ><UiButton v-else :disabled="!canLock" @click="$emit('lock')"
          >Lock action</UiButton
        >
      </div>
    </div>
  </CombatPanel>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.tones;
@include primitives.action-footer;
.skill-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-3);
}
.skill-card {
  position: relative;
  background: var(--color-surface-overlay);
  border: 1px solid var(--color-border-subtle);
  min-height: 150px;
  padding: 13px;
  padding-bottom: 36px;
  text-align: left;
  cursor: pointer;
}
.skill-card.skill-card--selected {
  background: var(--combat-selection);
  border-color: var(--color-accent);
  outline: 1px solid var(--color-accent);
}
.skill-card:disabled {
  cursor: default;
  opacity: 0.5;
}
.skill-card__header {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.skill-card__header > span:nth-child(2) {
  min-width: 0;
}
.skill-card__header strong {
  display: block;
  font-weight: 600;
  white-space: nowrap;
}
.skill-card__header .mono {
  display: block;
  white-space: nowrap;
  font-size: 10px;
}
.skill-card kbd {
  position: absolute;
  right: 10px;
  top: 10px;
  color: var(--combat-dim);
  font: 10px var(--font-family-mono);
}
.skill-card__icon {
  width: 40px;
  height: 40px;
  border: 2px solid var(--tone);
  display: grid;
  place-items: center;
  color: var(--tone, var(--color-accent));
  font: 700 20px var(--font-family-display);
  flex-shrink: 0;
  background: var(--color-surface-base);
}
.skill-card__rule {
  display: flex;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  margin-top: var(--space-2);
}
.skill-card__rule small {
  color: var(--tone, var(--color-accent));
}
.skill-card__combo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--combat-gold-wash);
  padding: 7px 13px;
  color: var(--color-accent-strong);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
}
@media (max-width: breakpoints.$compact) {
  .skill-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-2);
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card {
    padding: var(--space-2);
    padding-bottom: 36px;
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card__header {
    gap: var(--space-2);
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card__header strong {
    font-size: var(--font-size-xs);
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card__header .mono {
    font-size: 9px;
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card__icon {
    width: 30px;
    height: 30px;
    font-size: var(--font-size-md);
  }
}
@media (max-width: breakpoints.$mobile) {
  .skill-card kbd {
    display: none;
  }
}
.combat-actions {
  --ui-panel-body-padding: 14px 24px 20px;
}
@media (min-width: breakpoints.$wide) {
  .skill-grid {
    margin-right: 48px;
  }
}
.skill-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
</style>
