<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1>Find a purpose in your life</h1>
        <p>Your personal bucket list — set goals, track progress, and get inspired.</p>
        <UButton size="xl" class="mt-6">Start your journey now</UButton>
      </div>
    </section>

    <section class="py-16 px-6 bg-gray-50">
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UCard v-for="feature in features" :key="feature.title" class="shadow-sm">
          <div class="flex flex-col items-center text-center gap-3 py-2">
            <UIcon :name="feature.icon" class="size-8 text-blue-500" />
            <h3 class="font-semibold text-lg text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-list-plus',
    title: 'Set your goals',
    description: 'Add personal goals from over 200 different categories.',
  },
  {
    icon: 'i-lucide-chart-line',
    title: 'Track progress',
    description: 'Update, check off, and revisit your goals as you grow.',
  },
  {
    icon: 'i-lucide-lightbulb',
    title: 'Get inspired',
    description: 'Discover ideas from a vast library of bucket list experiences.',
  },
  {
    icon: 'i-lucide-users',
    title: 'Join the community',
    description: 'Share your experiences with the bucket-list community.',
  },
]
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background-color: var(--jungle-green);
  text-align: center;
  padding: 4rem 2rem;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 640px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  color: var(--txt-colour);
  line-height: 1.15;
}

.hero-content p {
  margin-top: 1rem;
  font-size: 1.125rem;
  color: rgba(237, 247, 246, 0.75);
}
</style>
