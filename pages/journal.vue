<template>
  <div class="max-w-2xl mx-auto px-6 py-10">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Journal</h1>
        <p class="text-gray-500 mt-1 text-sm">
          {{ store.loaded ? `${store.entries.length} ${store.entries.length === 1 ? 'entry' : 'entries'}` : 'Your inner world, in writing' }}
        </p>
      </div>
      <UButton icon="i-lucide-pen-line" :disabled="composing && !editingId" @click="startNewEntry">
        New entry
      </UButton>
    </div>

    <!-- Journal tabs -->
    <div class="flex items-center gap-0 mb-6 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
      <!-- All -->
      <button
        class="px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px"
        :class="activeJournalId === null
          ? 'border-primary-500 text-gray-900 dark:text-white'
          : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
        @click="activeJournalId = null"
      >
        All
      </button>

      <!-- Per-journal tabs -->
      <div
        v-for="journal in store.journals"
        :key="journal.id"
        class="group relative flex items-center -mb-px"
      >
        <button
          class="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
          :class="activeJournalId === journal.id
            ? 'text-gray-900 dark:text-white'
            : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          :style="activeJournalId === journal.id ? { borderBottomColor: journalHex(journal.color) } : {}"
          @click="activeJournalId = journal.id"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: journalHex(journal.color) }" />
          {{ journal.name }}
        </button>
        <!-- Delete journal -->
        <button
          v-if="store.journals.length > 1"
          class="opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-500"
          :title="`Delete ${journal.name}`"
          @click.stop="confirmDeleteJournalId = journal.id"
        >
          <UIcon name="i-lucide-x" class="size-3" />
        </button>
      </div>

      <!-- New journal -->
      <button
        class="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap transition-colors border-b-2 border-transparent -mb-px"
        @click="showNewJournal = !showNewJournal"
      >
        <UIcon name="i-lucide-plus" class="size-3.5" /> New
      </button>
    </div>

    <!-- New journal form -->
    <Transition name="fade-down">
      <div v-if="showNewJournal" class="flex items-center gap-3 p-4 mb-6 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
        <input
          v-model="newJournalName"
          ref="newJournalInputRef"
          type="text"
          placeholder="Journal name..."
          class="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none"
          @keydown.enter="createJournal"
          @keydown.escape="showNewJournal = false"
        />
        <div class="flex gap-1.5 shrink-0">
          <button
            v-for="c in JOURNAL_COLORS"
            :key="c.value"
            class="w-5 h-5 rounded-full transition-transform focus:outline-none"
            :class="newJournalColor === c.value ? 'scale-125 ring-2 ring-offset-1 ring-gray-400 dark:ring-gray-600' : ''"
            :style="{ backgroundColor: c.hex }"
            @click="newJournalColor = c.value"
          />
        </div>
        <UButton size="xs" :disabled="!newJournalName.trim()" @click="createJournal">Create</UButton>
        <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="showNewJournal = false">
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>
    </Transition>

    <!-- Compose area -->
    <Transition name="compose">
      <div v-if="composing" class="mb-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

        <!-- Top bar: date + journal picker + close -->
        <div class="flex items-center justify-between px-6 pt-5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {{ editingId ? formatDate(editingCreatedAt) : todayLabel }}
            </span>
            <!-- Journal picker pill -->
            <div class="relative">
              <button
                class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                @click="showComposerJournalPicker = !showComposerJournalPicker"
              >
                <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: journalHex(composerJournal?.color) }" />
                {{ composerJournal?.name ?? '—' }}
                <UIcon name="i-lucide-chevron-down" class="size-3" />
              </button>
              <div v-if="showComposerJournalPicker" class="absolute top-full left-0 mt-1 z-20 min-w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 overflow-hidden">
                <button
                  v-for="j in store.journals"
                  :key="j.id"
                  class="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                  :class="form.journalId === j.id
                    ? 'text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
                  @click="form.journalId = j.id; showComposerJournalPicker = false"
                >
                  <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: journalHex(j.color) }" />
                  {{ j.name }}
                </button>
              </div>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" @click="cancel">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="px-6 pt-5 pb-6 space-y-5">
          <!-- Mood selector -->
          <div>
            <p class="text-xs text-gray-400 mb-3">
              {{ currentMoodLabel ? `Feeling ${currentMoodLabel}` : 'How are you feeling?' }}
            </p>
            <div class="flex items-center gap-3">
              <button
                v-for="score in MOOD_SCORES"
                :key="score"
                class="w-10 h-10 rounded-full transition-all duration-200 focus:outline-none"
                :class="getMoodCircleClass(score, form.mood === score)"
                :title="MOOD_CONFIG[score].label"
                @click="selectMood(score)"
              />
            </div>
          </div>

          <!-- Feeling word chips -->
          <Transition name="fade-down">
            <div v-if="form.mood" class="flex flex-wrap gap-2 items-center">
              <!-- Suggested words -->
              <button
                v-for="word in currentMoodWords"
                :key="word"
                class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
                :class="getWordClass(word, form.moodWords.includes(word), form.mood)"
                @click="toggleWord(word)"
              >
                {{ word }}
              </button>
              <!-- Custom words -->
              <span
                v-for="word in customWords"
                :key="word"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                :class="getWordClass(word, true, form.mood)"
              >
                {{ word }}
                <button class="opacity-60 hover:opacity-100 transition-opacity leading-none" @click="removeWord(word)">×</button>
              </span>
              <!-- Custom word input -->
              <input
                v-model="customWordInput"
                type="text"
                placeholder="your own..."
                class="px-3 py-1 rounded-full text-xs border border-dashed border-gray-300 dark:border-gray-600 bg-transparent text-gray-500 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 w-24 transition-colors"
                @keydown.enter.prevent="addCustomWord"
                @keydown.188.prevent="addCustomWord"
              />
            </div>
          </Transition>

          <!-- Title + body -->
          <input
            v-model="form.title"
            type="text"
            placeholder="Title (optional)"
            class="w-full bg-transparent text-gray-900 dark:text-white text-xl font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none"
          />
          <textarea
            ref="textareaRef"
            v-model="form.text"
            placeholder="What's on your mind?"
            class="w-full resize-none bg-transparent text-gray-800 dark:text-gray-200 text-base leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none min-h-45 overflow-hidden"
            @input="autoResize"
          />

          <!-- Link to goals -->
          <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div v-if="linkedGoalItems.length" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="goal in linkedGoalItems"
                :key="goal.id"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400"
              >
                <UIcon :name="goalCategoryIcon(goal.category)" class="size-3 shrink-0" />
                <span class="max-w-35 truncate">{{ goal.title }}</span>
                <button class="text-gray-400 hover:text-red-400 transition-colors ml-0.5" @click="unlinkGoal(goal.id)">×</button>
              </span>
            </div>
            <div class="relative">
              <UInput
                v-model="goalSearch"
                size="sm"
                placeholder="Link to a dream..."
                icon="i-lucide-link"
                class="w-full"
                @focus="showGoalDropdown = true"
                @blur="hideGoalDropdown"
              />
              <div v-if="showGoalDropdown && goalSuggestions.length" class="absolute z-20 w-full bottom-full mb-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                <button
                  v-for="s in goalSuggestions"
                  :key="s.id"
                  class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 truncate transition-colors"
                  @mousedown.prevent="linkGoal(s.id)"
                >
                  {{ s.title }}
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <UButton :loading="saving" :disabled="!form.text.trim()" @click="save">
              {{ editingId ? 'Update' : 'Save entry' }}
            </UButton>
            <UButton variant="ghost" color="neutral" @click="cancel">Cancel</UButton>
            <UButton v-if="editingId" variant="ghost" color="error" icon="i-lucide-trash-2" class="ml-auto" @click="deleteCurrentEntry" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Skeleton -->
    <div v-if="!store.loaded" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-28" />
          <div class="flex gap-1.5">
            <div v-for="j in 3" :key="j" class="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-14" />
          </div>
        </div>
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!filteredEntries.length && !composing" class="text-center py-24">
      <UIcon name="i-lucide-book-open" class="size-12 mx-auto mb-4 text-gray-200 dark:text-gray-700" />
      <p class="text-lg font-medium text-gray-600 dark:text-gray-300">
        {{ activeJournalId ? `${activeJournalName} is empty` : 'Your inner world, in writing' }}
      </p>
      <p class="text-sm text-gray-400 mt-1">Start with how you're feeling today.</p>
      <UButton class="mt-6" @click="startNewEntry">Write your first entry</UButton>
    </div>

    <!-- Mood chart -->
    <div v-if="store.loaded && filteredEntries.filter(e => e.mood).length >= 2" class="mb-10 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 pt-4 pb-3">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Your emotional journey</p>
      <MoodChart :entries="filteredEntries" />
    </div>

    <!-- Entry list -->
    <div v-if="store.loaded && filteredEntries.length">
      <template v-for="[month, monthEntries] in groupedEntries" :key="month">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 mt-2">{{ month }}</p>
        <div class="space-y-3 mb-10">
          <div
            v-for="entry in monthEntries"
            v-show="editingId !== entry.id"
            :key="entry.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 border-l-4 transition-all duration-200 card-hover"
            :class="[
              expandedId === entry.id ? 'shadow-md' : '',
            ]"
            :style="{ borderLeftColor: getMoodHexColor(entry.mood) }"
          >
            <!-- Collapsed / always-visible header row -->
            <div
              class="p-5 cursor-pointer select-none"
              @click="expandedId = expandedId === entry.id ? null : entry.id"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-400">{{ formatDate(entry.createdAt) }}</span>
                <div class="flex items-center gap-3">
                  <span v-if="activeJournalId === null && entryJournal(entry)" class="flex items-center gap-1 text-xs text-gray-400">
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: journalHex(entryJournal(entry)?.color) }" />
                    {{ entryJournal(entry)?.name }}
                  </span>
                  <div v-if="entry.mood" class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: getMoodHexColor(entry.mood) }" />
                    <span class="text-xs text-gray-400">{{ MOOD_CONFIG[entry.mood].label }}</span>
                  </div>
                  <UIcon
                    :name="expandedId === entry.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    class="size-3.5 text-gray-300 dark:text-gray-600 transition-transform duration-200"
                  />
                </div>
              </div>
              <p v-if="entry.title" class="font-semibold text-gray-900 dark:text-white mb-1">{{ entry.title }}</p>
              <p
                class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
                :class="expandedId !== entry.id ? 'line-clamp-3' : ''"
              >{{ entry.text }}</p>
              <!-- Mood words + linked dreams — always visible -->
              <div v-if="entry.moodWords.length || entry.linkedGoalIds.length" class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800/80">
                <span v-for="word in entry.moodWords" :key="word" class="text-xs text-gray-400">{{ word }}</span>
                <span v-if="entry.moodWords.length && entry.linkedGoalIds.length" class="text-gray-300 dark:text-gray-700 text-xs">·</span>
                <span v-if="entry.linkedGoalIds.length" class="flex items-center gap-1 text-xs text-gray-400">
                  <UIcon name="i-lucide-link" class="size-3" />
                  {{ entry.linkedGoalIds.length }} {{ entry.linkedGoalIds.length === 1 ? 'dream' : 'dreams' }}
                </span>
              </div>
            </div>

            <!-- Expanded footer: Edit button only -->
            <Transition name="expand">
              <div
                v-if="expandedId === entry.id"
                class="px-5 pb-5 border-t border-gray-50 dark:border-gray-800/80 pt-3"
              >
                <UButton size="xs" variant="soft" color="neutral" icon="i-lucide-pencil" @click.stop="openEntry(entry)">
                  Edit
                </UButton>
              </div>
            </Transition>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete journal confirm modal -->
    <UModal :open="!!confirmDeleteJournalId" @update:open="v => { if (!v) confirmDeleteJournalId = null }">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete this journal?</h3>
          <p class="text-gray-500 mb-1">
            "{{ store.journals.find(j => j.id === confirmDeleteJournalId)?.name }}" will be removed.
          </p>
          <p class="text-sm text-gray-400 mb-6">Entries will still be visible in All.</p>
          <div class="flex gap-3">
            <UButton color="error" @click="doDeleteJournal">Delete</UButton>
            <UButton variant="ghost" color="neutral" @click="confirmDeleteJournalId = null">Cancel</UButton>
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useJournalStore } from '~/stores/journal'
import { useBucketListStore } from '~/stores/bucketList'
import { MOOD_CONFIG, JOURNAL_COLORS } from '~/types/journal'
import type { MoodScore, PersonalEntry } from '~/types/journal'
import type { BucketItem, ItemCategory } from '~/types/bucket'
import { CATEGORIES } from '~/types/bucket'

