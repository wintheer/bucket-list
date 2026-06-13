<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <p class="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Your personal compass</p>
        <h1>Find a purpose<br>in your life</h1>
        <p class="subtitle">Define the things you want to do, understand why they matter,<br class="hidden sm:block"> and build a life you are proud of.</p>
        <div class="flex gap-3 mt-8 justify-center flex-wrap">
          <UButton size="xl" to="/list">View my list</UButton>
          <UButton size="xl" variant="outline" color="neutral" to="/add" class="border-white/30 text-white hover:bg-white/10">
            Add something
          </UButton>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="bg-white border-b border-gray-100 py-6 px-6">
      <div class="max-w-5xl mx-auto flex flex-wrap gap-8 justify-center text-center">
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.items.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total goals</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.byStatus['in-progress'].length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">In progress</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.byStatus.done.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Completed</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.completedThisYear.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Done this year</p>
        </div>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="py-16 px-6 bg-gray-50">
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink v-for="feature in features" :key="feature.title" :to="feature.to" class="block group">
          <UCard class="h-full shadow-sm transition-shadow group-hover:shadow-md">
            <div class="flex flex-col items-center text-center gap-3 py-2">
              <UIcon :name="feature.icon" class="size-8 text-blue-500" />
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ feature.title }}</h3>
              <p class="text-sm text-gray-500">{{ feature.description }}</p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <!-- Random pick CTA -->
    <section class="py-16 px-6 text-center" style="background-color: var(--jungle-green)">
      <h2 class="text-2xl font-bold text-white mb-3">Not sure where to start?</h2>
      <p class="text-white/60 mb-8">Let us pick something from your list at random.</p>
      <UButton size="lg" variant="outline" color="neutral" icon="i-lucide-shuffle" to="/list" class="border-white/30 text-white hover:bg-white/10">
        Surprise me
      </UButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'

const store = useBucketListStore()
onMounted(() => store.load())

const features = [
  {
    icon: 'i-lucide-list-plus',
    title: 'Set your goals',
    description: 'Add goals with a clear "why" behind each one.',
    to: '/add',
  },
  {
    icon: 'i-lucide-chart-line',
    title: 'Track progress',
    description: 'Move goals from idea to in progress to done.',
    to: '/list',
  },
  {
    icon: 'i-lucide-lightbulb',
    title: 'Get inspired',
    description: 'Browse 200+ prompts across 7 categories.',
    to: '/discover',
  },
  {
    icon: 'i-lucide-calendar-check',
    title: 'Reflect yearly',
    description: 'Review what you completed and what it taught you.',
    to: '/review',
  },
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
  line-height: 1.1;
  margin: 0;
}

.subtitle {
  margin-top: 1.25rem;
  font-size: 1.125rem;
  color: rgba(237, 247, 246, 0.65);
  line-height: 1.6;
}
</style>
