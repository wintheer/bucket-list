<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <NuxtLink to="/me" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to Me
    </NuxtLink>

    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Guided exercise</p>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Your best possible self</h1>

    <!-- Intro -->
    <div v-if="step === 'intro'" class="py-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-8">
        Imagine yourself in the future. Everything has gone as well as it possibly could.
        You worked hard and reached what you set out to do. It isn't a fantasy, just the best realistic version of your life.
        Write about it for 15–20 minutes. Afterwards you'll pick out the dreams hidden in it.
      </p>
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">How far ahead?</p>
      <div class="flex gap-3 mb-8">
        <button
          v-for="h in VISION_HORIZONS"
          :key="h"
          class="flex-1 py-4 rounded-2xl border text-center transition-colors"
          :class="horizon === h
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'"
          @click="horizon = h"
        >
          <p class="text-2xl font-bold">{{ h }}</p>
          <p class="text-xs">{{ h === 1 ? 'year' : 'years' }}</p>
        </button>
      </div>
      <UButton size="lg" @click="step = 'write'">Start writing</UButton>
    </div>

    <!-- Write -->
    <div v-else-if="step === 'write'">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        It's {{ targetYear }}. Write in the present tense, as if it's already true.
      </p>

      <!-- Prompt -->
      <div class="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
        <UIcon :name="currentPromptDomain.icon" class="size-4 text-primary-500 shrink-0" />
        <p class="flex-1 text-sm text-gray-600 dark:text-gray-300">{{ VISION_PROMPTS[currentPromptDomain.value] }}</p>
        <button class="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 shrink-0" @click="nextPrompt">
          Another prompt
        </button>
      </div>

      <textarea
        v-model="text"
        :placeholder="`It's ${targetYear}, and I...`"
        rows="14"
        class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-gray-800 dark:text-gray-200 leading-relaxed resize-none focus:outline-none focus:border-primary-400 dark:focus:border-primary-600 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-700"
      />
      <div class="flex items-center justify-between mt-3">
        <span class="text-xs text-gray-400">{{ wordCount }} words</span>
        <div class="flex gap-2">
          <UButton variant="ghost" color="neutral" @click="step = 'intro'">Back</UButton>
          <UButton :disabled="wordCount < 10" :loading="saving" @click="saveVision">Save & find dreams</UButton>
        </div>
      </div>
    </div>

    <!-- Extract dreams -->
    <div v-else-if="step === 'dreams'">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-lg">
        Your vision is saved. Read it back. What in it could you start working on, or experience, on the way there?
        Add those to your bucket list as ideas. You can fill in the details later.
      </p>

      <div class="p-5 mb-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 max-h-64 overflow-y-auto">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ text }}</p>
      </div>

      <div class="flex gap-2 mb-4">
        <input
          v-model="dreamInput"
          type="text"
          placeholder="e.g. Run a marathon, Learn Italian..."
          class="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
          @keydown.enter.prevent="addDream"
        />
        <UButton size="sm" icon="i-lucide-plus" :disabled="!dreamInput.trim()" :loading="addingDream" @click="addDream">Add to list</UButton>
      </div>

      <div v-if="addedDreams.length" class="space-y-2 mb-8">
        <div
          v-for="d in addedDreams"
          :key="d.id"
          class="flex items-center gap-3 p-3 rounded-xl border border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-950/30"
        >
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <NuxtLink :to="`/list/${d.id}`" class="flex-1 text-sm text-gray-700 dark:text-gray-300 hover:underline">{{ d.title }}</NuxtLink>
        </div>
      </div>

      <UButton to="/me" variant="outline" color="neutral">Done</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExercisesStore } from '~/stores/exercises'
import { useBucketListStore } from '~/stores/bucketList'
import { VALUE_DOMAINS } from '~/types/me'
import { VISION_HORIZONS, VISION_PROMPTS } from '~/types/exercises'
import type { BucketItem } from '~/types/bucket'

const store = useExercisesStore()
const bucketStore = useBucketListStore()

const step = ref<'intro' | 'write' | 'dreams'>('intro')
const horizon = ref<number>(10)
const text = ref('')
const saving = ref(false)

const targetYear = computed(() => new Date().getFullYear() + horizon.value)
const wordCount = computed(() => text.value.trim().split(/\s+/).filter(Boolean).length)

const promptIndex = ref(Math.floor(Math.random() * VALUE_DOMAINS.length))
const currentPromptDomain = computed(() => VALUE_DOMAINS[promptIndex.value % VALUE_DOMAINS.length]!)
function nextPrompt() {
  promptIndex.value++
}

async function saveVision() {
  saving.value = true
  try {
    await store.addVision({ horizonYears: horizon.value, text: text.value.trim() })
    step.value = 'dreams'
  } finally {
    saving.value = false
  }
}

const dreamInput = ref('')
const addingDream = ref(false)
const addedDreams = ref<BucketItem[]>([])

async function addDream() {
  const title = dreamInput.value.trim()
  if (!title) return
  addingDream.value = true
  try {
    const item = await bucketStore.addItem({
      title,
      description: '',
      why: `From my best possible self, ${targetYear.value}`,
      category: 'experiences',
      lifeArea: 'growth',
      status: 'idea',
      priority: 'someday',
    })
    addedDreams.value.push(item)
    dreamInput.value = ''
  } finally {
    addingDream.value = false
  }
}
</script>
