<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <NuxtLink to="/me" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" /> Back to Me
    </NuxtLink>

    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Explore your values</p>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">{{ headerTitle }}</h1>

    <!-- Progress -->
    <div v-if="step === 'domain'" class="flex gap-1 mb-8">
      <div
        v-for="(d, i) in domains"
        :key="d.value"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="i <= domainIndex ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'"
      />
    </div>

    <!-- Intro -->
    <div v-if="step === 'intro'" class="text-center py-10">
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto mb-6">
        You'll browse value words one area of life at a time. Mark anything that resonates —
        there's no wrong answer. Afterwards, you'll narrow those down to the ones that matter most.
      </p>
      <UButton size="lg" @click="step = 'domain'">Start</UButton>
    </div>

    <!-- Domain pass -->
    <div v-else-if="step === 'domain'">
      <div class="flex items-center gap-2 mb-1">
        <UIcon :name="currentDomain.icon" class="size-4 text-primary-500" />
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Area {{ domainIndex + 1 }} of {{ domains.length }}
        </p>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Tap anything that feels true to you in this part of your life.
      </p>
      <div class="grid sm:grid-cols-2 gap-2">
        <button
          v-for="item in currentWords"
          :key="item.word"
          :disabled="isAlreadySaved(item.word)"
          class="text-left px-3.5 py-2.5 rounded-xl border transition-colors"
          :class="chipClass(item.word)"
          @click="toggleBroad(item)"
        >
          <p class="text-sm font-semibold flex items-center gap-1.5">
            {{ item.word }}
            <span v-if="isAlreadySaved(item.word)" class="text-xs font-normal">✓ saved</span>
          </p>
          <p class="text-xs mt-0.5 opacity-80">{{ item.description }}</p>
        </button>
      </div>
    </div>

    <!-- Narrowing pass -->
    <div v-else-if="step === 'narrow'">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm">
        From everything you marked, which feel closest to the core of who you are?
        There's no set number — choose as many or as few as feel right.
      </p>
      <div v-if="broadList.length" class="grid sm:grid-cols-2 gap-2">
        <button
          v-for="item in broadList"
          :key="item.word"
          class="text-left px-3.5 py-2.5 rounded-xl border transition-colors"
          :class="narrowed.has(item.word)
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'"
          @click="toggleNarrow(item.word)"
        >
          <p class="text-sm font-semibold">{{ item.word }}</p>
          <p class="text-xs mt-0.5 opacity-80">{{ item.description }}</p>
        </button>
      </div>
      <p v-else class="text-sm text-gray-400 py-16 text-center">
        You didn't mark anything yet — go back and tap a few words that resonate.
      </p>
    </div>

    <!-- Review -->
    <div v-else-if="step === 'review'">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Make each definition your own if you'd like, then save them to your list.
      </p>
      <div v-if="reviewItems.length" class="space-y-3">
        <div
          v-for="item in reviewItems"
          :key="item.name"
          class="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <button
            class="w-4 h-4 rounded-full shrink-0 mt-1.5"
            :style="{ backgroundColor: valueHex(item.color) }"
            title="Change color"
            @click="cycleColor(item)"
          />
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</p>
            <input
              v-model="item.description"
              type="text"
              placeholder="What does this mean to you? (optional)"
              class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors mt-1"
            />
          </div>
          <button
            class="opacity-60 hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none shrink-0"
            @click="removeReviewItem(item.name)"
          >×</button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 py-16 text-center">
        Nothing left to save — go back and choose a few values first.
      </p>
    </div>

    <!-- Footer nav -->
    <div v-if="step !== 'intro'" class="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
      <button class="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" @click="back">
        Back
      </button>
      <div class="flex items-center gap-4">
        <button v-if="step === 'domain'" class="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" @click="step = 'narrow'">
          Skip to narrowing ({{ broadList.length }})
        </button>
        <UButton v-if="step === 'domain'" size="sm" @click="nextDomain">
          {{ isLastDomain ? 'Narrow down' : 'Next area' }}
        </UButton>
        <UButton v-else-if="step === 'narrow'" size="sm" :disabled="narrowed.size === 0" @click="goToReview">
          Review {{ narrowed.size }} value{{ narrowed.size === 1 ? '' : 's' }}
        </UButton>
        <UButton v-else-if="step === 'review'" size="sm" :disabled="!reviewItems.length || saving" :loading="saving" @click="saveAll">
          Save {{ reviewItems.length }} value{{ reviewItems.length === 1 ? '' : 's' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMeStore } from '~/stores/me'
import { VALUE_COLORS, VALUE_DOMAINS, VALUE_WORDS, valueHex } from '~/types/me'
import type { ValueWord } from '~/types/me'

const store = useMeStore()
onMounted(() => store.load())

type Step = 'intro' | 'domain' | 'narrow' | 'review'
type ReviewItem = { name: string; domain: string; description: string; color: string }
type PickedMeta = { domain: string; description: string }

const step = ref<Step>('intro')
const domainIndex = ref(0)
const picked = ref(new Map<string, PickedMeta>())
const narrowed = ref(new Set<string>())
const reviewItems = ref<ReviewItem[]>([])
const saving = ref(false)

const domains = VALUE_DOMAINS

const existingNames = computed(() => new Set(store.values.map(v => v.name.trim().toLowerCase())))
const isAlreadySaved = (word: string) => existingNames.value.has(word.trim().toLowerCase())

const currentDomain = computed(() => domains[domainIndex.value]!)
const currentWords = computed(() => VALUE_WORDS[currentDomain.value.value])
const isLastDomain = computed(() => domainIndex.value === domains.length - 1)

const broadList = computed(() =>
  Array.from(picked.value.entries())
    .filter(([word]) => !isAlreadySaved(word))
    .map(([word, meta]) => ({ word, description: meta.description }))
)

const headerTitle = computed(() => {
  if (step.value === 'intro') return 'A guided exercise'
  if (step.value === 'domain') return currentDomain.value.label
  if (step.value === 'narrow') return 'Choose what matters most'
  return 'Review & save'
})

function chipClass(word: string) {
  if (isAlreadySaved(word)) return 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
  if (picked.value.has(word)) return 'bg-primary-500 border-primary-500 text-white'
  return 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
}

function toggleBroad(item: ValueWord) {
  if (isAlreadySaved(item.word)) return
  if (picked.value.has(item.word)) picked.value.delete(item.word)
  else picked.value.set(item.word, { domain: currentDomain.value.value, description: item.description })
}

function toggleNarrow(word: string) {
  if (narrowed.value.has(word)) narrowed.value.delete(word)
  else narrowed.value.add(word)
}

function nextDomain() {
  if (isLastDomain.value) step.value = 'narrow'
  else domainIndex.value++
}

function back() {
  if (step.value === 'domain') {
    if (domainIndex.value > 0) domainIndex.value--
    else step.value = 'intro'
  } else if (step.value === 'narrow') {
    step.value = 'domain'
    domainIndex.value = domains.length - 1
  } else if (step.value === 'review') {
    step.value = 'narrow'
  }
}

function goToReview() {
  reviewItems.value = Array.from(narrowed.value).map((word, i) => ({
    name: word,
    domain: picked.value.get(word)?.domain ?? '',
    description: picked.value.get(word)?.description ?? '',
    color: VALUE_COLORS[i % VALUE_COLORS.length]!.value,
  }))
  step.value = 'review'
}

function removeReviewItem(name: string) {
  reviewItems.value = reviewItems.value.filter(r => r.name !== name)
}

function cycleColor(item: ReviewItem) {
  const idx = VALUE_COLORS.findIndex(c => c.value === item.color)
  item.color = VALUE_COLORS[(idx + 1) % VALUE_COLORS.length]!.value
}

async function saveAll() {
  if (!reviewItems.value.length || saving.value) return
  saving.value = true
  try {
    const existing = new Set(store.values.map(v => v.name.trim().toLowerCase()))
    const toSave = reviewItems.value.filter(r => !existing.has(r.name.trim().toLowerCase()))
    await Promise.all(toSave.map(r => store.addValue({
      name: r.name,
      description: r.description.trim() || undefined,
      color: r.color,
      domain: r.domain,
    })))
    await navigateTo('/me')
  } finally {
    saving.value = false
  }
}
</script>
