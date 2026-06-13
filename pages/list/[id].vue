<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <NuxtLink to="/list" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to list
    </NuxtLink>

    <div v-if="!item" class="text-gray-400">Item not found.</div>

    <template v-else>
      <!-- Header image -->
      <div v-if="item.imageUrl" class="mb-8 -mx-6 sm:mx-0">
        <img :src="item.imageUrl" :alt="item.title" class="w-full h-56 object-cover sm:rounded-xl">
      </div>

      <!-- Title + status -->
      <div class="flex items-start justify-between gap-4 mb-2">
        <h1 class="text-3xl font-bold text-gray-900 leading-tight">{{ item.title }}</h1>
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
      <div class="bg-gray-50 rounded-xl p-5 mb-6 border-l-4 border-primary-400">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Why this matters</p>
        <p class="text-gray-700 italic text-lg leading-relaxed">"{{ item.why }}"</p>
      </div>

      <!-- Description -->
      <div v-if="item.description" class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Details</p>
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ item.description }}</p>
      </div>

      <!-- Status changer -->
      <div class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Progress</p>
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

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-100">
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete this item?</h3>
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
import type { ItemStatus } from '~/types/bucket'

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

const statusOptions: { value: ItemStatus; label: string; color: 'neutral' | 'info' | 'success' }[] = [
  { value: 'idea',        label: 'Idea',        color: 'neutral' },
  { value: 'in-progress', label: 'In Progress', color: 'info' },
  { value: 'done',        label: 'Done',        color: 'success' },
]

const catIcon = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.icon ?? 'i-lucide-tag')
const catLabel = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.label ?? '')
const catColor = computed(() => CATEGORIES.find(c => c.value === item.value?.category)?.color ?? 'text-gray-500')

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
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

async function doDelete() {
  await store.deleteItem(id)
  router.push('/list')
}
</script>
