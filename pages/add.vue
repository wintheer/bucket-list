<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <NuxtLink to="/list" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to list
    </NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Add to your bucket list</h1>
    <BucketItemForm :initial="prefill" @submit="onSubmit" @cancel="router.push('/list')" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useBucketListStore } from '~/stores/bucketList'
import type { BucketItem, ItemCategory } from '~/types/bucket'

const router = useRouter()
const route = useRoute()
const store = useBucketListStore()
onMounted(() => store.load())

const prefill = computed(() => ({
  title: (route.query.title as string) ?? '',
  category: (route.query.category as ItemCategory) ?? undefined,
}))

async function onSubmit(data: Omit<BucketItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const item = await store.addItem(data)
  router.push(`/list/${item.id}`)
}
</script>
