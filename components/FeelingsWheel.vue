<template>
  <div class="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-4">
    <!-- Core feelings -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="core in FEELINGS_WHEEL"
        :key="core.word"
        class="px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize"
        :class="activeCore?.word === core.word
          ? 'text-gray-900 dark:text-white'
          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
        :style="activeCore?.word === core.word ? { borderColor: core.hex, backgroundColor: tint(core.hex) } : {}"
        @click="activeWord = activeCore?.word === core.word ? null : core.word"
      >
        <span class="inline-block w-2 h-2 rounded-full mr-1.5" :style="{ backgroundColor: core.hex }" />
        {{ core.word }}
      </button>
    </div>

    <p v-if="!activeCore" class="text-xs text-gray-400">
      Start broad: which of these is closest? Then narrow down to the word that fits best.
    </p>

    <!-- Secondary + specific -->
    <div v-else class="space-y-3">
      <div class="flex items-center gap-2">
        <button
          class="px-2.5 py-0.5 rounded-full text-xs border transition-colors"
          :class="chipClass(activeCore.word)"
          :style="chipStyle(activeCore.word)"
          @click="toggle(activeCore.word)"
        >{{ activeCore.word }}</button>
        <span class="text-xs text-gray-400">— or more precisely:</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
        <div v-for="group in activeCore.groups" :key="group.word" class="space-y-1.5">
          <button
            class="px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors"
            :class="chipClass(group.word)"
            :style="chipStyle(group.word)"
            @click="toggle(group.word)"
          >{{ group.word }}</button>
          <div class="flex flex-wrap gap-1 pl-2">
            <button
              v-for="word in group.specific"
              :key="word"
              class="px-2 py-0.5 rounded-full text-[11px] border transition-colors"
              :class="chipClass(word)"
              :style="chipStyle(word)"
              @click="toggle(word)"
            >{{ word }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FEELINGS_WHEEL } from '~/types/feelings'

const selected = defineModel<string[]>({ required: true })

const activeWord = ref<string | null>(null)
const activeCore = computed(() => FEELINGS_WHEEL.find(c => c.word === activeWord.value))

function toggle(word: string) {
  selected.value = selected.value.includes(word)
    ? selected.value.filter(w => w !== word)
    : [...selected.value, word]
}

function tint(hex: string) {
  return `color-mix(in srgb, ${hex} 15%, transparent)`
}

function chipClass(word: string) {
  return selected.value.includes(word)
    ? 'text-gray-900 dark:text-white'
    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'
}

function chipStyle(word: string) {
  if (!selected.value.includes(word) || !activeCore.value) return {}
  return { borderColor: activeCore.value.hex, backgroundColor: tint(activeCore.value.hex) }
}
</script>
