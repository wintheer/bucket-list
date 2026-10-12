<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <NuxtLink to="/me" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to Me
    </NuxtLink>

    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Check in</p>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wheel of Life</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
      How satisfied are you with each area of your life right now? Go with your gut.
      Nothing has to be a 10, and not every area has to matter to you. Check in again every month or so to see how things change.
    </p>

    <div v-if="!store.loaded" class="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />

    <template v-else>
      <!-- Chart -->
      <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 mb-8">
        <WheelChart
          :current="displayed.current"
          :previous="displayed.previous"
          :current-label="displayed.currentLabel"
          :previous-label="displayed.previousLabel"
        />
      </div>

      <!-- Rate -->
      <div v-if="!viewingId" class="mb-10">
        <div class="space-y-4">
          <div v-for="d in VALUE_DOMAINS" :key="d.value" class="grid grid-cols-[1fr_auto] sm:grid-cols-[12rem_1fr_2rem] items-center gap-x-4 gap-y-1">
            <label :for="`wheel-${d.value}`" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon :name="d.icon" class="size-4 text-gray-400 shrink-0" />
              {{ d.label }}
            </label>
            <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-white text-right sm:order-last">{{ scores[d.value] }}</span>
            <input
              :id="`wheel-${d.value}`"
              v-model.number="scores[d.value]"
              type="range"
              min="1"
              max="10"
              step="1"
              class="col-span-2 sm:col-span-1 w-full accent-primary-500"
            />
          </div>
        </div>

        <textarea
          v-model="note"
          placeholder="Anything you noticed? (optional)"
          rows="2"
          class="w-full mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:border-primary-400 dark:focus:border-primary-600 placeholder:text-gray-300 dark:placeholder:text-gray-700"
        />
        <UButton class="mt-3" :loading="saving" @click="save">Save check-in</UButton>
      </div>

      <!-- Insights for latest check-in -->
      <div v-if="store.latestWheel && !viewingId && lowestAreas.length" class="mb-10 p-5 rounded-2xl bg-primary-50/60 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40">
        <p class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Where to focus</p>
        <div class="space-y-3">
          <div v-for="area in lowestAreas" :key="area.value" class="flex items-start gap-3">
            <UIcon :name="area.icon" class="size-4 text-primary-500 mt-0.5 shrink-0" />
            <div class="flex-1 min-w-0 text-sm">
              <p class="text-gray-800 dark:text-gray-200">
                <span class="font-medium">{{ area.label }}</span> is at {{ area.score }}/10.
                <template v-if="area.values.length">
                  You care about {{ area.values.join(', ') }} here.
                </template>
              </p>
              <NuxtLink to="/add" class="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                Add a dream that would move this forward →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- History -->
      <div v-if="store.wheel.length">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Past check-ins</p>
        <div class="space-y-2">
          <div
            v-for="w in store.wheel"
            :key="w.id"
            class="group flex items-center gap-4 p-3.5 rounded-xl border transition-colors cursor-pointer"
            :class="viewingId === w.id
              ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-950/20'
              : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'"
            @click="viewingId = viewingId === w.id ? null : w.id"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(w.createdAt) }}</p>
              <p v-if="w.note" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ w.note }}</p>
            </div>
            <span class="text-xs text-gray-400 tabular-nums">avg {{ average(w.scores).toFixed(1) }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none shrink-0"
              @click.stop="remove(w.id)"
            >×</button>
          </div>
        </div>
        <p v-if="viewingId" class="text-xs text-gray-400 mt-3">
          Showing a past check-in. <button class="text-primary-600 dark:text-primary-400 hover:underline" @click="viewingId = null">Back to a new check-in</button>
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useExercisesStore } from '~/stores/exercises'
import { useMeStore } from '~/stores/me'
import { VALUE_DOMAINS } from '~/types/me'
import type { ValueDomain } from '~/types/me'
import type { WheelCheckIn } from '~/types/exercises'

const store = useExercisesStore()
const meStore = useMeStore()
onMounted(() => Promise.all([store.load(), meStore.load()]))

type Scores = Record<ValueDomain, number>

const scores = reactive(Object.fromEntries(VALUE_DOMAINS.map(d => [d.value, 5])) as Scores)
const note = ref('')
const saving = ref(false)
const viewingId = ref<string | null>(null)

// Start from the last check-in so re-rating is quick
watch(() => store.latestWheel, latest => {
  if (!latest) return
  for (const d of VALUE_DOMAINS) scores[d.value] = latest.scores[d.value] ?? 5
}, { immediate: true })

const displayed = computed(() => {
  if (viewingId.value) {
    const idx = store.wheel.findIndex(w => w.id === viewingId.value)
    const w = store.wheel[idx]!
    const before = store.wheel[idx + 1]
    return {
      current: w.scores,
      previous: before?.scores,
      currentLabel: formatDate(w.createdAt),
      previousLabel: before ? formatDate(before.createdAt) : '',
    }
  }
  // Compare against the last saved check-in, or the one before it if nothing has changed since
  const unchanged = store.latestWheel && VALUE_DOMAINS.every(d => store.latestWheel!.scores[d.value] === scores[d.value])
  const compareTo = unchanged ? store.wheel[1] : store.latestWheel
  return {
    current: scores,
    previous: compareTo?.scores,
    currentLabel: 'Now',
    previousLabel: compareTo ? formatDate(compareTo.createdAt) : '',
  }
})

const lowestAreas = computed(() => {
  const latest = store.latestWheel
  if (!latest) return []
  return VALUE_DOMAINS
    .map(d => ({
      ...d,
      score: latest.scores[d.value] ?? 10,
      values: meStore.values.filter(v => v.domain === d.value).map(v => v.name),
    }))
    .filter(d => d.score <= 6)
    .sort((a, b) => a.score - b.score || b.values.length - a.values.length)
    .slice(0, 2)
})

async function save() {
  saving.value = true
  try {
    await store.addWheelCheckIn({ scores: { ...scores }, note: note.value.trim() || undefined })
    note.value = ''
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (viewingId.value === id) viewingId.value = null
  await store.deleteWheelCheckIn(id)
}

function average(s: WheelCheckIn['scores']) {
  const vals = Object.values(s).filter((n): n is number => typeof n === 'number')
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