const store = useJournalStore()
const bucketStore = useBucketListStore()
const textareaRef = ref<HTMLTextAreaElement>()

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
const newJournalInputRef = ref<HTMLInputElement>()

onMounted(async () => {
  await Promise.all([store.load(), store.loadJournals(), bucketStore.load()])
})

const MOOD_SCORES: MoodScore[] = [1, 2, 3, 4, 5]

// Active journal
const activeJournalId = ref<string | null>(null)

const activeJournalName = computed(() =>
  store.journals.find(j => j.id === activeJournalId.value)?.name ?? ''
)

// Filtered entries for the active tab
const filteredEntries = computed(() => {
  if (activeJournalId.value === null) return store.entries
  const defaultId = store.defaultJournalId
  return store.entries.filter(e => (e.journalId ?? defaultId) === activeJournalId.value)
})

const groupedEntries = computed(() => {
  const map = new Map<string, PersonalEntry[]>()
  for (const entry of filteredEntries.value) {
    const key = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }
  return Array.from(map.entries())
})

function entryJournal(entry: PersonalEntry) {
  const id = entry.journalId ?? store.defaultJournalId
  return store.journals.find(j => j.id === id)
}

// New journal form
const showNewJournal = ref(false)
const newJournalName = ref('')
const newJournalColor = ref('violet')

