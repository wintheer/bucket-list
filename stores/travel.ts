import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { VisitedCountry } from '~/types/travel'

export const useTravelStore = defineStore('travel', () => {
  const visited = ref<VisitedCountry[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      visited.value = await $fetch<VisitedCountry[]>('/api/countries')
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const visitedNames = computed(() => new Set(visited.value.map(c => c.name)))

  async function toggle(name: string) {
    const existing = visited.value.find(c => c.name === name)
    if (existing) {
      visited.value = visited.value.filter(c => c !== existing)
      await $fetch(`/api/countries/${existing.id}`, { method: 'DELETE' })
        .catch((err) => { visited.value.push(existing); throw err })
      return
    }
    const c = await $fetch<VisitedCountry>('/api/countries', { method: 'POST', body: { name } })
    if (!visitedNames.value.has(name)) visited.value.push(c)
  }

  return { visited, loading, loaded, load, visitedNames, toggle }
})
