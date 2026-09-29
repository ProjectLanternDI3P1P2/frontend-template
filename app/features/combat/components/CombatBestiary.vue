<script setup lang="ts">
import { asset, combos } from "../data";
const filter = ref("All");
const selected = ref(combos[3]!);
const pinned = ref("");
const visible = computed(() =>
  combos.filter(
    (c) =>
      filter.value === "All" ||
      (filter.value === "Secret"
        ? c.secret
        : c.role === filter.value || c.setter.includes(filter.value)),
  ),
);
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
</script>
<template>
  <div class="bestiary combat-grid">
    <UiPanel title="Known combos" class="combat-panel bestiary__list">
      <template #actions
        ><span class="mono muted">7 / 12 discovered</span></template
      >
      <div class="bestiary__filters" aria-label="Filter combos">
        <UiButton
          v-for="role in ['All', 'Mage', 'Warrior', 'Rogue', 'Druid', 'Secret']"
          :key="role"
          :variant="filter === role ? 'primary' : 'ghost'"
          :aria-pressed="filter === role"
          @click="filter = role"
          >{{ role }}</UiButton
        >
      </div>
      <div class="bestiary__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Combo</th>
              <th scope="col">State</th>
              <th scope="col">Set by</th>
              <th scope="col">Consumed by</th>
              <th scope="col">Effect</th>
              <th scope="col">Found</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(combo, i) in visible"
              :key="combo.name + i"
              :class="{
                'is-selected': selected.name === combo.name,
                'is-unknown': combo.unknown,
              }"
            >
              <th scope="row">
                <button
                  :disabled="combo.unknown"
                  :aria-pressed="selected.name === combo.name"
                  @click="selected = combo"
                >
                  {{ combo.name
                  }}<span v-if="combo.name === 'Wildfire'" class="state-pill"
                    >◇ NEW</span
                  >
                </button>
              </th>
              <td>
                <span
                  class="state-pill"
                  :class="`state-pill--${combo.state.toLowerCase()}`"
                  ><img
                    v-if="combo.state !== '???'"
                    :src="stateIcon(combo.state)"
                    alt=""
                  >{{ combo.state }}</span
                >
              </td>
              <td>{{ combo.setter }}</td>
              <td>{{ combo.consumer }}</td>
              <td>{{ combo.effect }}</td>
              <td>{{ combo.found }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!visible.length" class="muted">
        No combos found for this class.
      </p>
    </UiPanel>
    <UiPanel :title="selected.name" class="combat-panel bestiary__detail">
      <h3>{{ selected.name }}</h3>
      <p class="muted">
        {{ selected.consumer.split(" · ")[0] }} consumes {{ selected.state }}
      </p>
      <div class="combo-step tone-fire">
        <small>1 · Setter</small>
        <p>{{ selected.setter }} sets {{ selected.state }}</p>
      </div>
      <p class="mono muted bestiary__arrow">↓ must act first (higher SPD)</p>
      <div class="combo-step tone-green">
        <small>2 · Consumer</small>
        <p>{{ selected.consumer }} consumes {{ selected.state }}</p>
      </div>
      <p class="mono muted bestiary__arrow">↓ combo triggers</p>
      <div class="combo-step">
        <small>3 · Effect</small>
        <p>{{ selected.effect }} · +20 Resonance</p>
      </div>
      <dl class="combat-facts">
        <dt>Discovered</dt>
        <dd>{{ selected.found }}</dd>
        <dt>Location</dt>
        <dd>Crypt of Ashes</dd>
        <dt>Resonance</dt>
        <dd>+20</dd>
      </dl>
      <p class="muted">
        Secret entries show only their state and a hint until someone in the
        party triggers them.
      </p>
      <UiButton
        variant="ghost"
        class="bestiary__pin"
        @click="pinned = selected.name"
        >{{
          pinned === selected.name
            ? "Pinned for the party"
            : "Pin as combo hint for the party"
        }}</UiButton
      >
      <p class="visually-hidden" role="status">
        {{ pinned ? `${pinned} pinned in this demonstration` : "" }}
      </p>
    </UiPanel>
  </div>
</template>
