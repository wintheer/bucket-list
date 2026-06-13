<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />

      <div class="hero-content">
        <template v-if="!store.loaded">
          <p class="eyebrow animate-in delay-0">Your personal compass</p>
          <h1 class="animate-in delay-1">Find a purpose<br>in your life</h1>
          <p class="subtitle animate-in delay-2">Define the things you want to do, understand why they matter,<br class="hidden sm:block"> and build a life you are proud of.</p>
          <div class="flex gap-3 mt-10 justify-center flex-wrap animate-in delay-3">
            <UButton size="xl" to="/list">View my list</UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/add" class="border-white/30 text-white hover:bg-white/10">Add something</UButton>
          </div>
        </template>

        <template v-else-if="store.items.length === 0">
          <p class="eyebrow animate-in delay-0">Your personal compass</p>
          <h1 class="animate-in delay-1">What do you want<br>to do before you die?</h1>
          <p class="subtitle animate-in delay-2">Start with one dream. Everything else follows.</p>
          <div class="flex gap-3 mt-10 justify-center animate-in delay-3">
            <UButton size="xl" to="/add">Add your first dream</UButton>
          </div>
        </template>

        <template v-else>
          <p v-if="greeting" class="eyebrow animate-in delay-0">{{ greeting }}</p>
          <h1 class="animate-in delay-1">
            {{ activeCount }} {{ activeCount === 1 ? 'dream' : 'dreams' }}<br>
            <span class="text-white/55">still waiting for you.</span>
          </h1>
          <p class="subtitle animate-in delay-2">
            <span v-if="store.byStatus['in-progress'].length">{{ store.byStatus['in-progress'].length }} in motion · </span>
            <span v-if="store.byStatus.done.length">{{ store.byStatus.done.length }} lived · </span>
            <span v-if="longestWaitingDays > 90">oldest dream waiting {{ longestWaitingDays }} days</span>
            <span v-else>keep going</span>
          </p>
          <div class="flex gap-3 mt-10 justify-center flex-wrap animate-in delay-3">
            <UButton size="xl" to="/list">My dreams</UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/add" class="border-white/30 text-white hover:bg-white/10">Add a dream</UButton>
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

    <!-- Stats -->
    <section class="py-12 px-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div v-for="stat in displayStats" :key="stat.label" class="text-center">
          <div class="flex justify-center mb-2">
            <UIcon :name="stat.icon" class="size-5" :class="stat.color" />
          </div>
          <p class="text-4xl font-bold text-gray-900 dark:text-white tabular-nums leading-none">{{ stat.value }}</p>
          <p class="text-xs text-gray-400 mt-2 leading-snug">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Navigation tiles -->
    <section class="py-16 px-6 bg-gray-50/70 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="tile in tiles"
          :key="tile.title"
          :to="tile.to"
          class="group block rounded-2xl border p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          :class="[tile.bg, tile.border]"
        >
          <UIcon :name="tile.iconName" class="size-7 mb-5 transition-transform duration-300 group-hover:scale-110" :class="tile.iconColor" />
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1.5">{{ tile.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ tile.description }}</p>
          <div class="flex items-center gap-1 mt-5 text-xs font-semibold" :class="tile.iconColor">
            {{ tile.cta }}
            <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
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

// Counting stats animation
const counts = reactive({ total: 0, inProgress: 0, done: 0, thisYear: 0 })

function animateCount(setter: (v: number) => void, target: number) {
  if (target === 0) return
  const duration = 900
  const start = performance.now()
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    setter(Math.round(eased * target))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

watch(() => store.loaded, (val) => {
  if (!val) return
  animateCount(v => { counts.total = v }, store.items.length)
  animateCount(v => { counts.inProgress = v }, store.byStatus['in-progress'].length)
  animateCount(v => { counts.done = v }, store.byStatus.done.length)
  animateCount(v => { counts.thisYear = v }, store.completedThisYear.length)
}, { immediate: true })

const displayStats = computed(() => [
  { label: 'Dreams',      value: counts.total,      icon: 'i-lucide-sparkles',     color: 'text-gray-400' },
  { label: 'In motion',   value: counts.inProgress, icon: 'i-lucide-zap',           color: 'text-blue-400' },
  { label: 'Lived it',    value: counts.done,        icon: 'i-lucide-check-circle',  color: 'text-green-500' },
  { label: 'This year',   value: counts.thisYear,    icon: 'i-lucide-star',          color: 'text-yellow-400' },
])

const tiles = [
  {
    iconName: 'i-lucide-sparkles',
    iconColor: 'text-violet-400',
    title: 'Dream',
    description: 'Write down what you want to do and why it matters to you.',
    cta: 'Add a dream',
    to: '/add',
    bg: 'bg-linear-to-br from-violet-50 to-violet-100/40 dark:from-violet-950/30 dark:to-violet-900/10',
    border: 'border-violet-100 dark:border-violet-900/40',
  },
  {
    iconName: 'i-lucide-zap',
    iconColor: 'text-amber-400',
    title: 'Pursue',
    description: 'Move things from dreaming to happening to lived.',
    cta: 'My dreams',
    to: '/list',
    bg: 'bg-linear-to-br from-amber-50 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-900/10',
    border: 'border-amber-100 dark:border-amber-900/40',
  },
  {
    iconName: 'i-lucide-compass',
    iconColor: 'text-sky-400',
    title: 'Discover',
    description: 'Browse hundreds of ideas across 7 categories of life.',
    cta: 'Get inspired',
    to: '/discover',
    bg: 'bg-linear-to-br from-sky-50 to-cyan-50/40 dark:from-sky-950/30 dark:to-cyan-900/10',
    border: 'border-sky-100 dark:border-sky-900/40',
  },
  {
    iconName: 'i-lucide-book-open',
    iconColor: 'text-emerald-400',
    title: 'Reflect',
    description: 'Revisit what you lived and what it changed in you.',
    cta: 'Year in review',
    to: '/review',
    bg: 'bg-linear-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-900/10',
    border: 'border-emerald-100 dark:border-emerald-900/40',
  },
]
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
  background-color: var(--jungle-green);
  text-align: center;
  padding: 5rem 2rem 4rem;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
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

.eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(237, 247, 246, 0.5);
  margin-bottom: 1rem;
}

.subtitle {
  margin-top: 1.25rem;
  font-size: 1.125rem;
  color: rgba(237, 247, 246, 0.6);
  line-height: 1.6;
}

/* Ambient orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.orb-1 {
  width: 520px;
  height: 520px;
  background: rgba(255, 255, 255, 0.07);
  top: -20%;
  left: -12%;
  animation: driftA 20s ease-in-out infinite alternate;
}

.orb-2 {
  width: 380px;
  height: 380px;
  background: rgba(130, 80, 240, 0.11);
  bottom: -15%;
  right: -8%;
  animation: driftB 26s ease-in-out infinite alternate;
}

.orb-3 {
  width: 260px;
  height: 260px;
  background: rgba(80, 210, 195, 0.09);
  top: 15%;
  right: 8%;
  animation: driftC 17s ease-in-out infinite alternate;
}

@keyframes driftA {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(70px, 50px) scale(1.08); }
}
@keyframes driftB {
  from { transform: translate(0, 0); }
  to   { transform: translate(-60px, -40px); }
}
@keyframes driftC {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-35px, 25px) scale(1.2); }
}

/* Hero text entrance */
@keyframes heroIn {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: heroIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.delay-0 { animation-delay: 0.05s; }
.delay-1 { animation-delay: 0.22s; }
.delay-2 { animation-delay: 0.40s; }
.delay-3 { animation-delay: 0.58s; }
</style>
