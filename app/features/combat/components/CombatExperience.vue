<script setup lang="ts">
import { skills, combos, scenarioOptions } from "../fixtures/combatFixtures";
import { useCombatDemo } from "../composables/useCombatDemo";
import CombatArena from "./CombatArena.vue";
import CombatBestiary from "./CombatBestiary.vue";
import CombatModal from "./CombatModal.vue";
import CombatHeader from "./CombatHeader.vue";
import CombatBattlefield from "./CombatBattlefield.vue";
import CombatActionBar from "./CombatActionBar.vue";
import CombatReplay from "./CombatReplay.vue";
import CombatResonancePanel from "./CombatResonancePanel.vue";
import CombatPartyPanel from "./CombatPartyPanel.vue";
import CombatPreviewPanel from "./CombatPreviewPanel.vue";
import CombatUltimateDialog from "./CombatUltimateDialog.vue";
import CombatDemoControls from "./CombatDemoControls.vue";
const route = useRoute();
const view = ref("arena");
const demo = useCombatDemo();
const {
  party,
  enemies,
  phase,
  scenario,
  skill,
  skillId,
  target,
  targetId,
  resonance,
  turn,
  seconds,
  running,
  replayIndex,
  replaySpeed,
  notice,
  events,
  preview,
  canLock,
  actionLabel,
  ultimateOpen,
  ultimateSeconds,
  potions,
  message,
  resolving,
  locked,
  lockedCount,
  partyStatuses,
  selectableIds,
} = demo;
const modal = ref<"object" | "run" | "">("");

function changeView(next: string) {
  demo.stop();
  demo.dismissUltimate();
  view.value = next;
}
function enterTactics() {
  demo.loadScenario("intent");
  view.value = "tactics";
}
function usePotion() {
  if (demo.usePotion()) modal.value = "";
}
function keyboard(event: KeyboardEvent) {
  if (ultimateOpen.value) {
    if (event.code === "Space" && event.target === document.body) {
      event.preventDefault();
      demo.confirmUltimate();
    }
    return;
  }
  if (
    view.value !== "tactics" ||
    modal.value ||
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLButtonElement ||
    event.target instanceof HTMLAnchorElement
  )
    return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < skills.length) {
    event.preventDefault();
    demo.selectSkill(skills[index]!.id);
  }
  if (event.key === "Escape") demo.clear();
  if (event.key === "Enter") demo.lock();
}
onMounted(() => {
  if (["tactics", "boss", "bestiary"].includes(String(route.query.view)))
    view.value = String(route.query.view);
  if (scenarioOptions.some(([id]) => id === route.query.state))
    demo.loadScenario(String(route.query.state));
  window.addEventListener("keydown", keyboard);
});
onUnmounted(() => window.removeEventListener("keydown", keyboard));
</script>

