<template>
  <div class="min-h-[calc(100vh-64px)] flex flex-col">
    <!-- Progress bar -->
    <div class="h-0.5 bg-gray-100 dark:bg-gray-800">
      <div
        class="h-full bg-primary-400 transition-[width] duration-500 ease-out"
        :style="{ width: `${(step / TOTAL_STEPS) * 100}%` }"
      />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div class="w-full max-w-xl">

        <!-- Step dots -->
        <div class="flex justify-center gap-1.5 mb-10">
          <div
            v-for="i in TOTAL_STEPS"
            :key="i"
            class="rounded-full transition-all duration-300"
            :class="[
              i === step  ? 'w-6 h-2 bg-primary-400' :
              i < step    ? 'w-2 h-2 bg-primary-200 dark:bg-primary-800' :
                            'w-2 h-2 bg-gray-200 dark:bg-gray-700'
            ]"
          />
        </div>

        <Transition :name="direction === 'forward' ? 'slide-fwd' : 'slide-back'" mode="out-in">

          <!-- Step 1: Title -->
          <div v-if="step === 1" key="step1" class="space-y-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What do you want to do?
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                Write it as if telling a friend about a dream.
              </p>
            </div>
            <UInput
              v-model="form.title"
              size="xl"
              placeholder="Hike the Camino de Santiago..."
              autofocus
              @keydown.enter="step1Next"
            />

            <!-- Suggestions -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Or try one of these</p>
                <button
                  class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  @click="shuffleSuggestions"
                >
                  <UIcon name="i-lucide-refresh-cw" class="size-3" /> Shuffle
                </button>
              </div>
              <div class="flex flex-col gap-2">
                <button
                  v-for="s in suggestions"
                  :key="s.title"
                  class="flex items-center gap-3 text-sm text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-gray-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all"
                  @click="useSuggestion(s)"
                >
                  <UIcon
                    :name="CATEGORIES.find(c => c.value === s.category)?.icon ?? 'i-lucide-sparkles'"
                    class="size-4 shrink-0"
                    :class="CATEGORIES.find(c => c.value === s.category)?.color ?? 'text-gray-400'"
                  />
                  {{ s.title }}
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <UButton variant="ghost" color="neutral" to="/list">Cancel</UButton>
              <UButton
                size="lg"
                trailing-icon="i-lucide-arrow-right"
                :disabled="!form.title.trim()"
                @click="step1Next"
              >
                Next
              </UButton>
            </div>
          </div>

          <!-- Step 2: Why -->
          <div v-else-if="step === 2" key="step2" class="space-y-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Why does this matter?
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                The clearer your reason, the more likely you'll actually do it.
              </p>
            </div>
            <UTextarea
              v-model="form.why"
              :rows="4"
              placeholder="Because life is short and I've always wanted to feel what it's like to..."
              autofocus
            />
            <div class="flex items-center justify-between">
              <UButton variant="ghost" color="neutral" @click="back">Back</UButton>
              <UButton
                size="lg"
                trailing-icon="i-lucide-arrow-right"
                :disabled="!form.why.trim()"
                @click="advance"
              >
                Next
              </UButton>
            </div>
          </div>

          <!-- Step 3: Category -->
          <div v-else-if="step === 3" key="step3" class="space-y-8">
            <div class="text-center">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What kind of experience?
              </h1>
              <p class="text-gray-500 dark:text-gray-400">Pick the one that fits best.</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="cat in CATEGORIES"
                :key="cat.value"
                type="button"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center focus:outline-none"
                :class="form.category === cat.value
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'"
                @click="selectCategory(cat.value)"
              >
                <UIcon :name="cat.icon" class="size-6" :class="cat.color" />
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ cat.label }}</span>
              </button>
            </div>
            <div class="flex items-center justify-start">
              <UButton variant="ghost" color="neutral" @click="back">Back</UButton>
            </div>
          </div>

          <!-- Step 4: Life Area -->
          <div v-else-if="step === 4" key="step4" class="space-y-8">
            <div class="text-center">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Which part of your life?
              </h1>
              <p class="text-gray-500 dark:text-gray-400">Which area of your life does this feed?</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="area in LIFE_AREAS"
                :key="area.value"
                type="button"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center focus:outline-none"
                :class="form.lifeArea === area.value
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'"
                @click="selectLifeArea(area.value)"
              >
                <UIcon :name="area.icon" class="size-6 text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ area.label }}</span>
              </button>
            </div>
            <div class="flex items-center justify-start">
              <UButton variant="ghost" color="neutral" @click="back">Back</UButton>
            </div>
          </div>

          <!-- Step 5: When / Priority -->
          <div v-else-if="step === 5" key="step5" class="space-y-8">
            <div class="text-center">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                When do you see this happening?
              </h1>
              <p class="text-gray-500 dark:text-gray-400">Be honest with yourself.</p>
            </div>
            <div class="space-y-3">
              <button
                v-for="p in PRIORITIES"
                :key="p.value"
                type="button"
                :disabled="submitting"
                class="w-full flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left focus:outline-none disabled:opacity-60"
                :class="form.priority === p.value
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'"
                @click="form.priority = p.value"
              >
                <UIcon :name="p.icon" class="size-5 mt-0.5 shrink-0" :class="p.color" />
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ p.label }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ p.description }}</p>
                </div>
              </button>
            </div>

            <label class="flex items-center gap-3 py-3 px-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-pointer select-none">
              <input type="checkbox" v-model="form.isPrivate" class="sr-only" />
              <div
                class="relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0"
                :class="form.isPrivate ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <div
                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :class="form.isPrivate ? 'translate-x-5' : 'translate-x-1'"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Keep this dream private</p>
                <p class="text-xs text-gray-400">Public dreams can inspire others in the discover section</p>
              </div>
            </label>

            <button
              v-if="form.priority"
              type="button"
              :disabled="submitting"
              class="w-full py-3 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              @click="submit"
            >
              {{ submitting ? 'Adding...' : 'Add this dream' }}
            </button>

            <div class="flex items-center justify-start">
              <UButton variant="ghost" color="neutral" :disabled="submitting" @click="back">Back</UButton>
            </div>
          </div>

        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBucketListStore } from '~/stores/bucketList'
