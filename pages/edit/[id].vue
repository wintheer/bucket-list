<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <NuxtLink :to="`/list/${id}`" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back
    </NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Edit item</h1>
    <div v-if="item">
      <BucketItemForm :initial="item" :is-editing="true" @submit="onSubmit" @cancel="router.push(`/list/${id}`)" />
    </div>
    <div v-else class="text-gray-400">Item not found.</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import type { BucketItem } from '~/types/bucket'

const router = useRouter()
const route = useRoute()
const store = useBucketListStore()
onMounted(() => store.load())

const id = route.params.id as string
const item = computed(() => store.getById(id))

async function onSubmit(data: Omit<BucketItem, 'id' | 'createdAt' | 'updatedAt'>) {
  await store.updateItem(id, data)
  router.push(`/list/${id}`)
}
</script>
