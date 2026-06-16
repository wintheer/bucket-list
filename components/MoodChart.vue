<template>
  <div ref="containerRef" class="relative">
    <div v-if="moodPoints.length < 2" class="py-8 text-center text-sm text-gray-400 dark:text-gray-600 italic">
      {{ moodPoints.length === 0
        ? 'Log your mood in a few entries to see your emotional journey here.'
        : 'Add one more entry with a mood to start your chart.' }}
    </div>

    <template v-else>
      <svg
        :width="svgWidth"
        :height="SVG_H"
        class="w-full overflow-visible"
        @mousemove="onMouseMove"
        @mouseleave="hoverIdx = null"
      >
        <defs>
          <linearGradient :id="`fill-${uid}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="fillColor" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="fillColor" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Subtle mood-band background: warm top, cool bottom -->
        <defs>
          <linearGradient :id="`bg-${uid}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#fef3c7" stop-opacity="0.07" />
            <stop offset="50%"  stop-color="#d1fae5" stop-opacity="0.04" />
            <stop offset="100%" stop-color="#dbeafe" stop-opacity="0.07" />
          </linearGradient>
        </defs>
        <rect x="0" :y="PAD_TOP" :width="svgWidth" :height="SVG_H - PAD_TOP - PAD_BOTTOM" :fill="`url(#bg-${uid})`" rx="8" />

        <!-- Area fill -->
        <path :d="areaD" :fill="`url(#fill-${uid})`" />

        <!-- Line -->
        <path :d="lineD" fill="none" :stroke="fillColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" />

        <!-- Vertical hover guide -->
        <line
          v-if="hoveredPoint"
          :x1="hoveredPoint.x" :y1="PAD_TOP"
          :x2="hoveredPoint.x" :y2="SVG_H - PAD_BOTTOM"
          stroke="#9ca3af" stroke-opacity="0.25" stroke-width="1"
        />

        <!-- Dots -->
        <g v-for="(pt, i) in moodPoints" :key="i">
          <!-- Glow -->
          <circle :cx="pt.x" :cy="pt.y" r="8" :fill="pt.color" opacity="0.12" />
          <!-- Dot -->
          <circle
            :cx="pt.x" :cy="pt.y" r="3.5"
            :fill="pt.color"
            stroke="white" stroke-width="1.5"
            :style="{ filter: `drop-shadow(0 0 4px ${pt.color})` }"
          />
        </g>
      </svg>

      <!-- Y-axis labels (absolute overlay, right side) -->
      <div
        class="absolute top-0 right-0 flex flex-col justify-between pointer-events-none text-right pr-1"
        :style="{ paddingTop: `${PAD_TOP - 2}px`, height: `${SVG_H - PAD_BOTTOM + 4}px` }"
      >
        <span class="text-xs font-medium leading-none" style="color: #fbbf24; opacity: 0.7">Wonderful</span>
        <span class="text-xs leading-none text-gray-400 dark:text-gray-600 opacity-50">Okay</span>
        <span class="text-xs leading-none text-gray-400 dark:text-gray-600 opacity-35">Struggling</span>
      </div>

      <!-- X-axis month labels -->
      <div class="relative mt-0.5" :style="{ height: '16px' }">
        <span
          v-for="ml in monthLabels"
          :key="ml.key"
          class="absolute text-xs text-gray-300 dark:text-gray-700 -translate-x-1/2 whitespace-nowrap"
          :style="{ left: `${ml.x}px` }"
        >{{ ml.label }}</span>
      </div>

      <!-- Tooltip -->
      <div
        v-if="hoveredPoint"
        class="absolute pointer-events-none bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2.5 shadow-lg z-20 min-w-32"
        :style="tooltipStyle"
      >
        <p class="text-xs font-semibold leading-none mb-1" :style="{ color: hoveredPoint.color }">
          {{ MOOD_CONFIG[hoveredPoint.mood].label }}
        </p>
        <p class="text-xs text-gray-400">{{ formatDate(hoveredPoint.entry.createdAt) }}</p>
        <div v-if="hoveredPoint.entry.title" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-44">
          {{ hoveredPoint.entry.title }}
        </div>
        <div v-if="hoveredPoint.entry.moodWords.length" class="flex flex-wrap gap-x-2 mt-1.5">
          <span v-for="w in hoveredPoint.entry.moodWords" :key="w" class="text-xs text-gray-400">{{ w }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MOOD_CONFIG } from '~/types/journal'