async function createJournal() {
  if (!newJournalName.value.trim()) return
  const j = await store.addJournal(newJournalName.value.trim(), newJournalColor.value)
  newJournalName.value = ''
  newJournalColor.value = 'violet'
  showNewJournal.value = false
  activeJournalId.value = j.id
}

// Delete journal
const confirmDeleteJournalId = ref<string | null>(null)

async function doDeleteJournal() {
  if (!confirmDeleteJournalId.value) return
  await store.deleteJournal(confirmDeleteJournalId.value)
  if (activeJournalId.value === confirmDeleteJournalId.value) activeJournalId.value = null
  confirmDeleteJournalId.value = null
}

// Compose state
const composing = ref(false)
const editingId = ref<string | null>(null)
const expandedId = ref<string | null>(null)
const editingCreatedAt = ref('')
const saving = ref(false)
const showComposerJournalPicker = ref(false)

const form = reactive({
  title: '',
  text: '',
  mood: undefined as MoodScore | undefined,
  moodWords: [] as string[],
  linkedGoalIds: [] as string[],
  journalId: '',
})

const composerJournal = computed(() =>
  store.journals.find(j => j.id === form.journalId) ?? store.journals[0]
)

const currentMoodWords = computed(() => form.mood ? MOOD_CONFIG[form.mood].words : [])
const currentMoodLabel = computed(() => form.mood ? MOOD_CONFIG[form.mood].label.toLowerCase() : '')

