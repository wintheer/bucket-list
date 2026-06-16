<template>
  <div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Get Inspired</h1>
        <p class="text-gray-500 mt-1">{{ totalPrompts }} dreams waiting to be lived, across {{ CATEGORIES.length }} worlds.</p>
      </div>
      <UButton variant="outline" color="neutral" icon="i-lucide-sparkles" @click="inspire">
        Inspire me
      </UButton>
    </div>

    <!-- Inspire me card -->
    <Transition name="slide-down">
      <div v-if="inspirePrompt" class="mb-8 p-5 rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <UIcon :name="inspireCategory!.icon" :class="[inspireCategory!.color, 'size-4']" />
              <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{ inspireCategory!.label }}</span>
            </div>
            <p class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">{{ inspirePrompt }}</p>
          </div>
          <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-x" @click="inspirePrompt = null" />
        </div>
        <div class="flex gap-2 mt-4">
          <UButton size="sm" icon="i-lucide-plus" @click="addFromInspire">Add to my list</UButton>
          <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-refresh-cw" @click="inspire">Another one</UButton>
        </div>
      </div>
    </Transition>

    <!-- Search -->
    <UInput
      v-model="search"
      placeholder="Search across all ideas..."
      icon="i-lucide-search"
      size="lg"
      class="mb-8"
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="search" #trailing>
        <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''" />
      </template>
    </UInput>

    <!-- Search results -->
    <div v-if="search.trim()">
      <div v-if="!searchResults.length" class="text-center py-16 text-gray-400">
        <UIcon name="i-lucide-search-x" class="size-10 mx-auto mb-3" />
        <p>No ideas found for "{{ search }}"</p>
      </div>
      <div v-else class="space-y-8">
        <div v-for="group in searchResults" :key="group.category.value">
          <div class="flex items-center gap-2 mb-3">
            <UIcon :name="group.category.icon" :class="[group.category.color, 'size-4']" />
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{ group.category.label }}</p>
          </div>
          <div class="space-y-2">
            <PromptRow
              v-for="(prompt, i) in group.prompts"
              :key="i"
              :prompt="prompt"
              :on-list="isOnList(prompt)"
              @add="addPrompt(prompt, group.category.value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Category grid (no search) -->
    <template v-else-if="!activeCategory">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.value"
          class="group text-left card-hover rounded-2xl"
          @click="activeCategory = cat.value"
        >
          <UCard class="h-full cursor-pointer">
            <div class="flex flex-col items-center text-center py-4 gap-3">
              <UIcon :name="cat.icon" :class="[cat.color, 'size-10']" />
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ cat.label }}</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ DISCOVER_PROMPTS[cat.value].length }} dreams
                  <span v-if="store.byCategory[cat.value]?.length" class="text-primary-400"> · {{ store.byCategory[cat.value]!.length }} on your list</span>
                </p>
              </div>
            </div>
          </UCard>
        </button>
      </div>

      <!-- Unexplored callout -->
      <div v-if="unexploredCategories.length && store.loaded" class="mt-10 p-5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">You haven't explored yet</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in unexploredCategories"
            :key="cat.value"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 text-sm text-gray-600 dark:text-gray-300 transition-colors"
            @click="activeCategory = cat.value"
          >
            <UIcon :name="cat.icon" class="size-3.5" :class="cat.color" />
            {{ cat.label }}
          </button>
        </div>
      </div>
    </template>

    <!-- Category detail -->
    <template v-else>
      <button
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
        @click="activeCategory = null"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" /> All categories
      </button>

      <div class="flex items-center gap-3 mb-8">
        <UIcon :name="currentCat!.icon" :class="[currentCat!.color, 'size-8']" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentCat!.label }}</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Inspiration prompts -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {{ DISCOVER_PROMPTS[activeCategory].length }} dreams to spark yours
          </p>
          <div class="space-y-2">
            <PromptRow
              v-for="(prompt, i) in DISCOVER_PROMPTS[activeCategory]"
              :key="i"
              :prompt="prompt"
              :on-list="isOnList(prompt)"
              @add="addPrompt(prompt, activeCategory)"
            />
          </div>

          <!-- Community goals -->
          <template v-if="communityInCategory.length">
            <div class="flex items-center gap-2 mt-8 mb-4">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">From the community</p>
              <UIcon name="i-lucide-users" class="size-3.5 text-gray-400" />
            </div>
            <div class="space-y-2">
              <PromptRow
                v-for="(goal, i) in communityInCategory"
                :key="'c' + i"
                :prompt="goal.title"
                :on-list="isOnList(goal.title)"
                @add="addPrompt(goal.title, activeCategory!)"
              />
            </div>
          </template>
        </div>

        <!-- Already on your list -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Already on your list</p>
          <div v-if="!itemsInCategory.length" class="text-gray-400 text-sm py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-center px-4">
            Nothing in this category yet.<br>
            <span class="text-primary-500 cursor-pointer hover:underline" @click="addPrompt(DISCOVER_PROMPTS[activeCategory][0]!, activeCategory)">
              Add "{{ DISCOVER_PROMPTS[activeCategory][0] }}"?
            </span>
          </div>
          <div v-else class="space-y-2">
            <NuxtLink
              v-for="item in itemsInCategory"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, STATUS_CONFIG, DISCOVER_PROMPTS } from '~/types/bucket'
