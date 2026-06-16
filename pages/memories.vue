<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Memories</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">The experiences that have shaped you.</p>
      </div>
      <UButton v-if="!composing" icon="i-lucide-plus" @click="startAdd">Add a memory</UButton>
    </div>

    <!-- Compose -->
    <Transition name="compose">
      <div v-if="composing" class="mb-10 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{ editingId ? 'Edit memory' : 'New memory' }}</p>

        <input
          v-model="form.title"
          type="text"
          placeholder="What happened?"
          class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors font-medium text-lg"
        />

        <div class="flex items-center gap-3">
          <label class="text-xs text-gray-400 shrink-0">When</label>
          <input
            v-model="form.date"
            type="date"
            class="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:outline-none text-sm text-gray-700 dark:text-gray-300 py-1 transition-colors"
          />
        </div>

        <textarea
          v-model="form.description"
          placeholder="Tell the story... (optional)"
          rows="4"
          class="w-full bg-transparent text-gray-700 dark:text-gray-300 text-sm leading-relaxed resize-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
        />

        <!-- Feelings chips -->
        <div>
          <p class="text-xs text-gray-400 mb-2">How did it feel?</p>
          <div class="flex flex-wrap gap-2 items-center">
            <span
              v-for="word in form.feelings"
              :key="word"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
            >
              {{ word }}
              <button class="opacity-60 hover:opacity-100 transition-opacity leading-none" @click="removeFeeling(word)">×</button>
            </span>
            <input
              v-model="feelingInput"
              type="text"
              placeholder="add a feeling..."
              class="px-3 py-1 rounded-full text-xs border border-dashed border-gray-300 dark:border-gray-600 bg-transparent text-gray-500 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-400 w-28 transition-colors"
              @keydown.enter.prevent="addFeeling"
              @keydown.188.prevent="addFeeling"
            />
          </div>
        </div>

        <div class="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <UButton :disabled="!form.title.trim() || !form.date" :loading="saving" @click="save">
            {{ editingId ? 'Update' : 'Save memory' }}
          </UButton>
          <UButton variant="ghost" color="neutral" @click="cancel">Cancel</UButton>
          <UButton v-if="editingId" variant="ghost" color="error" icon="i-lucide-trash-2" class="ml-auto" @click="deleteMemory" />
        </div>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="!store.loaded" class="space-y-6 animate-pulse">
      <div v-for="i in 4" :key="i" class="space-y-2">
        <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
        <div class="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!store.memories.length && !composing" class="text-center py-24 text-gray-400">
      <UIcon name="i-lucide-camera" class="size-12 mx-auto mb-4 text-gray-200 dark:text-gray-700" />
      <p class="text-lg font-medium text-gray-600 dark:text-gray-300">A life already lived</p>
      <p class="text-sm mt-1">Start logging the moments that made you.</p>
      <UButton class="mt-6" @click="startAdd">Add your first memory</UButton>
    </div>

    <!-- Grouped by year -->
    <template v-else-if="store.loaded">
      <template v-for="[year, yearMemories] in store.byYear" :key="year">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 mt-2">{{ year }}</p>
        <div class="space-y-3 mb-10">
          <div
            v-for="m in yearMemories"
            :key="m.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 card-hover cursor-pointer"
            @click="startEdit(m)"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <h3 class="font-semibold text-gray-900 dark:text-white leading-snug">{{ m.title }}</h3>
              <span class="text-xs text-gray-400 shrink-0 mt-0.5">{{ formatMemoryDate(m.date) }}</span>
            </div>
            <p v-if="m.description" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">{{ m.description }}</p>
            <div v-if="m.feelings.length" class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="f in m.feelings"
                :key="f"
                class="text-xs text-gray-400"
              >{{ f }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMemoriesStore } from '~/stores/memories'
import type { Memory } from '~/types/me'

const store = useMemoriesStore()
onMounted(() => store.load())

const composing = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const feelingInput = ref('')

const form = reactive({
  title: '',
  date: '',
  description: '',
  feelings: [] as string[],
})

function startAdd() {
  editingId.value = null
  form.title = ''
  form.date = ''
  form.description = ''
  form.feelings = []
  composing.value = true
}

function startEdit(m: Memory) {
  editingId.value = m.id
  form.title = m.title
  form.date = m.date
  form.description = m.description ?? ''
  form.feelings = [...m.feelings]
  composing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancel() {
  composing.value = false
  editingId.value = null
}

function addFeeling() {
  const word = feelingInput.value.trim().toLowerCase()
  if (!word || form.feelings.includes(word)) { feelingInput.value = ''; return }
  form.feelings.push(word)
  feelingInput.value = ''
}

function removeFeeling(word: string) {
  form.feelings = form.feelings.filter(f => f !== word)
}

async function save() {
  if (!form.title.trim() || !form.date) return
  saving.value = true
  try {
    const data = { title: form.title.trim(), date: form.date, description: form.description.trim() || undefined, feelings: form.feelings }
    if (editingId.value) {
      await store.updateMemory(editingId.value, data)
    } else {
      await store.addMemory(data)
    }
    cancel()
  } finally {
    saving.value = false
  }
}

async function deleteMemory() {
  if (!editingId.value) return
  await store.deleteMemory(editingId.value)
  cancel()
}

function formatMemoryDate(date: string) {
  return new Date(date).toLocaleDateString('en', { day: 'numeric', month: 'long' })
}
</script>

<style scoped>
.compose-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.compose-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.compose-enter-from,
.compose-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.card-hover {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.07);
}
</style>