const todayLabel = computed(() =>
  'Today, ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
)

// Goal linking
const goalSearch = ref('')
const showGoalDropdown = ref(false)

const linkedGoalItems = computed(() =>
  form.linkedGoalIds
    .map(id => bucketStore.getById(id))
    .filter((i): i is BucketItem => !!i)
)

const goalSuggestions = computed(() => {
  const q = goalSearch.value.trim().toLowerCase()
  return bucketStore.items
    .filter(i => !form.linkedGoalIds.includes(i.id) && (!q || i.title.toLowerCase().includes(q)))
    .slice(0, 5)
})

function hideGoalDropdown() {
  setTimeout(() => { showGoalDropdown.value = false }, 150)
}

function linkGoal(id: string) {
  form.linkedGoalIds.push(id)
  goalSearch.value = ''
  showGoalDropdown.value = false
}

function unlinkGoal(id: string) {
  form.linkedGoalIds = form.linkedGoalIds.filter(gid => gid !== id)
}

function goalCategoryIcon(cat: ItemCategory): string {
  return CATEGORIES.find(c => c.value === cat)?.icon ?? 'i-lucide-tag'
}

// Compose actions
function startNewEntry() {
  form.title = ''
  form.text = ''
  form.mood = undefined
  form.moodWords = []
  form.linkedGoalIds = []
  form.journalId = activeJournalId.value ?? store.defaultJournalId
  editingId.value = null
  editingCreatedAt.value = ''
  composing.value = true
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    textareaRef.value?.focus()
    autoResize()
  })
}

function openEntry(entry: PersonalEntry) {
  form.title = entry.title ?? ''
  form.text = entry.text
  form.mood = entry.mood
  form.moodWords = [...entry.moodWords]
  form.linkedGoalIds = [...entry.linkedGoalIds]
  form.journalId = entry.journalId ?? store.defaultJournalId
  editingId.value = entry.id
  editingCreatedAt.value = entry.createdAt
  expandedId.value = null
  composing.value = true
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    textareaRef.value?.focus()
    autoResize()
  })
}