import type { PersonalEntry, MoodScore } from '~/types/journal'

const props = defineProps<{ entries: PersonalEntry[] }>()

const uid = Math.random().toString(36).slice(2, 7)
const SVG_H = 110
const PAD_TOP = 14
const PAD_BOTTOM = 14

const MOOD_COLORS: Record<MoodScore, string> = {
  1: '#94a3b8',
  2: '#818cf8',
  3: '#34d399',
  4: '#fb923c',
  5: '#fbbf24',
}

const containerRef = ref<HTMLDivElement>()
const svgWidth = ref(0)
const hoverIdx = ref<number | null>(null)

const chartEntries = computed(() =>
  [...props.entries]
    .filter(e => e.mood)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
)

const moodPoints = computed(() => {
  const entries = chartEntries.value
  if (!entries.length || !svgWidth.value) return []

  const W = svgWidth.value
  const H = SVG_H - PAD_TOP - PAD_BOTTOM
  const times = entries.map(e => new Date(e.createdAt).getTime())
  const minT = times[0]!
  const span = (times[times.length - 1]! - minT) || 1

  return entries.map((e, i) => {
    const xFrac = entries.length > 1 ? (times[i]! - minT) / span : 0.5
    return {
      x: xFrac * W,
      y: PAD_TOP + ((5 - (e.mood as number)) / 4) * H,
      mood: e.mood as MoodScore,
      color: MOOD_COLORS[e.mood as MoodScore],
      entry: e,
    }
  })
})

const hoveredPoint = computed(() =>
  hoverIdx.value !== null ? moodPoints.value[hoverIdx.value] ?? null : null
)

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0]!.x.toFixed(1)},${pts[0]!.y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!
    const curr = pts[i]!
    const cpx = (prev.x + curr.x) / 2
    d += ` C${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`
  }
  return d
}

const lineD = computed(() => smoothPath(moodPoints.value))

const areaD = computed(() => {
  const pts = moodPoints.value
  if (pts.length < 2) return ''
  const line = smoothPath(pts)
  const last = pts[pts.length - 1]!
  const first = pts[0]!
  const bottom = SVG_H - PAD_BOTTOM
  return `${line} L${last.x.toFixed(1)},${bottom} L${first.x.toFixed(1)},${bottom} Z`
})

const fillColor = computed(() => {
  if (!chartEntries.value.length) return MOOD_COLORS[3]
  const avg = chartEntries.value.reduce((s, e) => s + (e.mood ?? 3), 0) / chartEntries.value.length
  return MOOD_COLORS[Math.round(Math.max(1, Math.min(5, avg))) as MoodScore]
})

const monthLabels = computed(() => {
  const seen = new Set<string>()
  return moodPoints.value
    .filter(pt => {
      const key = new Date(pt.entry.createdAt).toLocaleDateString('en', { month: 'short', year: '2-digit' })
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(pt => ({
      key: pt.entry.id,
      x: pt.x,
      label: new Date(pt.entry.createdAt).toLocaleDateString('en', { month: 'short' }),
    }))
})

function onMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  let closest = 0
  let minDist = Infinity
  moodPoints.value.forEach((pt, i) => {
    const d = Math.abs(pt.x - mouseX)
    if (d < minDist) { minDist = d; closest = i }
  })
  hoverIdx.value = minDist < 48 ? closest : null
}

const tooltipStyle = computed(() => {
  const pt = hoveredPoint.value
  if (!pt || !svgWidth.value) return {}
  let left = pt.x + 14
  if (left + 180 > svgWidth.value) left = pt.x - 194
  return {
    left: `${Math.max(0, left)}px`,
    top: `${Math.max(0, pt.y - 24)}px`,
  }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
}

let ro: ResizeObserver | null = null
onMounted(() => {
  if (!containerRef.value) return
  ro = new ResizeObserver(entries => {
    const entry = entries[0]
    if (entry) svgWidth.value = entry.contentRect.width
  })
  ro.observe(containerRef.value)
})
onUnmounted(() => ro?.disconnect())
</script>
