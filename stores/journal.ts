import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PersonalEntry, Journal } from '~/types/journal'

export const useJournalStore = defineStore('journal', () => {
  // Entries
  const entries = ref<PersonalEntry[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      entries.value = await $fetch<PersonalEntry[]>('/api/journal')
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function addEntry(data: Omit<PersonalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonalEntry> {
    const entry = await $fetch<PersonalEntry>('/api/journal', { method: 'POST', body: data })
    entries.value.unshift(entry)
    return entry
  }

  async function updateEntry(id: string, data: Partial<Omit<PersonalEntry, 'id' | 'createdAt'>>) {
    const updated = await $fetch<PersonalEntry>(`/api/journal/${id}`, { method: 'PUT', body: data })
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) entries.value[idx] = updated
  }

  async function deleteEntry(id: string) {
    await $fetch(`/api/journal/${id}`, { method: 'DELETE' })
    entries.value = entries.value.filter(e => e.id !== id)
  }

  // Journals
  const journals = ref<Journal[]>([])
  const journalsLoading = ref(false)
  const journalsLoaded = ref(false)

  const defaultJournalId = computed(() => journals.value[0]?.id ?? '')

  async function loadJournals() {
    if (journalsLoaded.value || journalsLoading.value) return
    journalsLoading.value = true
    try {
      journals.value = await $fetch<Journal[]>('/api/journals')
      journalsLoaded.value = true
    } finally {
      journalsLoading.value = false
    }
  }

  async function addJournal(name: string, color: string): Promise<Journal> {
    const j = await $fetch<Journal>('/api/journals', { method: 'POST', body: { name, color } })
    journals.value.push(j)
    return j
  }

  async function deleteJournal(id: string) {
    await $fetch(`/api/journals/${id}`, { method: 'DELETE' })
    journals.value = journals.value.filter(j => j.id !== id)
  }

  return {
    entries, loading, loaded, load, addEntry, updateEntry, deleteEntry,
    journals, journalsLoaded, defaultJournalId, loadJournals, addJournal, deleteJournal,
  }
})