function cancel() {
  composing.value = false
  showComposerJournalPicker.value = false
  editingId.value = null
  form.title = ''
  form.text = ''
  form.mood = undefined
  form.moodWords = []
  form.linkedGoalIds = []
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = ''
  })
}

async function save() {
  if (!form.text.trim() || saving.value) return
  saving.value = true
  try {
    const payload = {
      journalId: form.journalId || store.defaultJournalId,
      title: form.title.trim() || undefined,
      text: form.text.trim(),
      mood: form.mood,
      moodWords: form.moodWords,
      linkedGoalIds: form.linkedGoalIds,
    }
    if (editingId.value) {
      await store.updateEntry(editingId.value, payload)
    } else {
      await store.addEntry(payload)
    }
    cancel()
  } finally {
    saving.value = false
  }
}

async function deleteCurrentEntry() {
  if (!editingId.value) return
  await store.deleteEntry(editingId.value)
  cancel()
}

function selectMood(score: MoodScore) {
  if (form.mood === score) {
    form.mood = undefined
    form.moodWords = []
  } else {
    form.mood = score
    form.moodWords = []
  }
}

const customWordInput = ref('')

const customWords = computed(() =>
  form.moodWords.filter(w => !currentMoodWords.value.includes(w))
)

function toggleWord(word: string) {
  const idx = form.moodWords.indexOf(word)
  if (idx !== -1) {
    form.moodWords.splice(idx, 1)
  } else {
    form.moodWords.push(word)
  }
}

function removeWord(word: string) {
  const idx = form.moodWords.indexOf(word)
  if (idx !== -1) form.moodWords.splice(idx, 1)
}

function addCustomWord() {
  const word = customWordInput.value.trim().toLowerCase().replace(/[^a-z\s-]/g, '')
  if (!word || form.moodWords.includes(word)) {
    customWordInput.value = ''
    return
  }
  form.moodWords.push(word)
  customWordInput.value = ''
}

// Helpers
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

function journalHex(color?: string): string {
  return JOURNAL_COLORS.find(c => c.value === color)?.hex ?? '#a78bfa'
}

function getMoodCircleClass(score: MoodScore, selected: boolean): string {
  if (selected) {
    switch (score) {
      case 1: return 'bg-red-400 ring-4 ring-red-100 dark:ring-red-950/50 scale-110'
      case 2: return 'bg-orange-400 ring-4 ring-orange-100 dark:ring-orange-950/50 scale-110'
      case 3: return 'bg-yellow-400 ring-4 ring-yellow-100 dark:ring-yellow-950/50 scale-110'
      case 4: return 'bg-green-400 ring-4 ring-green-100 dark:ring-green-950/50 scale-110'
      case 5: return 'bg-sky-400 ring-4 ring-sky-100 dark:ring-sky-950/50 scale-110'
    }
  }
  switch (score) {
    case 1: return 'bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/50'
    case 2: return 'bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/50'
    case 3: return 'bg-yellow-100 dark:bg-yellow-950/40 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
    case 4: return 'bg-green-100 dark:bg-green-950/40 hover:bg-green-200 dark:hover:bg-green-900/50'
    case 5: return 'bg-sky-100 dark:bg-sky-950/40 hover:bg-sky-200 dark:hover:bg-sky-900/50'
  }
}

function getWordClass(word: string, selected: boolean, mood: MoodScore): string {
  if (!selected) return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
  switch (mood) {
    case 1: return 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900'
    case 2: return 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-900'
    case 3: return 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-200 dark:ring-yellow-900'
    case 4: return 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-900'
    case 5: return 'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 ring-1 ring-sky-200 dark:ring-sky-900'
  }
}

function getMoodHexColor(mood?: MoodScore): string {
  switch (mood) {
    case 1: return '#f87171'
    case 2: return '#fb923c'
    case 3: return '#facc15'
    case 4: return '#4ade80'
    case 5: return '#38bdf8'
    default: return '#e5e7eb'
  }
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

.fade-down-enter-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-down-leave-active {
  transition: opacity 0.15s ease;
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-down-leave-to {
  opacity: 0;
}

.expand-enter-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.expand-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.expand-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.card-hover {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.07);
}
</style>
