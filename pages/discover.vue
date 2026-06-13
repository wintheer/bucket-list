<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Discover</h1>
      <p class="text-gray-500 mt-1">Explore categories and find things that resonate with you.</p>
    </div>

    <!-- Category grid -->
    <div v-if="!activeCategory" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.value"
        class="group text-left"
        @click="activeCategory = cat.value"
      >
        <UCard class="h-full transition-all hover:shadow-md cursor-pointer">
          <div class="flex flex-col items-center text-center py-4 gap-3">
            <UIcon :name="cat.icon" :class="[cat.color, 'size-10']" />
            <div>
              <p class="font-semibold text-gray-900">{{ cat.label }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ store.byCategory[cat.value]?.length ?? 0 }} on your list
              </p>
            </div>
          </div>
        </UCard>
      </button>
    </div>

    <!-- Category detail -->
    <div v-else>
      <button
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8"
        @click="activeCategory = null"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" /> All categories
      </button>

      <div class="flex items-center gap-3 mb-8">
        <UIcon :name="currentCat!.icon" :class="[currentCat!.color, 'size-8']" />
        <h2 class="text-2xl font-bold text-gray-900">{{ currentCat!.label }}</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Inspiration prompts -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Ideas to spark yours</p>
          <div class="space-y-3">
            <div
              v-for="(prompt, i) in DISCOVER_PROMPTS[activeCategory]"
              :key="i"
              class="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors group"
            >
              <span class="text-gray-700">{{ prompt }}</span>
              <UButton
                size="xs"
                variant="ghost"
                icon="i-lucide-plus"
                class="opacity-0 group-hover:opacity-100 shrink-0"
                @click="addFromPrompt(prompt)"
              />
            </div>
          </div>
        </div>

        <!-- Already on your list -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Already on your list</p>
          <div v-if="!itemsInCategory.length" class="text-gray-400 text-sm py-4">
            Nothing yet in this category.
            <NuxtLink to="/add" class="text-primary-600 underline ml-1">Add one?</NuxtLink>
          </div>
          <div v-else class="space-y-3">
            <NuxtLink
              v-for="item in itemsInCategory"
              :key="item.id"
              :to="`/list/${item.id}`"
              class="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
            >
              <span class="text-gray-800 font-medium">{{ item.title }}</span>
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
    </div>
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
onMounted(() => store.load())

const activeCategory = ref<ItemCategory | null>(null)

const currentCat = computed(() => CATEGORIES.find(c => c.value === activeCategory.value))

const itemsInCategory = computed(() =>
  activeCategory.value ? (store.byCategory[activeCategory.value] ?? []) : []
)

function addFromPrompt(prompt: string) {
  router.push({ path: '/add', query: { title: prompt, category: activeCategory.value ?? undefined } })
}
</script>
