<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Bucket List</h1>
        <p class="text-gray-500 mt-1">{{ store.items.length }} things to do before I die</p>
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
        <UButton icon="i-lucide-plus" to="/add">Add item</UButton>
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

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="text-center py-24 text-gray-400">
      <UIcon name="i-lucide-inbox" class="size-12 mx-auto mb-4" />
      <p class="text-lg font-medium">Nothing here yet</p>
      <p class="text-sm mt-1">Add your first bucket list item or clear the filters.</p>
      <UButton class="mt-6" to="/add">Add your first item</UButton>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink
        v-for="item in filtered"
        :key="item.id"
        :to="`/list/${item.id}`"
        class="group block"
      >
        <UCard class="h-full transition-shadow hover:shadow-md cursor-pointer">
          <div v-if="item.imageUrl" class="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-4">
            <img :src="item.imageUrl" :alt="item.title" class="w-full h-40 object-cover rounded-t-lg">
          </div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 leading-snug">{{ item.title }}</h3>
            <UBadge
              :label="STATUS_CONFIG[item.status].label"
              :color="STATUS_CONFIG[item.status].color"
              variant="soft"
              size="xs"
              class="shrink-0"
            />
          </div>
          <p v-if="item.why" class="text-sm text-gray-500 italic line-clamp-2 mb-3">"{{ item.why }}"</p>
          <div class="flex items-center gap-2 mt-auto flex-wrap">
            <span :class="categoryColor(item.category)" class="flex items-center gap-1 text-xs font-medium">
              <UIcon :name="categoryIcon(item.category)" class="size-3.5" />
              {{ categoryLabel(item.category) }}
            </span>
            <span class="text-gray-300">·</span>
            <span class="text-xs text-gray-400">{{ PRIORITY_CONFIG[item.priority].label }}</span>
            <span v-if="item.location" class="text-xs text-gray-400 flex items-center gap-1 ml-auto">
              <UIcon name="i-lucide-map-pin" class="size-3" />{{ item.location }}
            </span>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Random modal -->
    <UModal v-model:open="showRandom">
      <template #content>
        <div class="p-6" v-if="randomItem">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Today, do this:</p>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ randomItem.title }}</h2>
          <p class="text-gray-500 italic mb-6">"{{ randomItem.why }}"</p>
          <div class="flex gap-3">
            <UButton :to="`/list/${randomItem.id}`" @click="showRandom = false">View item</UButton>
            <UButton variant="outline" color="neutral" @click="pickRandom">Pick another</UButton>
            <UButton variant="ghost" color="neutral" class="ml-auto" @click="showRandom = false">Close</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '~/types/bucket'
import type { ItemStatus, ItemCategory, BucketItem } from '~/types/bucket'

const store = useBucketListStore()
onMounted(() => store.load())

const activeStatus = ref<ItemStatus | null>(null)
const activeCategory = ref<ItemCategory | null>(null)
const showRandom = ref(false)
const randomItem = ref<BucketItem | undefined>()

const statuses: { value: ItemStatus; label: string }[] = [
  { value: 'idea', label: 'Ideas' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const filtered = computed(() => {
  return store.items.filter(item => {
    if (activeStatus.value && item.status !== activeStatus.value) return false
    if (activeCategory.value && item.category !== activeCategory.value) return false
    return true
  })
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

function pickRandom() {
  randomItem.value = store.pickRandom()
  if (randomItem.value) showRandom.value = true
}
</script>