import type { ItemCategory } from '~/types/bucket'

const store = useBucketListStore()
const router = useRouter()

const communityGoals = ref<{ title: string; category: string }[]>([])

onMounted(async () => {
  await store.load()
  try {
    communityGoals.value = await $fetch<{ title: string; category: string }[]>('/api/community')
  } catch {
    // community section is optional
  }
})

const activeCategory = ref<ItemCategory | null>(null)
const search = ref('')
const inspirePrompt = ref<string | null>(null)
const inspireCategory = ref(CATEGORIES[0]!)

const totalPrompts = Object.values(DISCOVER_PROMPTS).reduce((n, arr) => n + arr.length, 0)

const currentCat = computed(() => CATEGORIES.find(c => c.value === activeCategory.value))

const itemsInCategory = computed(() =>
  activeCategory.value ? (store.byCategory[activeCategory.value] ?? []) : []
)

const unexploredCategories = computed(() =>
  CATEGORIES.filter(c => !(store.byCategory[c.value]?.length))
)

const onListTitles = computed(() => new Set(store.items.map(i => i.title.toLowerCase())))

const communityInCategory = computed(() => {
  if (!activeCategory.value) return []
  return communityGoals.value
    .filter(g => g.category === activeCategory.value && !isOnList(g.title))
    .slice(0, 10)
})

function isOnList(prompt: string) {
  return onListTitles.value.has(prompt.toLowerCase())
}

const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  return CATEGORIES.flatMap(cat => {
    const prompts = DISCOVER_PROMPTS[cat.value].filter(p => p.toLowerCase().includes(q))
    return prompts.length ? [{ category: cat, prompts }] : []
  })
})

function inspire() {
  const allPrompts = CATEGORIES.flatMap(cat =>
    DISCOVER_PROMPTS[cat.value].map(prompt => ({ prompt, cat }))
  )
  const pick = allPrompts[Math.floor(Math.random() * allPrompts.length)]!
  inspirePrompt.value = pick.prompt
  inspireCategory.value = pick.cat
}

function addFromInspire() {
  if (!inspirePrompt.value) return
  router.push({ path: '/add', query: { title: inspirePrompt.value, category: inspireCategory.value.value } })
}

function addPrompt(prompt: string, category?: ItemCategory) {
  router.push({ path: '/add', query: { title: prompt, category: category ?? activeCategory.value ?? undefined } })
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.card-hover {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
}
</style>
