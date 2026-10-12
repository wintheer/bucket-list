import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WheelCheckIn, Vision, GratitudeEntry, GoodThing } from '~/types/exercises'
import { localDateKey } from '~/types/exercises'

export const useExercisesStore = defineStore('exercises', () => {
  const wheel = ref<WheelCheckIn[]>([])
  const visions = ref<Vision[]>([])
  const gratitude = ref<GratitudeEntry[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      const [w, v, g] = await Promise.all([
        $fetch<WheelCheckIn[]>('/api/wheel'),
        $fetch<Vision[]>('/api/visions'),
        $fetch<GratitudeEntry[]>('/api/gratitude'),
      ])
      wheel.value = w
      visions.value = v
      gratitude.value = g
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  // Wheel of Life
  const latestWheel = computed(() => wheel.value[0])

  async function addWheelCheckIn(data: Pick<WheelCheckIn, 'scores' | 'note'>) {
    const w = await $fetch<WheelCheckIn>('/api/wheel', { method: 'POST', body: data })
    wheel.value.unshift(w)
    return w
  }

  async function deleteWheelCheckIn(id: string) {
    await $fetch(`/api/wheel/${id}`, { method: 'DELETE' })
    wheel.value = wheel.value.filter(w => w.id !== id)
  }

  // Best Possible Self
  async function addVision(data: Pick<Vision, 'horizonYears' | 'text'>) {
    const v = await $fetch<Vision>('/api/visions', { method: 'POST', body: data })
    visions.value.unshift(v)
    return v
  }

  async function deleteVision(id: string) {
    await $fetch(`/api/visions/${id}`, { method: 'DELETE' })
    visions.value = visions.value.filter(v => v.id !== id)
  }

  // Three Good Things
  const todaysGratitude = computed(() => gratitude.value.find(g => g.date === localDateKey()))

  // Consecutive days up to today (or yesterday, so the streak survives until you write tonight)
  const gratitudeStreak = computed(() => {
    const dates = new Set(gratitude.value.map(g => g.date))
    const d = new Date()
    if (!dates.has(localDateKey(d))) d.setDate(d.getDate() - 1)
    let streak = 0
    while (dates.has(localDateKey(d))) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  })

  async function saveGratitude(date: string, things: GoodThing[]) {
    const existing = gratitude.value.find(g => g.date === date)
    if (existing) {
      const updated = await $fetch<GratitudeEntry>(`/api/gratitude/${existing.id}`, { method: 'PUT', body: { things } })
      gratitude.value[gratitude.value.indexOf(existing)] = updated
      return updated
    }
    const g = await $fetch<GratitudeEntry>('/api/gratitude', { method: 'POST', body: { date, things } })
    gratitude.value.unshift(g)
    gratitude.value.sort((a, b) => b.date.localeCompare(a.date))
    return g
  }

  async function deleteGratitude(id: string) {
    await $fetch(`/api/gratitude/${id}`, { method: 'DELETE' })
    gratitude.value = gratitude.value.filter(g => g.id !== id)
  }

  return {
    wheel, visions, gratitude, loading, loaded, load,
    latestWheel, addWheelCheckIn, deleteWheelCheckIn,
    addVision, deleteVision,
    todaysGratitude, gratitudeStreak, saveGratitude, deleteGratitude,
  }
})
