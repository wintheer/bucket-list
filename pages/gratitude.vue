<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Three good things</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm max-w-md">
          Each evening, write down three things that went well today and why. Small things count.
        </p>
      </div>
      <div v-if="store.gratitudeStreak > 1" class="text-right shrink-0">
        <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ store.gratitudeStreak }}</p>
        <p class="text-xs text-gray-400">day streak</p>
      </div>
    </div>

    <div v-if="!store.loaded" class="h-60 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />

    <template v-else>
      <!-- Today -->
      <div class="mb-12 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          {{ editingDate === todayKey ? 'Today' : formatDate(editingDate) }}
        </p>
        <div class="space-y-5">
          <div v-for="(thing, i) in form" :key="i" class="flex gap-3">
            <span class="text-sm font-semibold text-primary-500 tabular-nums mt-1.5">{{ i + 1 }}</span>
            <div class="flex-1 space-y-1">
              <input
                v-model="thing.text"
                type="text"
                :placeholder="PLACEHOLDERS[i]"
                class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
              />
              <input
                v-model="thing.why"
                type="text"
                placeholder="Why did it go well?"
                class="w-full bg-transparent focus:outline-none py-1 text-sm text-gray-500 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-700"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <UButton :disabled="!form.some(t => t.text.trim())" :loading="saving" @click="save">
            {{ existingForEditing ? 'Update' : 'Save' }}
          </UButton>
          <UButton v-if="editingDate !== todayKey" variant="ghost" color="neutral" @click="editDate(todayKey)">Back to today</UButton>
          <span v-if="savedFlash" class="text-xs text-green-500 ml-2">Saved</span>
        </div>
      </div>

      <!-- History -->
      <div v-if="history.length">
        <template v-for="[month, entries] in groupedHistory" :key="month">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 mt-2">{{ month }}</p>
          <div class="space-y-3 mb-10">
            <div
              v-for="g in entries"
              :key="g.id"
              class="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 cursor-pointer card-hover"
              @click="editDate(g.date)"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-400">{{ formatDate(g.date) }}</span>
                <button
                  class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none"
                  @click.stop="store.deleteGratitude(g.id)"
                >×</button>
              </div>
              <ol class="space-y-2">
                <li v-for="(t, i) in g.things" :key="i" class="flex gap-3 text-sm">
                  <span class="text-gray-300 dark:text-gray-600 tabular-nums">{{ i + 1 }}</span>
                  <div>
                    <p class="text-gray-800 dark:text-gray-200">{{ t.text }}</p>
                    <p v-if="t.why" class="text-xs text-gray-400 mt-0.5">{{ t.why }}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useExercisesStore } from '~/stores/exercises'
import { localDateKey } from '~/types/exercises'
import type { GratitudeEntry } from '~/types/exercises'

const store = useExercisesStore()
onMounted(() => store.load())

const PLACEHOLDERS = [
  'Something that made you smile...',
  'Someone who made a difference...',
  'Something you did well...',
]

const todayKey = localDateKey()
const editingDate = ref(todayKey)
const form = ref(emptyForm())
const saving = ref(false)
const savedFlash = ref(false)

function emptyForm() {
  return [0, 1, 2].map(() => ({ text: '', why: '' }))
}

const existingForEditing = computed(() => store.gratitude.find(g => g.date === editingDate.value))

function loadForm() {
  const existing = existingForEditing.value
  form.value = emptyForm()
  existing?.things.forEach((t, i) => { form.value[i] = { text: t.text, why: t.why ?? '' } })
}

watch(() => store.loaded, loaded => { if (loaded) loadForm() }, { immediate: true })

function editDate(date: string) {
  editingDate.value = date
  loadForm()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function save() {
  saving.value = true
  try {
    await store.saveGratitude(editingDate.value, form.value.map(t => ({ text: t.text.trim(), why: t.why.trim() || undefined })))
    savedFlash.value = true
    setTimeout(() => { savedFlash.value = false }, 2000)
  } finally {
    saving.value = false
  }
}

const history = computed(() => store.gratitude.filter(g => g.date !== editingDate.value))

const groupedHistory = computed(() => {
  const map = new Map<string, GratitudeEntry[]>()
  for (const g of history.value) {
    const key = parseDate(g.date).toLocaleDateString('en', { month: 'long', year: 'numeric' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(g)
  }
  return Array.from(map.entries())
})

// YYYY-MM-DD parsed as local, not UTC
function parseDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d)
}

function formatDate(key: string) {
  return parseDate(key).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'long' })
}
</script>

<style scoped>
.card-hover {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.07);
}
</style>