<template>
  <div class="combat-root">
    <a href="#combat-main" class="skip-link">Skip to combat</a>
    <main id="combat-main">
      <CombatArena
        v-if="view === 'arena' || view === 'boss'"
        :boss="view === 'boss'"
        @fight="enterTactics"
        @object="modal = 'object'"
        @run="modal = 'run'"
      />
      <template v-else>
        <CombatHeader
          :view="view"
          :party="party"
          :turn="turn"
          :resolving="resolving"
          :phase="phase"
          :locked="locked"
          :statuses="partyStatuses"
          :locked-count="lockedCount"
          :replay-index="replayIndex"
          :event-count="events.length"
          :seconds="seconds"
          @back="changeView('tactics')"
        />
        <CombatBestiary v-if="view === 'bestiary'" :combos="combos" />
        <div v-else class="combat-grid">
          <div class="combat-primary">
            <CombatBattlefield
              :party="party"
              :enemies="enemies"
              :turn="turn"
              :resolving="resolving"
              :phase="phase"
              :scenario="scenario"
              :skill="skill"
              :skill-id="skillId"
              :target="target"
              :target-id="targetId"
              :preview="preview"
              :notice="notice"
              :selectable-ids="selectableIds"
              @select-target="demo.selectTarget"
            />
            <CombatActionBar
              v-if="!resolving"
              :skills="skills"
              :phase="phase"
              :skill-id="skillId"
              :action-label="actionLabel"
              :can-lock="canLock"
              @select-skill="demo.selectSkill"
              @clear="demo.clear"
              @unlock="demo.unlock"
              @lock="demo.lock"
            />
            <CombatReplay
              v-else
              :events="events"
              :replay-index="replayIndex"
              :replay-speed="replaySpeed"
              @speed="demo.setReplaySpeed"
              @skip="demo.skipReplay"
              @next-turn="demo.nextTurn"
            />
          </div>
          <aside
            class="combat-sidebar"
            aria-label="Party and combat information"
          >
            <CombatResonancePanel
              :resonance="resonance"
              :resolving="resolving"
              @propose="demo.proposeUltimate"
            />
            <CombatPartyPanel :party="party" :statuses="partyStatuses" />
            <CombatPreviewPanel
              :phase="phase"
              :scenario="scenario"
              :resolving="resolving"
              :seconds="seconds"
              :action-label="actionLabel"
              :party="party"
              :events="events"
              :replay-index="replayIndex"
              :skill-id="skillId"
              :skill="skill"
              :target="target"
              :preview="preview"
              :resonance="resonance"
              @bestiary="changeView('bestiary')"
            />
          </aside>
        </div>
      </template>
    </main>
    <CombatDemoControls
      :view="view"
      :scenario="scenario"
      :scenario-options="scenarioOptions"
      :running="running"
      :resolving="resolving"
      :phase="phase"
      :message="message"
      @view="changeView"
      @scenario="demo.loadScenario"
      @timer="demo.toggleTimer"
      @resolve="demo.resolve"
      @fight="enterTactics"
    />
    <CombatUltimateDialog
      :ultimate-open="ultimateOpen"
      :ultimate-seconds="ultimateSeconds"
      :party="party"
      @close="demo.dismissUltimate"
      @confirm="demo.confirmUltimate"
    />
    <CombatModal
      :open="modal === 'object'"
      label="Combat objects"
      @close="modal = ''"
      ><h2 class="combat-dialog__title">Objects</h2>
      <p>Healing potion · restores up to 25 HP to the Mage.</p>
      <p>
        {{ potions }} remaining · {{ party[0]!.hp }}/{{ party[0]!.maxHp }} HP
      </p>
      <div class="combat-dialog-footer">
        <UiButton variant="ghost" @click="modal = ''">Back</UiButton
        ><UiButton
          :disabled="!potions || party[0]!.hp === party[0]!.maxHp"
          @click="usePotion"
          >Use potion</UiButton
        >
      </div></CombatModal
    >
    <CombatModal
      :open="modal === 'run'"
      label="Leave combat"
      @close="modal = ''"
      ><h2 class="combat-dialog__title">Leave combat?</h2>
      <p>This ends the local encounter demonstration.</p>
      <div class="combat-dialog-footer">
        <UiButton variant="ghost" @click="modal = ''">Stay</UiButton
        ><UiButton
          @click="
            modal = '';
            navigateTo('/');
          "
          >Leave combat</UiButton
        >
      </div></CombatModal
    >
    <p class="visually-hidden" aria-live="polite">{{ notice }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../fonts";
@use "../styles/tokens";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.grid;
@include primitives.dialog-content;
.combat-root {
  background: var(--color-surface-base);
  color: var(--color-text-primary);
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  min-height: 100vh;
}
.combat-primary {
  display: grid;
  grid-template-rows: 640px auto;
  gap: var(--space-4);
  min-width: 0;
}
.combat-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
@media (max-width: breakpoints.$compact) {
  .combat-primary {
    grid-template-rows: 600px auto;
    gap: var(--space-4);
  }
}
@media (max-width: breakpoints.$stacked) {
  .combat-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
@media (max-width: breakpoints.$stacked) {
  .combat-primary {
    grid-template-rows: 600px auto;
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-primary {
    grid-template-rows: auto auto;
    gap: var(--space-3);
  }
}
@media (max-width: breakpoints.$mobile) {
  .combat-sidebar {
    display: flex;
  }
}
.combat-root {
  @include tokens.theme;
}
</style>
