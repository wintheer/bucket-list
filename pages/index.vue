<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <template v-if="!store.loaded">
          <p class="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Your personal compass</p>
          <h1>Find a purpose<br>in your life</h1>
          <p class="subtitle">Define the things you want to do, understand why they matter,<br class="hidden sm:block"> and build a life you are proud of.</p>
          <div class="flex gap-3 mt-8 justify-center flex-wrap">
            <UButton size="xl" to="/list">View my list</UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/add" class="border-white/30 text-white hover:bg-white/10">
              Add something
            </UButton>
          </div>
        </template>

        <template v-else-if="store.items.length === 0">
          <p class="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Your personal compass</p>
          <h1>What do you want<br>to do before you die?</h1>
          <p class="subtitle">Start with one dream. Everything else follows.</p>
          <div class="flex gap-3 mt-8 justify-center">
            <UButton size="xl" to="/add">Add your first goal</UButton>
          </div>
        </template>

        <template v-else>
          <p v-if="greeting" class="text-sm text-white/50 mb-3">{{ greeting }}.</p>
          <h1>
            You have {{ activeCount }}<br>
            <span class="text-white/60">{{ activeCount === 1 ? 'dream' : 'dreams' }} still waiting.</span>
          </h1>
          <p class="subtitle">
            <span v-if="store.byStatus['in-progress'].length">{{ store.byStatus['in-progress'].length }} in progress · </span>
            <span v-if="store.byStatus.done.length">{{ store.byStatus.done.length }} completed · </span>
            <span v-if="longestWaitingDays > 90">the oldest has been waiting {{ longestWaitingDays }} days</span>
            <span v-else>keep going</span>
          </p>
          <div class="flex gap-3 mt-8 justify-center flex-wrap">
            <UButton size="xl" to="/list">View my list</UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/add" class="border-white/30 text-white hover:bg-white/10">
              Add something
            </UButton>
          </div>
        </template>
      </div>
    </section>

    <!-- Today's Focus -->
    <section v-if="store.loaded && todaysFocus" class="py-12 px-6 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-2 mb-5">
          <span class="w-2 h-2 rounded-full bg-primary-400 animate-pulse shrink-0" />
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Today's focus</p>
        </div>
        <NuxtLink :to="`/list/${todaysFocus.id}`" class="group block">
          <div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-colors">
            <div class="flex items-start justify-between gap-4 mb-3">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-snug">{{ todaysFocus.title }}</h2>
              <UIcon name="i-lucide-arrow-right" class="size-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors mt-1 shrink-0" />
            </div>
            <p v-if="todaysFocus.why" class="text-gray-500 dark:text-gray-400 italic mb-4 leading-relaxed">"{{ todaysFocus.why }}"</p>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="flex items-center gap-1.5 text-xs font-medium" :class="categoryColor(todaysFocus.category)">
                <UIcon :name="categoryIcon(todaysFocus.category)" class="size-3.5" />
                {{ categoryLabel(todaysFocus.category) }}
              </span>
              <span class="text-gray-300 dark:text-gray-700">·</span>
              <span class="text-xs text-gray-400">{{ PRIORITY_CONFIG[todaysFocus.priority].label }}</span>
              <span v-if="daysSince(todaysFocus.createdAt) > 30" class="text-xs text-gray-400 ml-auto">
                Added {{ daysSince(todaysFocus.createdAt) }} days ago
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-6 px-6">
      <div class="max-w-5xl mx-auto flex flex-wrap gap-8 justify-center text-center">
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.items.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Dreams</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.byStatus['in-progress'].length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">In motion</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.byStatus.done.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Lived it</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.completedThisYear.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">This year</p>
        </div>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink v-for="feature in features" :key="feature.title" :to="feature.to" class="block group">
          <UCard class="h-full shadow-sm transition-shadow group-hover:shadow-md">
            <div class="flex flex-col items-center text-center gap-3 py-2">
              <UIcon :name="feature.icon" class="size-8 text-primary-400" />
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ feature.title }}</h3>
              <p class="text-sm text-gray-500">{{ feature.description }}</p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, PRIORITY_CONFIG } from '~/types/bucket'
import type { ItemCategory } from '~/types/bucket'

const store = useBucketListStore()

const greeting = ref('')

onMounted(async () => {
  await store.load()
  const h = new Date().getHours()
  if (h < 12)      greeting.value = 'Good morning'
  else if (h < 17) greeting.value = 'Good afternoon'
  else if (h < 22) greeting.value = 'Good evening'
  else             greeting.value = 'Still up'
})

const activeCount = computed(() => store.items.filter(i => i.status !== 'done').length)

const longestWaiting = computed(() => {
  const ideas = store.items.filter(i => i.status === 'idea')
  if (!ideas.length) return null
  return ideas.reduce((a, b) => a.createdAt < b.createdAt ? a : b)
})

const longestWaitingDays = computed(() =>
  longestWaiting.value ? daysSince(longestWaiting.value.createdAt) : 0
)

const todaysFocus = computed(() => {
  const active = store.items.filter(i => i.status !== 'done')
  if (!active.length) return null
  const date = new Date()
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return active[dayOfYear % active.length]
})

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function categoryIcon(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.icon ?? 'i-lucide-tag'
}
function categoryLabel(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.label ?? cat
}
function categoryColor(cat: ItemCategory) {
  return CATEGORIES.find(c => c.value === cat)?.color ?? 'text-gray-500'
}

const features = [
  { icon: 'i-lucide-sparkles',       title: 'Dream freely',      description: 'Write down what you want to do and why it matters.',   to: '/add' },
  { icon: 'i-lucide-chart-line',     title: 'Live your dreams',  description: 'Move things from dreaming to happening to lived.',      to: '/list' },
  { icon: 'i-lucide-lightbulb',      title: 'Get inspired',      description: 'Browse hundreds of ideas across 7 categories.',         to: '/discover' },
  { icon: 'i-lucide-calendar-check', title: 'Reflect yearly',    description: 'Revisit what you lived and what it taught you.',        to: '/review' },
]
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
  background-color: var(--jungle-green);
  text-align: center;
  padding: 5rem 2rem 4rem;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 640px;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--txt-colour);
  line-height: 1.15;
  margin: 0;
}

.subtitle {
  margin-top: 1.25rem;
  font-size: 1.125rem;
  color: rgba(237, 247, 246, 0.65);
  line-height: 1.6;
}
</style>
