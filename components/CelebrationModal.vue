<template>
  <Teleport to="body">
    <Transition name="celebrate">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-gray-950/75 backdrop-blur-sm" @click="$emit('close')" />

        <div class="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />

          <div class="p-8 text-center">
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 check-pop">
              <UIcon name="i-lucide-check" class="size-10 text-green-500" />
            </div>

            <p class="text-xs font-semibold uppercase tracking-widest text-green-500 mb-2">
              Goal completed!
            </p>
            <h2 class="text-2xl font-bold text-gray-900 mb-5 leading-snug">
              {{ item?.title }}
            </h2>

            <div v-if="item?.why" class="bg-gray-50 rounded-xl p-4 mb-5 text-left border-l-4 border-green-300">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">You did this because</p>
              <p class="text-gray-700 italic leading-relaxed">"{{ item.why }}"</p>
            </div>

            <p class="text-sm text-gray-500 mb-7">
              Take a moment to feel this. You set out to do something meaningful — and you did it.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <UButton size="lg" icon="i-lucide-pen-line" @click="$emit('reflect')">
                Write a reflection
              </UButton>
              <UButton size="lg" variant="ghost" color="neutral" @click="$emit('close')">
                Keep going
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { BucketItem } from '~/types/bucket'

defineProps<{
  show: boolean
  item?: BucketItem
}>()

defineEmits<{
  close: []
  reflect: []
}>()
</script>

<style scoped>
.celebrate-enter-active {
  transition: opacity 0.25s ease;
}
.celebrate-leave-active {
  transition: opacity 0.2s ease;
}
.celebrate-enter-from,
.celebrate-leave-to {
  opacity: 0;
}

.celebrate-enter-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.celebrate-enter-from .relative {
  transform: scale(0.9);
  opacity: 0;
}

.check-pop {
  animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

@keyframes checkPop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
