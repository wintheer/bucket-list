<template>
  <div class="relative">
    <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="w-full max-w-md mx-auto block overflow-visible" role="img" :aria-label="ariaLabel">
      <!-- Grid rings -->
      <polygon
        v-for="ring in RINGS"
        :key="ring"
        :points="polygon(domains.map(() => ring))"
        fill="none"
        class="stroke-gray-100 dark:stroke-gray-800"
        stroke-width="1"
      />
      <!-- Spokes -->
      <line
        v-for="(d, i) in domains"
        :key="d.value"
        :x1="C" :y1="C"
        :x2="point(i, 10).x" :y2="point(i, 10).y"
        class="stroke-gray-100 dark:stroke-gray-800"
        stroke-width="1"
      />

      <!-- Previous check-in -->
      <polygon
        v-if="previous"
        :points="polygon(domains.map(d => previous![d.value] ?? 0))"
        fill="none"
        class="stroke-gray-400 dark:stroke-gray-500"
        stroke-width="2"
        stroke-dasharray="4 4"
        stroke-linejoin="round"
      />

      <!-- Current -->
      <polygon
        :points="polygon(domains.map(d => current[d.value] ?? 0))"
        class="current-fill"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <circle
        v-for="(d, i) in domains"
        :key="`p-${d.value}`"
        :cx="point(i, current[d.value] ?? 0).x"
        :cy="point(i, current[d.value] ?? 0).y"
        :r="hovered === i ? 5 : 4"
        class="current-marker"
        stroke-width="2"
      />

      <!-- Labels -->
      <text
        v-for="(d, i) in domains"
        :key="`l-${d.value}`"
        :x="point(i, 10, 16).x"
        :y="point(i, 10, 16).y"
        :text-anchor="anchor(i)"
        dominant-baseline="middle"
        class="text-[11px] fill-gray-500 dark:fill-gray-400"
        :class="hovered === i ? 'fill-gray-900 dark:fill-white font-medium' : ''"
      >{{ d.short }}</text>

      <!-- Hit targets (wider than the marks) -->
      <circle
        v-for="(d, i) in domains"
        :key="`h-${d.value}`"
        :cx="point(i, current[d.value] ?? 0).x"
        :cy="point(i, current[d.value] ?? 0).y"
        r="14"
        fill="transparent"
        class="cursor-default"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
      />
    </svg>

    <!-- Tooltip -->
    <div
      v-if="hovered !== null"
      class="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg text-xs whitespace-nowrap"
    >
      <p class="font-medium text-gray-900 dark:text-white">{{ domains[hovered]!.label }}</p>
      <p class="text-gray-500 dark:text-gray-400">
        {{ current[domains[hovered]!.value] ?? '–' }} / 10
        <template v-if="previous && previous[domains[hovered]!.value] !== undefined">
          · was {{ previous[domains[hovered]!.value] }}
        </template>
      </p>
    </div>

    <!-- Legend -->
    <div v-if="previous" class="flex items-center justify-center gap-5 mt-2 text-xs text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="w-4 h-0.5 rounded-full bg-primary-500" /> {{ currentLabel }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-4 border-t-2 border-dashed border-gray-400 dark:border-gray-500" /> {{ previousLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VALUE_DOMAINS } from '~/types/me'
import type { ValueDomain } from '~/types/me'

type Scores = Partial<Record<ValueDomain, number>>

const props = withDefaults(defineProps<{
  current: Scores
  previous?: Scores
  currentLabel?: string
  previousLabel?: string
}>(), {
  currentLabel: 'Now',
  previousLabel: 'Last time',
})

const SIZE = 360
const C = SIZE / 2
const R = 120
const RINGS = [2, 4, 6, 8, 10]

const domains = VALUE_DOMAINS.map(d => ({ ...d, short: d.label.split(/ & | and /)[0]! }))
const hovered = ref<number | null>(null)

function point(i: number, score: number, extra = 0) {
  const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2
  const r = (score / 10) * R + extra
  return { x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) }
}

function polygon(scores: number[]) {
  return scores.map((s, i) => { const p = point(i, s); return `${p.x},${p.y}` }).join(' ')
}

function anchor(i: number) {
  const x = point(i, 10).x - C
  if (Math.abs(x) < 4) return 'middle'
  return x > 0 ? 'start' : 'end'
}

const ariaLabel = computed(() =>
  'Wheel of life: ' + domains.map(d => `${d.label} ${props.current[d.value] ?? 'not rated'}`).join(', ')
)
</script>

<style scoped>
.current-fill {
  fill: color-mix(in srgb, var(--ui-primary) 15%, transparent);
  stroke: var(--ui-primary);
}
.current-marker {
  fill: var(--ui-primary);
  stroke: var(--ui-bg);
  transition: r 0.15s;
}
</style>
