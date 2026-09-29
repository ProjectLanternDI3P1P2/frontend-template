<script setup lang="ts">
import { asset } from "../data";
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
