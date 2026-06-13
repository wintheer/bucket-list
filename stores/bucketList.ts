import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BucketItem, ItemStatus, ItemCategory, LifeArea } from '~/types/bucket'

const STORAGE_KEY = 'bucket-list-items'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const SEED_ITEMS: BucketItem[] = [
  {
    id: 'seed-1',
    title: 'Hike the Camino de Santiago',
    description: 'Walk the French route across northern Spain over 30+ days.',
    why: 'I want to experience long solitude, simplicity, and meet people from all over the world with nothing but a backpack.',
    category: 'travel',
    lifeArea: 'adventure',
    status: 'idea',
    priority: 'near-term',
    location: 'Spain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Learn to play the piano',
    description: 'Reach a level where I can play a full piece from memory.',
    why: 'Music gives me a way to express things I cannot put into words.',
    category: 'skills',
    lifeArea: 'creativity',
    status: 'in-progress',
    priority: 'soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Run a marathon',
    description: 'Train for and complete a full 42km marathon.',
    why: 'To prove to myself that I can commit to something hard and see it through.',
    category: 'health',
    lifeArea: 'health',
    status: 'idea',
    priority: 'someday',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useBucketListStore = defineStore('bucketList', () => {
  const items = ref<BucketItem[]>([])

  function load() {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        items.value = JSON.parse(raw)
      } catch {
        items.value = [...SEED_ITEMS]
      }
    } else {
      items.value = [...SEED_ITEMS]
      save()
    }
  }

  function save() {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function addItem(data: Omit<BucketItem, 'id' | 'createdAt' | 'updatedAt'>): BucketItem {
    const now = new Date().toISOString()
    const item: BucketItem = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    items.value.unshift(item)
    save()
    return item
  }

  function updateItem(id: string, data: Partial<Omit<BucketItem, 'id' | 'createdAt'>>) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx === -1) return
    const now = new Date().toISOString()
    const existing = items.value[idx]!
    const updated: BucketItem = { ...existing, ...data, updatedAt: now }
    if (data.status === 'done' && existing.status !== 'done') {
      updated.completedAt = now
    }
    if (data.status && data.status !== 'done') {
      updated.completedAt = undefined
    }
    items.value[idx] = updated
    save()
  }

  function deleteItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    save()
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
