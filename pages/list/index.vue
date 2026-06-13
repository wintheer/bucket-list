<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Dreams</h1>
        <p class="text-gray-500 mt-1">{{ $t('list.subtitle', store.items.length) }}</p>
      </div>
      <div class="flex gap-3">
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-shuffle"
          @click="pickRandom"
        >
          Surprise me
        </UButton>
        <UButton icon="i-lucide-plus" to="/add">Add a dream</UButton>
      </div>
    </div>

    <!-- Progress -->
    <div v-if="store.items.length > 0" class="mb-8">
      <div class="h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700 ease-out bg-primary-300/70 dark:bg-primary-600/50"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <p class="text-xs text-gray-400 italic mt-2">{{ progressMessage }}</p>
    </div>

    <!-- If not now, when? -->
    <div v-if="longWaiting.length && store.loaded" class="mb-8 p-5 rounded-2xl border border-dashed border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
      <p class="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">If not now, when?</p>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="item in longWaiting"
          :key="item.id"
          :to="`/list/${item.id}`"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 text-sm text-gray-700 dark:text-gray-300 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
        >
          {{ item.title }}
          <span class="text-xs text-amber-500 font-medium">{{ daysSince(item.createdAt) }}d</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-8">
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="s in statuses"
          :key="s.value"
          size="sm"
          :variant="activeStatus === s.value ? 'solid' : 'outline'"
          :color="activeStatus === s.value ? 'primary' : 'neutral'"
          @click="activeStatus = activeStatus === s.value ? null : s.value"
        >
          {{ s.label }}
          <UBadge v-if="store.byStatus[s.value].length" :label="String(store.byStatus[s.value].length)" size="xs" class="ml-1" variant="soft" />
        </UButton>
      </div>
      <USeparator orientation="vertical" class="h-8 hidden sm:block" />
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="c in CATEGORIES"
          :key="c.value"
          size="sm"
          :variant="activeCategory === c.value ? 'solid' : 'ghost'"
          :color="activeCategory === c.value ? 'primary' : 'neutral'"
          @click="activeCategory = activeCategory === c.value ? null : c.value"
        >
          <UIcon :name="c.icon" class="mr-1" />{{ c.label }}
        </UButton>
      </div>
    </div>

    <!-- Skeleton loading -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-5" v-if="!store.loaded">
      <div
        v-for="(h, i) in [null, 'tall', null, 'tall', null, 'tall']"
        :key="i"
        class="break-inside-avoid mb-5 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-3 animate-pulse"
      >
        <div class="flex justify-between gap-3">
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-12 shrink-0" />
        </div>
        <div class="h-5 bg-gray-100 dark:bg-gray-800 rounded w-4/5" />
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
        <div v-if="h === 'tall'" class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mt-1" />
        <div v-if="h === 'tall'" class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filtered.length === 0" class="text-center py-24 text-gray-400">
      <UIcon name="i-lucide-sparkles" class="size-12 mx-auto mb-4 text-gray-300" />
      <p class="text-lg font-medium text-gray-600 dark:text-gray-300">Your story starts here</p>
      <p class="text-sm mt-1">Every great life began with a single dream.</p>
      <UButton class="mt-6" to="/add">Dream something up</UButton>
    </div>

    <!-- Masonry -->
    <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-5">
      <NuxtLink
        v-for="item in filtered"
        :key="item.id"
        :to="`/list/${item.id}`"
        class="group block break-inside-avoid mb-5"
      >
        <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all overflow-hidden p-6">
          <!-- Image -->
          <div v-if="item.imageUrl" class="-mx-6 -mt-6 mb-5">
            <img :src="item.imageUrl" :alt="item.title" class="w-full h-44 object-cover">
          </div>
          <!-- Category + status row -->
          <div class="flex items-center justify-between mb-3">
            <span class="flex items-center gap-1.5 text-xs font-medium" :class="categoryColor(item.category)">
              <UIcon :name="categoryIcon(item.category)" class="size-3.5" />
              {{ categoryLabel(item.category) }}
            </span>
            <UBadge
              :label="STATUS_CONFIG[item.status].label"
              :color="STATUS_CONFIG[item.status].color"
              variant="soft"
              size="xs"
            />
          </div>
          <!-- Title -->
          <h3 class="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ item.title }}</h3>
          <!-- Why — unclamped so cards breathe at different heights -->
          <p v-if="item.why" class="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">"{{ item.why }}"</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Surprise modal -->
    <UModal v-model:open="showRandom">
      <template #content>
        <div class="p-6" v-if="surprise">
          <!-- Existing dream -->
          <template v-if="surprise.type === 'own'">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">A dream already on your list</p>
            <div class="flex items-center gap-2 mb-2">
              <UIcon :name="categoryIcon(surprise.item.category)" class="size-4 shrink-0" :class="categoryColor(surprise.item.category)" />
              <span class="text-xs font-medium" :class="categoryColor(surprise.item.category)">{{ categoryLabel(surprise.item.category) }}</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ surprise.item.title }}</h2>
            <p v-if="surprise.item.why" class="text-gray-500 dark:text-gray-400 italic mb-6">"{{ surprise.item.why }}"</p>
            <div class="flex gap-3">
              <UButton :to="`/list/${surprise.item.id}`" @click="showRandom = false">Open this dream</UButton>
              <UButton variant="outline" color="neutral" @click="pickRandom">Another one</UButton>
              <UButton variant="ghost" color="neutral" class="ml-auto" @click="showRandom = false">Close</UButton>
            </div>
          </template>
          <!-- Curated suggestion -->
          <template v-else>
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Something you haven't dreamed yet</p>
            <div class="flex items-center gap-2 mb-2">
              <UIcon :name="categoryIcon(surprise.category)" class="size-4 shrink-0" :class="categoryColor(surprise.category)" />
              <span class="text-xs font-medium" :class="categoryColor(surprise.category)">{{ categoryLabel(surprise.category) }}</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ surprise.title }}</h2>
            <div class="flex gap-3">
              <UButton :to="{ path: '/add', query: { title: surprise.title, category: surprise.category } }" @click="showRandom = false">Add this dream</UButton>
              <UButton variant="outline" color="neutral" @click="pickRandom">Another one</UButton>
              <UButton variant="ghost" color="neutral" class="ml-auto" @click="showRandom = false">Close</UButton>
            </div>
          </template>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG, DISCOVER_PROMPTS } from '~/types/bucket'
