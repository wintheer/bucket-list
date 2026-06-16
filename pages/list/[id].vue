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
        <UBadge :label="STATUS_CONFIG[item.status].label" :color="STATUS_CONFIG[item.status].color" variant="soft" size="lg" class="shrink-0 mt-1" />
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
        <span v-if="item.status === 'idea' && daysSince(item.createdAt) > 90" class="flex items-center gap-1 text-amber-500 text-xs font-semibold ml-1">
          <UIcon name="i-lucide-clock" class="size-3.5" />Waiting {{ daysSince(item.createdAt) }} days
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
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ item.description }}</p>
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

      <!-- Milestones -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Milestones</p>
          <span v-if="milestones.length" class="text-xs text-gray-400">{{ completedMilestones }}/{{ milestones.length }}</span>
        </div>

        <!-- Progress bar -->
        <div v-if="milestones.length" class="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-5">
          <div
            class="h-full rounded-full bg-linear-to-r from-sky-300 via-violet-400 to-amber-400 transition-all duration-500"
            :style="{ width: `${milestonePercent}%` }"
          />
        </div>

        <!-- Checklist -->
        <ul class="space-y-1 mb-3">
          <li
            v-for="m in milestones"
            :key="m.id"
            class="group flex items-center gap-3 py-1.5 rounded-lg"
          >
            <button
              class="shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150"
              :class="m.completed
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'"
              @click="toggleMilestone(m.id)"
            >
              <UIcon v-if="m.completed" name="i-lucide-check" class="size-3 text-white" />
            </button>
            <span
              class="flex-1 text-sm transition-colors duration-150"
              :class="m.completed ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'"
            >{{ m.text }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none"
              @click="removeMilestone(m.id)"
            >×</button>
          </li>
        </ul>

        <!-- Add milestone input -->
        <div class="flex items-center gap-2">
          <input
            v-model="newMilestoneText"
            type="text"
            placeholder="Add a step..."
            class="flex-1 text-sm bg-transparent border-b border-dashed border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1 text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
            @keydown.enter.prevent="addMilestone"
          />
          <UButton v-if="newMilestoneText.trim()" size="xs" variant="soft" @click="addMilestone">Add</UButton>
        </div>
      </div>

      <!-- Journey (progress journal) -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Journey</p>
          <UButton v-if="journal.length && !addingJournalEntry" size="xs" variant="ghost" color="neutral" icon="i-lucide-plus" @click="startJournalEntry">
            Add entry
          </UButton>
        </div>

        <!-- Timeline -->
        <div v-if="journal.length" class="relative mb-4">
          <div class="absolute left-2.25 top-3 bottom-3 w-px bg-gray-200 dark:bg-gray-700" />
          <div class="space-y-6">
            <div v-for="entry in [...journal].reverse()" :key="entry.id" class="relative pl-8 group">
              <div class="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div class="w-2 h-2 rounded-full bg-primary-400" />
              </div>
              <p class="text-xs text-gray-400 mb-1">{{ formatDateTime(entry.createdAt) }}</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ entry.text }}</p>
              <button class="text-xs text-gray-300 dark:text-gray-700 hover:text-red-400 dark:hover:text-red-500 mt-1 opacity-0 group-hover:opacity-100 transition-all" @click="removeJournalEntry(entry.id)">
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Add entry form -->
        <div v-if="addingJournalEntry" class="mt-3 space-y-2">
          <UTextarea v-model="newJournalText" :rows="2" placeholder="What happened? A milestone, a setback, a breakthrough..." autofocus class="w-full" />
          <div class="flex gap-2">
            <UButton size="sm" :disabled="!newJournalText.trim()" @click="saveJournalEntry">Add</UButton>
            <UButton size="sm" variant="ghost" color="neutral" @click="addingJournalEntry = false; newJournalText = ''">Cancel</UButton>
          </div>
        </div>

        <button
          v-else-if="!journal.length"
          class="w-full py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-500 transition-colors"
          @click="startJournalEntry"
        >
          + Log your first step
        </button>
      </div>

      <!-- Chapter close — shown when done -->
      <div v-if="item.status === 'done' && (item.completedWith || item.completedFeeling)" class="mb-8 p-5 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50">
        <p class="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3">This chapter</p>
        <div v-if="item.completedWith" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <UIcon name="i-lucide-users" class="size-4 text-green-400 shrink-0" />
          {{ item.completedWith }}
        </div>
        <div v-if="item.completedFeeling" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 italic mt-2">
          <UIcon name="i-lucide-quote" class="size-4 text-green-400 shrink-0 mt-0.5" />
          "{{ item.completedFeeling }}"
        </div>
      </div>

      <!-- Reflection — shown when done -->
      <div v-if="item.status === 'done'" class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Reflection — what did this teach you?
        </p>
        <div v-if="!editingReflection && item.reflection" class="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 relative">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ item.reflection }}</p>
          <UButton size="xs" variant="ghost" color="neutral" class="absolute top-3 right-3" icon="i-lucide-pencil" @click="startReflection" />
        </div>
        <div v-else-if="!item.reflection && !editingReflection" class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <UIcon name="i-lucide-pen-line" class="size-8 mx-auto text-gray-300 mb-3" />
          <p class="text-gray-500 text-sm mb-4">Take a moment to capture what you learned.</p>
          <UButton variant="outline" @click="startReflection">Write reflection</UButton>
        </div>
        <div v-if="editingReflection" class="space-y-3">
          <UTextarea v-model="reflectionText" placeholder="What did completing this mean to you? What did you learn? How did it change you?" :rows="5" class="w-full" autofocus />
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
            <div v-if="editingNoteId !== note.id" class="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 py-1">
              <p class="text-xs text-gray-400 mb-1">{{ formatDateTime(note.updatedAt) }}</p>
              <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{{ note.text }}</p>
              <div class="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-pencil" @click="startEditNote(note)" />
                <UButton size="xs" variant="ghost" color="error" icon="i-lucide-trash-2" @click="removeNote(note.id)" />
              </div>
            </div>
            <div v-else class="space-y-2">
              <UTextarea v-model="editingNoteText" :rows="3" autofocus class="w-full" />
              <div class="flex gap-2">
                <UButton size="sm" @click="saveEditNote(note.id)">Save</UButton>
                <UButton size="sm" variant="ghost" color="neutral" @click="editingNoteId = null">Cancel</UButton>
              </div>
            </div>
          </div>
        </div>
        <div v-if="addingNote" class="mt-3 space-y-2">
          <UTextarea v-model="newNoteText" :rows="3" placeholder="Write a note..." autofocus class="w-full" />
          <div class="flex gap-2">
            <UButton size="sm" :disabled="!newNoteText.trim()" @click="saveNewNote">Add</UButton>
            <UButton size="sm" variant="ghost" color="neutral" @click="addingNote = false; newNoteText = ''">Cancel</UButton>
          </div>
        </div>
        <button
          v-else-if="notes.length === 0"
          class="w-full mt-1 py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-500 transition-colors"
          @click="startAddNote"
        >
          + Add a note
        </button>
      </div>

      <!-- Linked journal entries -->
      <div v-if="linkedJournalEntries.length" class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Journal</p>
        <!-- Journal name badges -->
        <div v-if="linkedJournals.length" class="flex flex-wrap gap-2 mb-4">
          <NuxtLink
            v-for="j in linkedJournals"
            :key="j.id"
            to="/journal"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            :style="{ borderColor: journalHex(j.color), color: journalHex(j.color) }"
          >
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: journalHex(j.color) }" />
            {{ j.name }}
          </NuxtLink>
        </div>
        <!-- Entry previews -->
        <div class="space-y-3">
          <div
            v-for="entry in linkedJournalEntries"
            :key="entry.id"
            class="pl-4 border-l-2 py-1"
            :style="{ borderLeftColor: journalHex(journalStore.journals.find(j => j.id === entry.journalId)?.color) }"
          >
            <p class="text-xs text-gray-400 mb-1">{{ formatDate(entry.createdAt) }}</p>
            <p v-if="entry.title" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">{{ entry.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 whitespace-pre-wrap">{{ entry.text }}</p>
            <div v-if="entry.moodWords.length" class="flex flex-wrap gap-2 mt-1.5">
              <span v-for="word in entry.moodWords" :key="word" class="text-xs text-gray-400">{{ word }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related dreams -->
      <div class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Related dreams</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <NuxtLink
            v-for="linked in linkedItems"
            :key="linked.id"
            :to="`/list/${linked.id}`"
            class="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
          >
            <UIcon :name="CATEGORIES.find(c => c.value === linked.category)?.icon ?? 'i-lucide-tag'" class="size-3.5 shrink-0" :class="CATEGORIES.find(c => c.value === linked.category)?.color" />
            {{ linked.title }}
            <button class="text-gray-300 hover:text-red-400 transition-colors ml-1" @click.prevent="unlinkDream(linked.id)">×</button>
          </NuxtLink>
        </div>
        <div class="relative">
          <UInput
            v-model="linkSearch"
            placeholder="Search your dreams to link..."
            icon="i-lucide-link"
            size="sm"
            class="w-full"
            @focus="showLinkDropdown = true"
            @blur="hideLinkDropdown"
          />
          <div v-if="showLinkDropdown && linkSuggestions.length" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <button
              v-for="s in linkSuggestions"
              :key="s.id"
              class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 truncate transition-colors"
              @mousedown.prevent="linkDream(s.id)"
            >
              {{ s.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy -->
      <div class="flex items-center gap-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <UIcon :name="item.isPrivate ? 'i-lucide-lock' : 'i-lucide-globe'" class="size-4 text-gray-400 shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.isPrivate ? 'Private dream' : 'Public dream' }}</p>
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
      @save="onCelebrationSave"
    />

    <!-- Delete confirm modal -->
    <UModal v-model:open="confirmDelete">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete this dream?</h3>
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
import { useJournalStore } from '~/stores/journal'
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '~/types/bucket'
import { JOURNAL_COLORS } from '~/types/journal'
import type { ItemStatus, Note, JournalEntry, BucketItem } from '~/types/bucket'

const route = useRoute()
const router = useRouter()
const store = useBucketListStore()
const journalStore = useJournalStore()
const toast = useToast()
const { fire: fireConfetti } = useConfetti()

onMounted(() => { store.load(); journalStore.load(); journalStore.loadJournals() })

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

// ── Milestones ───────────────────────────────────────────────────────────────

import type { Milestone } from '~/types/bucket'

const newMilestoneText = ref('')

const milestones = computed<Milestone[]>(() => item.value?.milestones ?? [])
const completedMilestones = computed(() => milestones.value.filter(m => m.completed).length)
const milestonePercent = computed(() =>
  milestones.value.length ? Math.round((completedMilestones.value / milestones.value.length) * 100) : 0
)

async function addMilestone() {
  const text = newMilestoneText.value.trim()
  if (!text) return
  const mid = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const updated = [...milestones.value, { id: mid, text, completed: false }]
  newMilestoneText.value = ''
  await store.updateItem(id, { milestones: updated })
}

async function toggleMilestone(milestoneId: string) {
  const updated = milestones.value.map(m =>
    m.id === milestoneId ? { ...m, completed: !m.completed } : m
  )
  await store.updateItem(id, { milestones: updated })
}

async function removeMilestone(milestoneId: string) {
  const updated = milestones.value.filter(m => m.id !== milestoneId)
  await store.updateItem(id, { milestones: updated })
}

// ── Linked journal entries ───────────────────────────────────────────────────

const linkedJournalEntries = computed(() =>
  journalStore.entries.filter(e => e.linkedGoalIds.includes(id))
)

const linkedJournals = computed(() => {
  const seen = new Set<string>()
  const result: { id: string; name: string; color: string }[] = []
  for (const entry of linkedJournalEntries.value) {
    const j = entry.journalId ? journalStore.journals.find(j => j.id === entry.journalId) : null
    if (j && !seen.has(j.id)) {
      seen.add(j.id)
      result.push(j)
    }
  }
  return result
})

function journalHex(color?: string) {
  return JOURNAL_COLORS.find(c => c.value === color)?.hex ?? '#a78bfa'
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Status ──────────────────────────────────────────────────────────────────

async function setStatus(status: ItemStatus) {
  if (status === item.value?.status) return
  settingStatus.value = status
  try {
    await store.updateItem(id, { status })
    if (status === 'done') {
      await fireConfetti()
      showCelebration.value = true
    } else if (status === 'in-progress') {
      toast.add({ title: 'Dream activated!', description: 'Time to make it happen.', icon: 'i-lucide-zap', color: 'info', duration: 3000 })
    }
  } finally {
    settingStatus.value = null
  }
}

// ── Celebration / chapter close ──────────────────────────────────────────────

function onCelebrationReflect() {
  showCelebration.value = false
  startReflection()
}

async function onCelebrationSave(data: { completedWith: string; completedFeeling: string }) {
  await store.updateItem(id, {
    completedWith: data.completedWith || undefined,
    completedFeeling: data.completedFeeling || undefined,
  })
}

// ── Reflection ───────────────────────────────────────────────────────────────

function startReflection() {
  reflectionText.value = item.value?.reflection ?? ''
  editingReflection.value = true
}

async function saveReflection() {
  await store.updateItem(id, { reflection: reflectionText.value.trim() })
  editingReflection.value = false
}

// ── Journal ──────────────────────────────────────────────────────────────────

const journal = computed(() => item.value?.journal ?? [])
const addingJournalEntry = ref(false)
const newJournalText = ref('')

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function startJournalEntry() {
  newJournalText.value = ''
  addingJournalEntry.value = true
}

async function saveJournalEntry() {
  if (!newJournalText.value.trim()) return
  const now = new Date().toISOString()
  const entry: JournalEntry = { id: generateId(), text: newJournalText.value.trim(), createdAt: now }
  await store.updateItem(id, { journal: [...journal.value, entry] })
  newJournalText.value = ''
  addingJournalEntry.value = false
}

async function removeJournalEntry(entryId: string) {
  await store.updateItem(id, { journal: journal.value.filter(e => e.id !== entryId) })
}

// ── Notes ────────────────────────────────────────────────────────────────────

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
  const note: Note = { id: generateId(), text: newNoteText.value.trim(), createdAt: now, updatedAt: now }
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

// ── Linked dreams ─────────────────────────────────────────────────────────────

const linkSearch = ref('')
const showLinkDropdown = ref(false)

const linkedItems = computed(() =>
  (item.value?.linkedIds ?? [])
    .map(lid => store.getById(lid))
    .filter((i): i is BucketItem => !!i)
)

const linkSuggestions = computed(() => {
  const q = linkSearch.value.trim().toLowerCase()
  const linkedSet = new Set(item.value?.linkedIds ?? [])
  return store.items
    .filter(i => i.id !== id && !linkedSet.has(i.id) && (!q || i.title.toLowerCase().includes(q)))
    .slice(0, 5)
})

function hideLinkDropdown() {
  setTimeout(() => { showLinkDropdown.value = false }, 150)
}

async function linkDream(otherId: string) {
  const current = item.value?.linkedIds ?? []
  await store.updateItem(id, { linkedIds: [...current, otherId] })
  linkSearch.value = ''
  showLinkDropdown.value = false
}

async function unlinkDream(otherId: string) {
  await store.updateItem(id, { linkedIds: (item.value?.linkedIds ?? []).filter(lid => lid !== otherId) })
}

// ── Privacy ───────────────────────────────────────────────────────────────────

async function togglePrivacy() {
  await store.updateItem(id, { isPrivate: !item.value?.isPrivate })
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function doDelete() {
  await store.deleteItem(id)
  router.push('/list')
}
</script>
