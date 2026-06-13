<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <NuxtLink to="/list" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to list
    </NuxtLink>

    <!-- Loading skeleton -->
    <div v-if="!store.loaded && !item" class="space-y-6 animate-pulse">
      <div class="flex justify-between gap-4">
        <div class="h-8 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
        <div class="h-6 bg-gray-100 dark:bg-gray-800 rounded w-20 shrink-0" />
      </div>
      <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
      <div class="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      <div class="space-y-2">
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6" />
      </div>
    </div>

    <div v-else-if="!item" class="text-gray-400">Item not found.</div>

    <template v-else>
      <!-- Header image -->
      <div v-if="item.imageUrl" class="mb-8 -mx-6 sm:mx-0">
        <img :src="item.imageUrl" :alt="item.title" class="w-full h-56 object-cover sm:rounded-xl">
      </div>

      <!-- Title + status -->
      <div class="flex items-start justify-between gap-4 mb-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{{ item.title }}</h1>
        <UBadge
          :label="STATUS_CONFIG[item.status].label"
          :color="STATUS_CONFIG[item.status].color"
          variant="soft"
          size="lg"
          class="shrink-0 mt-1"
        />
      </div>

      <!-- Meta -->
      <div class="flex flex-wrap gap-3 text-sm text-gray-500 mb-8">
        <span :class="catColor" class="flex items-center gap-1 font-medium">
          <UIcon :name="catIcon" class="size-4" />{{ catLabel }}
        </span>
        <span>·</span>
        <span>{{ PRIORITY_CONFIG[item.priority].label }}</span>
        <span v-if="item.location" class="flex items-center gap-1">
          <UIcon name="i-lucide-map-pin" class="size-3.5" />{{ item.location }}
        </span>
        <span class="ml-auto text-xs text-gray-400">Added {{ formatDate(item.createdAt) }}</span>
      </div>

      <!-- Why -->
      <div class="pl-5 mb-6 border-l-4 border-primary-400">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Why this matters</p>
        <p class="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed">"{{ item.why }}"</p>
      </div>

      <!-- Description -->
      <div v-if="item.description" class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Details</p>
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ item.description }}</p>
      </div>

      <!-- Status changer -->
      <div class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Where you are</p>
        <div class="flex gap-2 flex-wrap">
          <UButton
            v-for="s in statusOptions"
            :key="s.value"
            size="sm"
            :variant="item.status === s.value ? 'solid' : 'outline'"
            :color="item.status === s.value ? s.color : 'neutral'"
            :loading="settingStatus === s.value"
            @click="setStatus(s.value)"
          >
            <UIcon v-if="s.value === 'done'" name="i-lucide-check" class="mr-1" />
            <UIcon v-else-if="s.value === 'in-progress'" name="i-lucide-zap" class="mr-1" />
            {{ s.label }}
          </UButton>
        </div>
      </div>

      <!-- Reflection — shown when done -->
      <div v-if="item.status === 'done'" class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Reflection — what did this teach you?
        </p>
        <div v-if="!editingReflection && item.reflection" class="bg-amber-50 rounded-xl p-5 relative">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ item.reflection }}</p>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            class="absolute top-3 right-3"
            icon="i-lucide-pencil"
            @click="startReflection"
          />
        </div>
        <div v-else-if="!item.reflection && !editingReflection" class="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <UIcon name="i-lucide-pen-line" class="size-8 mx-auto text-gray-300 mb-3" />
          <p class="text-gray-500 text-sm mb-4">You marked this done! Take a moment to reflect.</p>
          <UButton variant="outline" @click="startReflection">Write reflection</UButton>
        </div>
        <div v-if="editingReflection" class="space-y-3">
          <UTextarea
            v-model="reflectionText"
            placeholder="What did completing this mean to you? What did you learn? How did it change you?"
            :rows="5"
            class="w-full"
            autofocus
          />
          <div class="flex gap-2">
            <UButton @click="saveReflection">Save</UButton>
            <UButton variant="ghost" color="neutral" @click="editingReflection = false">Cancel</UButton>
          </div>
        </div>
      </div>

      <!-- Completion date -->
      <div v-if="item.completedAt" class="text-sm text-gray-400 mb-8 flex items-center gap-1">
        <UIcon name="i-lucide-check-circle" class="size-4 text-green-500" />
        Completed on {{ formatDate(item.completedAt) }}
      </div>

      <!-- Notes -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Notes</p>
          <UButton v-if="notes.length > 0 && !addingNote" size="xs" variant="ghost" color="neutral" icon="i-lucide-plus" @click="startAddNote">
            Add note
          </UButton>
        </div>

        <div class="space-y-3">
          <div v-for="note in notes" :key="note.id">
            <!-- View mode -->
            <div v-if="editingNoteId !== note.id" class="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 py-1">
              <p class="text-xs text-gray-400 mb-1">{{ formatDateTime(note.updatedAt) }}</p>
              <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{{ note.text }}</p>
              <div class="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-pencil" @click="startEditNote(note)" />
                <UButton size="xs" variant="ghost" color="error" icon="i-lucide-trash-2" @click="removeNote(note.id)" />
              </div>
            </div>
            <!-- Edit mode -->
            <div v-else class="space-y-2">
              <UTextarea v-model="editingNoteText" :rows="3" autofocus class="w-full" />
              <div class="flex gap-2">
                <UButton size="sm" @click="saveEditNote(note.id)">Save</UButton>
                <UButton size="sm" variant="ghost" color="neutral" @click="editingNoteId = null">Cancel</UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Add note form -->
        <div v-if="addingNote" class="mt-3 space-y-2">
          <UTextarea v-model="newNoteText" :rows="3" placeholder="Write a note..." autofocus class="w-full" />
          <div class="flex gap-2">
            <UButton size="sm" :disabled="!newNoteText.trim()" @click="saveNewNote">Add</UButton>
            <UButton size="sm" variant="ghost" color="neutral" @click="addingNote = false; newNoteText = ''">Cancel</UButton>
          </div>
        </div>

        <!-- Empty state -->
        <button
          v-else-if="notes.length === 0"
          class="w-full mt-1 py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-500 transition-colors"
          @click="startAddNote"
        >
          + Add a note
        </button>
      </div>

      <!-- Privacy -->
      <div class="flex items-center gap-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <UIcon :name="item.isPrivate ? 'i-lucide-lock' : 'i-lucide-globe'" class="size-4 text-gray-400 shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.isPrivate ? 'Private goal' : 'Public goal' }}</p>
          <p class="text-xs text-gray-400">{{ item.isPrivate ? 'Only visible to you' : 'Title can inspire others in discover' }}</p>
        </div>
        <UToggle :model-value="!item.isPrivate" @update:model-value="togglePrivacy" />
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <UButton variant="outline" color="neutral" icon="i-lucide-pencil" :to="`/edit/${item.id}`">Edit</UButton>
        <UButton variant="ghost" color="error" icon="i-lucide-trash-2" class="ml-auto" @click="confirmDelete = true">Delete</UButton>
      </div>
    </template>

    <!-- Celebration modal -->
    <CelebrationModal
      :show="showCelebration"
      :item="item ?? undefined"
      @close="showCelebration = false"
      @reflect="onCelebrationReflect"
    />

    <!-- Delete confirm modal -->
    <UModal v-model:open="confirmDelete">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete this item?</h3>
          <p class="text-gray-500 mb-6">This cannot be undone.</p>
          <div class="flex gap-3">
            <UButton color="error" @click="doDelete">Yes, delete</UButton>
            <UButton variant="ghost" color="neutral" @click="confirmDelete = false">Cancel</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '~/types/bucket'
