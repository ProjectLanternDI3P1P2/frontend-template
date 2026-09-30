<script setup lang="ts">
import { asset } from "../presentation";
const props = defineProps<{ boss?: boolean }>();
defineEmits<{ fight: []; object: []; run: [] }>();
const host = ref<HTMLElement>();
const scale = ref(1);
let observer: ResizeObserver | undefined;
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (entry) scale.value = entry.contentRect.width / 1920;
  });
  if (host.value) observer.observe(host.value);
});
onUnmounted(() => observer?.disconnect());
const frame = computed(() => (props.boss ? "300-20650" : "265-14265"));
const sprites = [
  { name: "imgHero", x: 426, y: 448 },
  { name: "imgHero1", x: 600, y: 512 },
  { name: "imgHero2", x: 426, y: 594 },
  { name: "imgSkeleton", x: 1286, y: 508 },
  { name: "imgSlime", x: 1290, y: 606 },
  { name: "imgBat", x: 1294, y: 428 },
];
</script>
<template>
  <section
    ref="host"
    class="arena"
    :aria-label="boss ? 'Boss combat' : 'Combat encounter'"
  >
    <h1 class="visually-hidden">{{ boss ? "Boss combat" : "Combat" }}</h1>
    <div class="arena__canvas" :style="{ transform: `scale(${scale})` }">
      <img
        class="arena__base"
        :src="
          asset(
            boss ? 'img84CombatUiFightBoss' : 'img84CombatUiFightEnnemies',
            frame,
          )
        "
        alt=""
      >
      <img
        class="arena__background"
        :src="
          asset(
            boss ? 'imgTest2Background1' : 'imgTest31Background1',
            frame,
            'png',
          )
        "
        alt="A torch-lit dungeon with stone walls and wooden barrels"
      >
      <img
        v-for="sprite in sprites"
        :key="sprite.name"
        class="arena__sprite"
        :src="asset(sprite.name, frame)"
        alt=""
        :style="{ left: sprite.x + 'px', top: sprite.y + 'px' }"
      >
      <template v-if="!boss">
        <div class="arena__parchment">
          <img :src="asset('imgRectangle2', '265-14265', 'png')" alt="" >
        </div>
        <div class="arena__health">
          <label
            v-for="(name, i) in ['Red', 'Yellow', 'Grey']"
            :key="name"
            :class="`arena__health--${name.toLowerCase()}`"
            :for="`arena-hp-${i}`"
            >{{ name
            }}<meter :id="`arena-hp-${i}`" :value="76" :max="100">
              76/100
            </meter></label
          >
        </div>
        <UiButton class="arena__fight" @click="$emit('fight')">Fight</UiButton>
        <UiButton class="arena__object" @click="$emit('object')"
          >Object</UiButton
        >
        <UiButton class="arena__run" @click="$emit('run')">RUN</UiButton>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/breakpoints";
@use "../styles/primitives";
@include primitives.text;
@include primitives.buttons;
@include primitives.meter;
.arena {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.arena__canvas {
  width: 1920px;
  height: 1080px;
  position: absolute;
  transform-origin: top left;
}
.arena__base {
  position: absolute;
  inset: 0;
}
.arena__background {
  position: absolute;
  left: 60px;
  top: 0;
  width: 1800px;
  height: 1080px;
  object-fit: cover;
  image-rendering: pixelated;
}
.arena__sprite {
  position: absolute;
  image-rendering: pixelated;
}
.arena__parchment {
  position: absolute;
  left: 102px;
  top: 760px;
  width: 1715px;
  height: 376px;
  overflow: hidden;
  pointer-events: none;
}
.arena__parchment img {
  position: absolute;
  top: 15.85%;
  left: 1.34%;
  width: 97.62%;
  height: 71.88%;
}
.arena__health {
  position: absolute;
  left: 270px;
  top: 883px;
  width: 427px;
}
.arena__health label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  font: 700 28px/38px var(--font-family-display);
  margin-bottom: 9px;
}
.arena__health meter {
  width: 305px;
  height: 22px;
  background: var(--arena-paper);
  border: 0;
  border-radius: 7px;
  overflow: hidden;
  flex-shrink: 0;
}
.arena__health meter::-webkit-meter-bar {
  background: var(--arena-paper);
  height: 22px;
}
.arena__health meter::-webkit-meter-optimum-value {
  background: var(--arena-health);
}
.arena__health meter::-moz-meter-bar {
  background: var(--arena-health);
}
.arena__health--red {
  color: var(--arena-red);
}
.arena__health--yellow {
  color: var(--arena-yellow);
}
.arena__health--grey {
  color: var(--arena-grey);
}
.arena .ui-button {
  position: absolute;
  width: 286px;
  height: 54px;
  padding: 0;
  font: 700 28px var(--font-family-display);
  text-transform: uppercase;
  background: var(--arena-paper);
  color: var(--arena-ink);
  border: 1px solid var(--arena-ink);
  border-radius: 15px;
  box-shadow: inset 0 4px 4px rgb(0 0 0 / 25%);
}
.arena .ui-button:hover {
  background: var(--color-accent-strong);
}
.arena__fight {
  left: 865px;
  top: 874px;
}
.arena__object {
  left: 865px;
  top: 943px;
}
.arena__run {
  left: 1179px;
  top: 910px;
}
@media (max-width: breakpoints.$mobile) {
  .arena {
    height: 540px;
    overflow-x: auto;
    aspect-ratio: auto;
  }
}
@media (max-width: breakpoints.$mobile) {
  .arena__canvas {
    transform: scale(0.5) !important;
  }
}
</style>
