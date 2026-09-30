<script setup lang="ts">
import CombatPanel from "./CombatPanel.vue";
import type { Fighter, Phase, Skill, SkillId, ActionPreview } from "../types";
import { asset, rankNames } from "../presentation";
import CombatFighter from "./CombatFighter.vue";
defineProps<{
  party: readonly Fighter[];
  enemies: readonly Fighter[];
  turn: number;
  resolving: boolean;
  phase: Phase;
  scenario: string;
  skill: Skill | undefined;
  skillId: SkillId | undefined;
  target: Fighter | undefined;
  targetId: string | undefined;
  preview: ActionPreview;
  notice: string;
  selectableIds: readonly string[];
}>();
defineEmits<{
  selectTarget: [id: string];
}>();
</script>

<template>
  <CombatPanel
    :title="`Battlefield · Turn ${String(turn).padStart(2, '0')}${resolving ? ' · Resolving' : ''}`"
    class="combat-panel battlefield"
  >
    <template #actions
      ><span class="mono muted"
        >3 ranks per side · enemies act on their revealed intent</span
      ></template
    >
    <div class="battlefield__scroll">
      <div class="battlefield__ranks">
        <div class="battlefield__side battlefield__side--party">
          <div v-for="(rank, i) in rankNames" :key="rank" class="rank-lane">
            <small>{{ rank }}</small>
            <div
              class="rank-lane__fighters"
              :class="{ 'rank-lane__fighters--middle': i !== 0 }"
            >
              <CombatFighter
                v-for="member in party.filter((p) => p.rank === i)"
                :key="member.id"
                :fighter="member"
                :selected="targetId === member.id || member.id === 'p1'"
                :selectable="selectableIds.includes(member.id)"
                @select="$emit('selectTarget', $event)"
              />
            </div>
          </div>
          <small class="side-label">Party</small>
        </div>
        <div class="battlefield__versus"><span>VS</span></div>
        <div class="battlefield__side battlefield__side--enemies">
          <div v-for="(enemy, i) in enemies" :key="enemy.id" class="rank-lane">
            <small>{{ rankNames[2 - i] }}</small>
            <div v-if="!resolving" class="enemy-intent">
              <div>
                <small>Intent</small
                ><span class="mono">SPD {{ enemy.speed }}</span>
              </div>
              <strong>{{ enemy.intent }}</strong>
              <p>→ {{ i === 2 ? "Back" : "Front" }} rank</p>
              <p>{{ enemy.threat }}</p>
            </div>
            <CombatFighter
              :fighter="enemy"
              enemy
              :selected="targetId === enemy.id"
              :selectable="selectableIds.includes(enemy.id)"
              @select="$emit('selectTarget', $event)"
            />
            <div
              v-if="preview.combo && targetId === enemy.id && !resolving"
              class="combo-tooltip"
            >
              <small>Combo ready</small>
              <p>{{ skill?.name }} × {{ enemy.state }}</p>
              <p>= {{ preview.combo?.toUpperCase() }}</p>
              <p>
                dmg ×{{ skillId === "lightning" ? 2 : 1 }} ·
                {{ skillId === "lightning" ? "Stunned" : "Blinded" }}
                1t
              </p>
            </div>
          </div>
          <small class="side-label">Enemies</small>
        </div>
        <div
          v-if="skillId === 'swap' && target && !resolving"
          class="swap-preview-arrow"
        >
          <img :src="asset('imgSwapArrow', '271-17921')" alt="" ><small
            >Swap · SPD 20</small
          >
          <p>Mage ↔ {{ target.role }}</p>
        </div>
        <div
          v-if="notice && resolving"
          class="battlefield__notice"
          :class="{
            'battlefield__notice--warning': scenario === 'missed',
          }"
        >
          <small>{{
            scenario === "secret"
              ? "Secret combo discovered"
              : scenario === "missed"
                ? "Combo missed · order"
                : preview.combo || "Action resolved"
          }}</small
          ><strong>{{ scenario === "secret" ? "Wildfire" : notice }}</strong>
          <p v-if="scenario === 'missed'">
            Rogue SPD 16 acted before Shield bash SPD 8. Off-balance is
            available next turn.
          </p>
        </div>
      </div>
    </div>
    <p
      v-if="phase === 'locked' || phase === 'intent' || scenario === 'offline'"
      class="battlefield__banner"
    >
      {{
        phase === "locked"
          ? "Waiting for Player 3 — the phase ends as soon as everyone is locked"
          : scenario === "offline"
            ? "Player 4 lost connection — plays Defend until they are back"
            : `Turn ${turn} — the enemies reveal their intent`
      }}
    </p>
  </CombatPanel>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
