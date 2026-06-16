import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Memory } from '~/types/me'

export const useMemoriesStore = defineStore('memories', () => {
  const memories = ref<Memory[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      memories.value = await $fetch<Memory[]>('/api/memories')
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const byYear = computed(() => {
    const map = new Map<number, Memory[]>()
    for (const m of memories.value) {
      const year = new Date(m.date).getFullYear()
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(m)
    }
    return new Map([...map.entries()].sort((a, b) => b[0] - a[0]))
  })

  async function addMemory(data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) {
    const m = await $fetch<Memory>('/api/memories', { method: 'POST', body: data })
    memories.value.unshift(m)
    memories.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return m
  }

  async function updateMemory(id: string, data: Partial<Omit<Memory, 'id' | 'createdAt'>>) {
    const updated = await $fetch<Memory>(`/api/memories/${id}`, { method: 'PUT', body: data })
    const idx = memories.value.findIndex(m => m.id === id)
    if (idx !== -1) memories.value[idx] = updated
    memories.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async function deleteMemory(id: string) {
    await $fetch(`/api/memories/${id}`, { method: 'DELETE' })
    memories.value = memories.value.filter(m => m.id !== id)
  }

  return { memories, loading, loaded, load, byYear, addMemory, updateMemory, deleteMemory }
})
