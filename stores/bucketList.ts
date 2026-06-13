import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BucketItem, ItemStatus, ItemCategory, LifeArea } from '~/types/bucket'

export const useBucketListStore = defineStore('bucketList', () => {
  const items = ref<BucketItem[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      items.value = await $fetch<BucketItem[]>('/api/items')
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function addItem(data: Omit<BucketItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<BucketItem> {
    const item = await $fetch<BucketItem>('/api/items', { method: 'POST', body: data })
    items.value.unshift(item)
    return item
  }

  async function updateItem(id: string, data: Partial<Omit<BucketItem, 'id' | 'createdAt'>>) {
    const updated = await $fetch<BucketItem>(`/api/items/${id}`, { method: 'PUT', body: data })
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = updated
  }

  async function deleteItem(id: string) {
    await $fetch(`/api/items/${id}`, { method: 'DELETE' })
    items.value = items.value.filter(i => i.id !== id)
  }

  function getById(id: string): BucketItem | undefined {
    return items.value.find(i => i.id === id)
  }

  function pickRandom(): BucketItem | undefined {
    const active = items.value.filter(i => i.status !== 'done')
    if (!active.length) return undefined
    return active[Math.floor(Math.random() * active.length)]
  }

  const byStatus = computed(() => {
    const map: Record<ItemStatus, BucketItem[]> = { idea: [], 'in-progress': [], done: [] }
    for (const item of items.value) map[item.status].push(item)
    return map
  })

  const byLifeArea = computed(() => {
    const map: Partial<Record<LifeArea, BucketItem[]>> = {}
    for (const item of items.value) {
      if (!map[item.lifeArea]) map[item.lifeArea] = []
      map[item.lifeArea]!.push(item)
    }
    return map
  })

  const byCategory = computed(() => {
    const map: Partial<Record<ItemCategory, BucketItem[]>> = {}
    for (const item of items.value) {
      if (!map[item.category]) map[item.category] = []
      map[item.category]!.push(item)
    }
    return map
  })

  const completedThisYear = computed(() => {
    const year = new Date().getFullYear().toString()
    return items.value.filter(i => i.completedAt?.startsWith(year))
  })

  const addedThisYear = computed(() => {
    const year = new Date().getFullYear().toString()
    return items.value.filter(i => i.createdAt.startsWith(year))
  })

  return {
    items,
    loading,
    loaded,
    load,
    addItem,
    updateItem,
    deleteItem,
    getById,
    pickRandom,
    byStatus,
    byLifeArea,
    byCategory,
    completedThisYear,
    addedThisYear,
  }
})