import type { ItemStatus, Note } from '~/types/bucket'

const route = useRoute()
const router = useRouter()
const store = useBucketListStore()
const toast = useToast()
const { fire: fireConfetti } = useConfetti()

onMounted(() => store.load())

const id = route.params.id as string
const item = computed(() => store.getById(id))

const confirmDelete = ref(false)
const editingReflection = ref(false)
const reflectionText = ref('')
const showCelebration = ref(false)
const settingStatus = ref<ItemStatus | null>(null)

const statusOptions = (Object.keys(STATUS_CONFIG) as ItemStatus[]).map(k => ({
  value: k,
  label: STATUS_CONFIG[k].label,
  color: STATUS_CONFIG[k].color,
}))

const catIcon = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.icon ?? 'i-lucide-tag')
const catLabel = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.label ?? '')
const catColor = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.color ?? 'text-gray-500')

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function noteId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const notes = computed(() => item.value?.notes ?? [])

const addingNote = ref(false)
const newNoteText = ref('')
const editingNoteId = ref<string | null>(null)
const editingNoteText = ref('')

function startAddNote() {
  editingNoteId.value = null
  newNoteText.value = ''
  addingNote.value = true
}

async function saveNewNote() {
  if (!newNoteText.value.trim()) return
  const now = new Date().toISOString()
  const note: Note = { id: noteId(), text: newNoteText.value.trim(), createdAt: now, updatedAt: now }
  await store.updateItem(id, { notes: [...notes.value, note] })
  newNoteText.value = ''
  addingNote.value = false
}

function startEditNote(note: Note) {
  addingNote.value = false
  editingNoteText.value = note.text
  editingNoteId.value = note.id
}

async function saveEditNote(noteId: string) {
  if (!editingNoteText.value.trim()) return
  const updated = notes.value.map(n =>
    n.id === noteId ? { ...n, text: editingNoteText.value.trim(), updatedAt: new Date().toISOString() } : n
  )
  await store.updateItem(id, { notes: updated })
  editingNoteId.value = null
}

async function removeNote(noteId: string) {
  await store.updateItem(id, { notes: notes.value.filter(n => n.id !== noteId) })
}

async function setStatus(status: ItemStatus) {
  if (status === item.value?.status) return
  settingStatus.value = status
  try {
    await store.updateItem(id, { status })
    if (status === 'done') {
      await fireConfetti()
      showCelebration.value = true
    } else if (status === 'in-progress') {
      toast.add({
        title: 'Goal activated!',
        description: 'Time to make it happen.',
        icon: 'i-lucide-zap',
        color: 'info',
        duration: 3000,
      })
    }
  } finally {
    settingStatus.value = null
  }
}

function startReflection() {
  reflectionText.value = item.value?.reflection ?? ''
  editingReflection.value = true
}

function onCelebrationReflect() {
  showCelebration.value = false
  startReflection()
}

async function saveReflection() {
  await store.updateItem(id, { reflection: reflectionText.value.trim() })
  editingReflection.value = false
}

async function togglePrivacy() {
  await store.updateItem(id, { isPrivate: !item.value?.isPrivate })
}

async function doDelete() {
  await store.deleteItem(id)
  router.push('/list')
}
</script>