.battlefield {
  position: relative;
  min-width: 0;
}
.battlefield {
  --ui-panel-body-padding: 14px 54px 16px 30px;
}
.battlefield__ranks {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr);
  height: 556px;
  position: relative;
}
.battlefield__side {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-1);
  position: relative;
}
.rank-lane {
  background: var(--combat-lane);
  text-align: center;
  padding: var(--space-2) var(--space-2) 40px;
  min-width: 0;
}
.rank-lane > small {
  color: var(--combat-dim);
  display: block;
  white-space: nowrap;
}
.rank-lane__fighters {
  margin-top: 37px;
  display: flex;
  flex-direction: column;
  gap: 90px;
}
.rank-lane__fighters--middle {
  margin-top: 150px;
}
.battlefield__versus {
  display: grid;
  place-items: center;
  position: relative;
}
.battlefield__versus::before {
  content: "";
  position: absolute;
  top: var(--space-4);
  bottom: var(--space-4);
  width: 1px;
  background: var(--color-border-subtle);
}
.battlefield__versus span {
  position: relative;
  background: var(--color-surface-raised);
  color: var(--color-border-strong);
  padding-block: var(--space-2);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
}
.side-label {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--color-text-muted);
}
.enemy-intent {
  min-height: 108px;
  border: 1px solid var(--combat-blood);
  background: var(--color-surface-overlay);
  text-align: left;
  padding: 10px;
  margin: 0 0 36px;
}
.enemy-intent > div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-1);
}
.enemy-intent small {
  color: var(--combat-blood);
}
.enemy-intent .mono {
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 10px;
  line-height: 1.5;
}
.enemy-intent p {
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 10px;
  line-height: 1.5;
}
.enemy-intent strong {
  display: block;
  margin-top: var(--space-1);
}
.combo-tooltip {
  text-align: left;
  border: 1px solid var(--color-accent);
  margin-top: 58px;
  padding: 10px;
  background: var(--color-surface-raised);
}
.combo-tooltip small {
  color: var(--color-accent);
}
.combo-tooltip p {
  font: 10px/1.7 var(--font-family-mono);
}
.battlefield__side--enemies > .rank-lane > .fighter:first-of-type {
  margin-top: 140px;
}
.battlefield__side--enemies .enemy-intent + .fighter {
  margin-top: 0 !important;
}
.battlefield__banner {
  position: absolute;
  bottom: 45px;
  left: 32px;
  right: 32px;
  text-align: center;
  color: var(--color-accent-strong);
  background: var(--color-surface-raised);
  padding: var(--space-2);
}
.battlefield__notice {
  position: absolute;
  left: 35%;
  right: 4%;
  top: 20px;
  bottom: auto;
  padding: var(--space-4);
  border: 1px solid var(--color-accent);
  background: var(--combat-selection);
  text-align: center;
}
.battlefield__notice small {
  display: block;
  color: var(--color-accent-strong);
  margin-bottom: var(--space-2);
}
.battlefield__notice strong {
  display: block;
  font-size: var(--font-size-lg);
}
.battlefield__notice--warning {
  border-color: var(--combat-fire);
}
.swap-preview-arrow {
  position: absolute;
  left: 13%;
  top: 26%;
  pointer-events: none;
}
.swap-preview-arrow small {
  color: var(--color-accent);
}
@media (max-width: breakpoints.$compact) {
  .battlefield {
    --ui-panel-body-padding: var(--space-3);
  }
}
@media (max-width: breakpoints.$compact) {
  .battlefield__ranks {
    height: 520px;
    grid-template-columns: 1fr 50px 1fr;
  }
}
@media (max-width: breakpoints.$compact) {
  .rank-lane {
    padding-inline: var(--space-1);
  }
}
@media (max-width: breakpoints.$compact) {
  .rank-lane > small {
    font-size: 9px;
  }
}
@media (max-width: breakpoints.$compact) {
  .enemy-intent {
    padding: var(--space-2);
  }
}
@media (max-width: breakpoints.$compact) {
  .combo-tooltip {
    margin-top: 38px;
  }
}
@media (max-width: breakpoints.$mobile) {
  .battlefield__scroll {
    overflow-x: auto;
  }
}
@media (max-width: breakpoints.$mobile) {
  .battlefield__ranks {
    min-width: 740px;
  }
}
</style>
