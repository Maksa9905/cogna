<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

defineOptions({
  name: "CircularProgress",
});

const props = withDefaults(
  defineProps<{
    value?: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    animationDuration?: number;
  }>(),
  {
    value: 7,
    max: 10,
    size: 48,
    strokeWidth: 4,
    animationDuration: 700,
  },
);

const displayProgress = ref(0);
const hasAnimated = ref(false);

const targetProgress = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(1, Math.max(0, props.value / props.max));
});

const circumference = computed(() => 2 * Math.PI * (props.size / 2 - props.strokeWidth / 2));
const strokeDashoffset = computed(
  () => circumference.value * (1 - displayProgress.value),
);

function easeOutBack(t: number): number {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function runAnimation() {
  const start = performance.now();

  const animate = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(elapsed / props.animationDuration, 1);
    const eased = easeOutBack(t);
    displayProgress.value = targetProgress.value * eased;

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      displayProgress.value = targetProgress.value;
      hasAnimated.value = true;
    }
  };

  requestAnimationFrame(animate);
}

onMounted(() => {
  runAnimation();
});

watch(
  () => [props.value, props.max],
  () => {
    if (hasAnimated.value) {
      displayProgress.value = targetProgress.value;
    }
  },
);
</script>

<template>
  <div class="circular-progress" :style="{ width: size + 'px', height: size + 'px' }">
    <svg class="circular-progress__svg" :viewBox="`0 0 ${size} ${size}`" role="progressbar" :aria-valuenow="value"
      :aria-valuemin="0" :aria-valuemax="max">
      <circle class="circular-progress__track" :cx="size / 2" :cy="size / 2" :r="size / 2 - strokeWidth / 2"
        :stroke-width="strokeWidth" fill="none" />
      <circle class="circular-progress__fill" :cx="size / 2" :cy="size / 2" :r="size / 2 - strokeWidth / 2"
        :stroke-width="strokeWidth" :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"
        fill="none" />
    </svg>
    <div v-if="$slots.default" class="circular-progress__center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.circular-progress {
  position: relative;
  display: inline-block;
}

.circular-progress__svg {
  display: block;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circular-progress__center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.circular-progress__center>* {
  pointer-events: auto;
}

.circular-progress__track {
  stroke: var(--ui-bg-accented);
}

.circular-progress__fill {
  stroke: var(--accent-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.15s ease-out;
}
</style>