import type { ItemStatus, ItemCategory, BucketItem } from '~/types/bucket'

type Surprise =
  | { type: 'own'; item: BucketItem }
  | { type: 'prompt'; title: string; category: ItemCategory }

const store = useBucketListStore()
onMounted(() => store.load())

const activeStatus = ref<ItemStatus | null>(null)
const activeCategory = ref<ItemCategory | null>(null)
const showRandom = ref(false)
const surprise = ref<Surprise | null>(null)

const statuses: { value: ItemStatus; label: string }[] = [
  { value: 'idea',        label: STATUS_CONFIG.idea.label },
  { value: 'in-progress', label: STATUS_CONFIG['in-progress'].label },
  { value: 'done',        label: STATUS_CONFIG.done.label },
]

const filtered = computed(() => {
  return store.items.filter(item => {
    if (activeStatus.value && item.status !== activeStatus.value) return false
    if (activeCategory.value && item.category !== activeCategory.value) return false
    return true
  })
})

const progressPercent = computed(() => {
  if (!store.items.length) return 0
  return Math.round((store.byStatus.done.length / store.items.length) * 100)
})

const progressMessage = computed(() => {
  const p = progressPercent.value
  if (p === 100) return 'You\'ve lived them all — time to dream bigger.'
  if (p >= 75)   return 'Almost there — the finish line is in sight.'
  if (p >= 50)   return 'Over halfway. You\'re building a life to be proud of.'
  if (p >= 25)   return 'A beautiful start. Keep going.'
  if (p > 0)     return 'Every big life starts with a first step.'
  return 'The journey of a thousand miles begins with a single step.'
})

function categoryIcon(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.icon ?? 'i-lucide-tag'
}
function categoryLabel(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.label ?? cat
}
function categoryColor(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.color ?? 'text-gray-500'
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

const longWaiting = computed(() =>
  store.items
    .filter(i => i.status === 'idea' && daysSince(i.createdAt) > 180)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5)
)

function pickRandom() {
  const onListTitles = new Set(store.items.map(i => i.title.toLowerCase()))

  const ownPool: Surprise[] = store.items
    .filter(i => i.status !== 'done')
    .map(item => ({ type: 'own', item }))

  const promptPool: Surprise[] = Object.entries(DISCOVER_PROMPTS).flatMap(([cat, prompts]) =>
    prompts
      .filter(p => !onListTitles.has(p.toLowerCase()))
      .map(p => ({ type: 'prompt', title: p, category: cat as ItemCategory }))
  )

  const pool = [...ownPool, ...promptPool]
  if (!pool.length) return
  surprise.value = pool[Math.floor(Math.random() * pool.length)]!
  showRandom.value = true
}
</script>