import { CATEGORIES, LIFE_AREAS, DISCOVER_PROMPTS } from '~/types/bucket'
import type { ItemCategory, ItemPriority, LifeArea, ItemStatus } from '~/types/bucket'

const route = useRoute()
const router = useRouter()
const store = useBucketListStore()
const toast = useToast()

const TOTAL_STEPS = 5

const FLAT_PROMPTS = Object.entries(DISCOVER_PROMPTS).flatMap(([cat, prompts]) =>
  prompts.map(p => ({ title: p, category: cat as ItemCategory }))
)

const suggestions = ref<{ title: string; category: ItemCategory }[]>([])

function shuffleSuggestions() {
  const pool = [...FLAT_PROMPTS]
  const picked: typeof FLAT_PROMPTS = []
  for (let i = 0; i < 3 && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(idx, 1)[0]!)
  }
  suggestions.value = picked
}

shuffleSuggestions()

function useSuggestion(s: { title: string; category: ItemCategory }) {
  form.title = s.title
  if (!form.category) form.category = s.category
}

const PRIORITIES: { value: ItemPriority; label: string; description: string; icon: string; color: string }[] = [
  {
    value: 'soon',
    label: 'This year',
    description: "I'm actively planning this or making it happen now.",
    icon: 'i-lucide-flame',
    color: 'text-orange-500',
  },
  {
    value: 'near-term',
    label: 'Next year or two',
    description: "I'd love to do this in the near future.",
    icon: 'i-lucide-calendar',
    color: 'text-blue-500',
  },
  {
    value: 'someday',
    label: 'One day',
    description: "A dream I'm holding onto for the right moment.",
    icon: 'i-lucide-cloud',
    color: 'text-gray-400',
  },
]

const form = reactive({
  title: (route.query.title as string) ?? '',
  why: '',
  category: (route.query.category as ItemCategory) ?? ('' as ItemCategory),
  lifeArea: '' as LifeArea,
  priority: '' as ItemPriority,
  isPrivate: false,
})

const step = ref(1)
const direction = ref<'forward' | 'back'>('forward')
const submitting = ref(false)

function advance() {
  direction.value = 'forward'
  step.value++
}

function back() {
  direction.value = 'back'
  step.value--
}

function step1Next() {
  if (!form.title.trim()) return
  advance()
}

function selectCategory(cat: ItemCategory) {
  form.category = cat
  setTimeout(() => advance(), 160)
}

function selectLifeArea(area: LifeArea) {
  form.lifeArea = area
  setTimeout(() => advance(), 160)
}

async function submit() {
  if (submitting.value || !form.priority) return
  submitting.value = true
  try {
    const item = await store.addItem({
      title: form.title.trim(),
      why: form.why.trim(),
      description: '',
      category: form.category,
      lifeArea: form.lifeArea,
      priority: form.priority,
      status: 'idea' as ItemStatus,
      isPrivate: form.isPrivate,
    })
    router.push(`/list/${item.id}`)
  } catch {
    toast.add({ title: 'Something went wrong', color: 'error' })
    submitting.value = false
  }
}
</script>

<style scoped>
.slide-fwd-enter-active,
.slide-fwd-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.25s ease;
}
.slide-fwd-enter-from {
  transform: translateX(32px);
  opacity: 0;
}
.slide-fwd-leave-to {
  transform: translateX(-32px);
  opacity: 0;
}
.slide-back-enter-from {
  transform: translateX(-32px);
  opacity: 0;
}
.slide-back-leave-to {
  transform: translateX(32px);
  opacity: 0;
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
