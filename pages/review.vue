<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">{{ year }} in Review</h1>
      <p class="text-gray-500 mt-1">Your bucket list progress this year.</p>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
      <UCard v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="py-2">
          <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
        </div>
      </UCard>
    </div>

    <!-- Life area breakdown -->
    <div class="mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Life area breakdown</p>
      <div class="space-y-4">
        <div v-for="area in lifeAreaBreakdown" :key="area.value">
          <div class="flex items-center justify-between mb-1">
            <span class="flex items-center gap-2 text-sm font-medium text-gray-700">
              <UIcon :name="area.icon" class="size-4 text-gray-400" />
              {{ area.label }}
            </span>
            <span class="text-sm text-gray-400">{{ area.done }}/{{ area.total }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-400 rounded-full transition-all"
              :style="{ width: area.total ? `${(area.done / area.total) * 100}%` : '0%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Completed this year -->
    <div class="mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Completed this year ({{ store.completedThisYear.length }})
      </p>
      <div v-if="!store.completedThisYear.length" class="text-gray-400 text-sm py-4">
        Nothing completed yet this year — but the year is still young.
      </div>
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="item in store.completedThisYear"
          :key="item.id"
          :to="`/list/${item.id}`"
          class="flex items-start gap-4 p-5 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 transition-colors"
        >
          <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 mt-0.5 shrink-0" />
          <div class="min-w-0">
            <p class="font-semibold text-gray-900">{{ item.title }}</p>
            <p v-if="item.reflection" class="text-sm text-gray-600 mt-1 italic line-clamp-2">"{{ item.reflection }}"</p>
            <p v-else class="text-sm text-gray-400 mt-1">No reflection written yet.</p>
          </div>
          <span class="text-xs text-gray-400 shrink-0 mt-0.5 ml-auto">{{ formatDate(item.completedAt!) }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Added this year -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Added this year ({{ store.addedThisYear.length }})
      </p>
      <div v-if="!store.addedThisYear.length" class="text-gray-400 text-sm py-4">Nothing added yet.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="item in store.addedThisYear"
          :key="item.id"
          :to="`/list/${item.id}`"
          class="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-800 font-medium truncate">{{ item.title }}</span>
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
import { computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import { LIFE_AREAS, STATUS_CONFIG } from '~/types/bucket'

const store = useBucketListStore()
onMounted(() => store.load())

const year = new Date().getFullYear()

const stats = computed(() => [
  { label: 'Total goals',     value: store.items.length },
  { label: 'Completed',       value: store.byStatus.done.length },
  { label: 'In progress',     value: store.byStatus['in-progress'].length },
  { label: 'Done this year',  value: store.completedThisYear.length },
])

const lifeAreaBreakdown = computed(() =>
  LIFE_AREAS.map(area => {
    const all = store.byLifeArea[area.value] ?? []
    return {
      ...area,
      total: all.length,
      done: all.filter(i => i.status === 'done').length,
    }
  }).filter(a => a.total > 0)
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>
