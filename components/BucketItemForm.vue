<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl mx-auto">
    <UFormField label="What do you want to do?" required>
      <UInput v-model="form.title" placeholder="e.g. Hike the Camino de Santiago" size="lg" class="w-full" />
    </UFormField>

    <UFormField label="Why does this matter to you?" required>
      <UTextarea
        v-model="form.why"
        placeholder="What would it mean to do this? Why is it on your list?"
        :rows="3"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Description (optional)">
      <UTextarea
        v-model="form.description"
        placeholder="Any extra details, notes, or context..."
        :rows="3"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField label="Category" required>
        <USelect v-model="form.category" :items="categoryOptions" placeholder="Pick a category" class="w-full" />
      </UFormField>

      <UFormField label="Life area" required>
        <USelect v-model="form.lifeArea" :items="lifeAreaOptions" placeholder="Pick a life area" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField label="Status">
        <USelect v-model="form.status" :items="statusOptions" class="w-full" />
      </UFormField>

      <UFormField label="Priority">
        <USelect v-model="form.priority" :items="priorityOptions" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Location (optional)" hint="City, country, or region — for travel goals">
      <UInput v-model="form.location" placeholder="e.g. Kyoto, Japan" class="w-full" />
    </UFormField>

    <UFormField label="Image URL (optional)" hint="Paste a URL to an inspiring image">
      <UInput v-model="form.imageUrl" placeholder="https://..." class="w-full" />
      <div v-if="form.imageUrl" class="mt-3">
        <img :src="form.imageUrl" alt="Preview" class="rounded-lg h-40 w-full object-cover" @error="form.imageUrl = ''">
      </div>
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton type="submit" size="lg" :loading="saving">
        {{ isEditing ? 'Save changes' : 'Add to list' }}
      </UButton>
      <UButton variant="ghost" color="neutral" size="lg" @click="$emit('cancel')">Cancel</UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CATEGORIES, LIFE_AREAS, STATUS_CONFIG, PRIORITY_CONFIG } from '~/types/bucket'
import type { BucketItem, ItemCategory, LifeArea, ItemStatus, ItemPriority } from '~/types/bucket'

const props = defineProps<{
  initial?: Partial<BucketItem>
  isEditing?: boolean
}>()

const emit = defineEmits<{
  submit: [data: Omit<BucketItem, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const saving = ref(false)

const form = reactive({
  title: props.initial?.title ?? '',
  why: props.initial?.why ?? '',
  description: props.initial?.description ?? '',
  category: (props.initial?.category ?? 'experiences') as ItemCategory,
  lifeArea: (props.initial?.lifeArea ?? 'growth') as LifeArea,
  status: (props.initial?.status ?? 'idea') as ItemStatus,
  priority: (props.initial?.priority ?? 'someday') as ItemPriority,
  location: props.initial?.location ?? '',
  imageUrl: props.initial?.imageUrl ?? '',
  reflection: props.initial?.reflection ?? '',
})

const categoryOptions = CATEGORIES.map(c => ({ label: c.label, value: c.value }))
const lifeAreaOptions = LIFE_AREAS.map(l => ({ label: l.label, value: l.value }))
const statusOptions = (Object.keys(STATUS_CONFIG) as ItemStatus[]).map(k => ({ label: STATUS_CONFIG[k].label, value: k }))
const priorityOptions = (Object.keys(PRIORITY_CONFIG) as ItemPriority[]).map(k => ({ label: PRIORITY_CONFIG[k].label, value: k }))

async function handleSubmit() {
  if (!form.title.trim() || !form.why.trim()) return
  saving.value = true
  emit('submit', {
    title: form.title.trim(),
    why: form.why.trim(),
    description: form.description.trim(),
    category: form.category,
    lifeArea: form.lifeArea,
    status: form.status,
    priority: form.priority,
    location: form.location.trim() || undefined,
    imageUrl: form.imageUrl.trim() || undefined,
    reflection: form.reflection.trim() || undefined,
    completedAt: props.initial?.completedAt,
  })
  saving.value = false
}
</script>
