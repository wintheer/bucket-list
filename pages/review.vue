<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ year }} in Review</h1>
      <p class="text-gray-500 mt-1">A year of living fully.</p>
    </div>

    <!-- Stats row — open numbers, no cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="flex items-center justify-center mb-2">
          <UIcon :name="stat.icon" class="size-5" :class="stat.color" />
        </div>
        <p class="text-4xl font-bold text-gray-900 dark:text-white leading-none">{{ stat.value }}</p>
        <p class="text-xs text-gray-400 mt-2">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Life area breakdown -->
    <div class="mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Where you put your energy</p>
      <div class="space-y-5">
        <div v-for="area in lifeAreaBreakdown" :key="area.value">
          <div class="flex items-center justify-between mb-1.5">
            <span class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <UIcon :name="area.icon" class="size-4 text-gray-400" />
              {{ area.label }}
            </span>
            <span class="text-xs font-semibold" :class="area.pct === 100 ? 'text-green-500' : 'text-gray-400'">
              {{ area.done }}/{{ area.total }}
            </span>
          </div>
          <div class="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out"
              :class="area.pct === 100 ? 'bg-green-400' : 'bg-primary-400'"
              :style="{ width: mounted ? `${area.pct}%` : '0%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lived this year -->
    <div class="mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Lived this year ({{ store.completedThisYear.length }})
      </p>
      <div v-if="!store.completedThisYear.length" class="text-gray-400 text-sm py-4 italic">
        This chapter is still being written.
      </div>
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="item in store.completedThisYear"
          :key="item.id"
          :to="`/list/${item.id}`"
          class="flex items-start gap-4 p-5 rounded-2xl border border-green-100 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors"
        >
          <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 mt-0.5 shrink-0" />
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</p>
            <p v-if="item.reflection" class="text-sm text-gray-600 dark:text-gray-400 mt-1 italic line-clamp-2">"{{ item.reflection }}"</p>
            <p v-else class="text-sm text-gray-400 mt-1">No story written yet.</p>
          </div>
          <span class="text-xs text-gray-400 shrink-0 mt-0.5 ml-auto">{{ formatDate(item.completedAt!) }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- What your dreams reveal -->
    <div v-if="reveals && store.items.length >= 3" class="mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">What your dreams reveal</p>

      <div v-if="reveals.archetype" class="mb-6 p-6 rounded-2xl bg-linear-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/10 border border-primary-100 dark:border-primary-900/50">
        <p class="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-1">Your archetype</p>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ reveals.archetype }}</h3>
      </div>

      <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
        Of your {{ store.items.length }} dreams,
        <span v-if="reveals.topCat" class="font-semibold text-gray-800 dark:text-gray-200"> {{ reveals.topCat.label }}</span>
        <span v-if="reveals.topCat"> comes up most — {{ reveals.topCatCount }} {{ reveals.topCatCount === 1 ? 'time' : 'times' }}.</span>
        <span v-if="reveals.topArea"> <span class="font-semibold text-gray-800 dark:text-gray-200">{{ reveals.topArea.label }}</span> is the life area you keep returning to.</span>
        <span v-if="reveals.oldest && reveals.oldestDays > 90"> Your oldest unfulfilled dream — <span class="italic">"{{ reveals.oldest.title }}"</span> — has been waiting {{ reveals.oldestDays }} days.</span>
      </p>
    </div>

    <!-- Dreamed this year -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Dreamed this year ({{ store.addedThisYear.length }})
      </p>
      <div v-if="!store.addedThisYear.length" class="text-gray-400 text-sm py-4 italic">
        Nothing dreamed yet — but the year is still young.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="item in store.addedThisYear"
          :key="item.id"
          :to="`/list/${item.id}`"
          class="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span class="text-gray-800 dark:text-gray-200 font-medium truncate">{{ item.title }}</span>
          <UBadge
            :label="STATUS_CONFIG[item.status].label"
            :color="STATUS_CONFIG[item.status].color"
            variant="soft"
            size="xs"
            class="shrink-0"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import { LIFE_AREAS, CATEGORIES, STATUS_CONFIG } from '~/types/bucket'

const store = useBucketListStore()
const mounted = ref(false)

onMounted(async () => {
  await store.load()
  await nextTick()
  mounted.value = true
})

const year = new Date().getFullYear()

const stats = computed(() => [
  { label: 'Dreams on your list', value: store.items.length,                   icon: 'i-lucide-list',         color: 'text-gray-400' },
  { label: 'Lived it',            value: store.byStatus.done.length,           icon: 'i-lucide-check-circle', color: 'text-green-500' },
  { label: 'In motion',           value: store.byStatus['in-progress'].length, icon: 'i-lucide-zap',          color: 'text-blue-400' },
  { label: 'Lived this year',     value: store.completedThisYear.length,       icon: 'i-lucide-star',         color: 'text-yellow-400' },
])

const lifeAreaBreakdown = computed(() =>
  LIFE_AREAS.map(area => {
    const all = store.byLifeArea[area.value] ?? []
    const done = all.filter(i => i.status === 'done').length
    const total = all.length
    return {
      ...area,
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
    }
  }).filter(a => a.total > 0)
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const ARCHETYPES: Record<string, string> = {
  travel: 'The Explorer',
  skills: 'The Student',
  experiences: 'The Seeker',
  relationships: 'The Connector',
  creativity: 'The Maker',
  health: 'The Athlete',
  career: 'The Builder',
}

const reveals = computed(() => {
  if (store.items.length < 3) return null

  const catCounts = store.items.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topCatEntry = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]
  const topCat = CATEGORIES.find(c => c.value === topCatEntry?.[0])

  const areaCounts = store.items.reduce((acc, i) => {
    acc[i.lifeArea] = (acc[i.lifeArea] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topAreaEntry = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]
  const topArea = LIFE_AREAS.find(a => a.value === topAreaEntry?.[0])

  const oldest = store.items
    .filter(i => i.status === 'idea')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
  const oldestDays = oldest
    ? Math.floor((Date.now() - new Date(oldest.createdAt).getTime()) / 86400000)
    : 0

  return {
    topCat,
    topCatCount: topCatEntry?.[1] ?? 0,
    topArea,
    oldest,
    oldestDays,
    archetype: topCatEntry ? ARCHETYPES[topCatEntry[0]] : null,
  }
})
</script>
