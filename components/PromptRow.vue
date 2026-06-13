<template>
  <div
    class="flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-colors group"
    :class="onList
      ? 'border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-950/30'
      : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'"
  >
    <span class="text-sm text-gray-700 dark:text-gray-300 leading-snug">{{ prompt }}</span>
    <UIcon
      v-if="onList"
      name="i-lucide-check"
      class="size-4 text-green-500 shrink-0"
    />
    <UButton
      v-else
      size="xs"
      variant="ghost"
      color="neutral"
      icon="i-lucide-plus"
      class="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
      @click.stop="$emit('add')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  prompt: string
  onList?: boolean
}>()

defineEmits<{
  add: []
}>()
</script>
