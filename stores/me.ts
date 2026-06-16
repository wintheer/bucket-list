import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PersonalValue, WhoAmIVersion, Letter } from '~/types/me'

export const useMeStore = defineStore('me', () => {
  const values = ref<PersonalValue[]>([])
  const whoAmIVersions = ref<WhoAmIVersion[]>([])
  const letters = ref<Letter[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      const [v, w, l] = await Promise.all([
        $fetch<PersonalValue[]>('/api/values'),
        $fetch<WhoAmIVersion[]>('/api/whoami'),
        $fetch<Letter[]>('/api/letters'),
      ])
      values.value = v
      whoAmIVersions.value = w
      letters.value = l
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const currentStatement = computed(() => whoAmIVersions.value[0]?.text ?? '')

  const lettersWithStatus = computed(() => {
    const now = new Date()
    return letters.value.map(l => ({ ...l, isSealed: new Date(l.openOn) > now }))
  })

  // Values
  async function addValue(data: Omit<PersonalValue, 'id' | 'createdAt'>) {
    const v = await $fetch<PersonalValue>('/api/values', { method: 'POST', body: data })
    values.value.push(v)
    return v
  }

  async function deleteValue(id: string) {
    await $fetch(`/api/values/${id}`, { method: 'DELETE' })
    values.value = values.value.filter(v => v.id !== id)
  }

  // Who Am I
  async function saveWhoAmI(text: string) {
    const v = await $fetch<WhoAmIVersion>('/api/whoami', { method: 'POST', body: { text } })
    whoAmIVersions.value.unshift(v)
    return v
  }

  // Letters
  async function addLetter(data: Omit<Letter, 'id' | 'createdAt'>) {
    const l = await $fetch<Letter>('/api/letters', { method: 'POST', body: data })
    letters.value.unshift(l)
    return l
  }

  async function deleteLetter(id: string) {
    await $fetch(`/api/letters/${id}`, { method: 'DELETE' })
    letters.value = letters.value.filter(l => l.id !== id)
  }

  return {
    values, whoAmIVersions, letters, loading, loaded,
    load, currentStatement, lettersWithStatus,
    addValue, deleteValue,
    saveWhoAmI,
    addLetter, deleteLetter,
  }
})
