<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Me</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Your values, your story, your letters.</p>

    <!-- Tabs -->
    <div class="flex gap-0 border-b border-gray-100 dark:border-gray-800 mb-10">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="activeTab === tab.value
          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="!store.loaded" class="space-y-4 animate-pulse">
      <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    </div>

    <template v-else>
      <!-- ── VALUES ─────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'values'">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          What matters most to you? Articulating your values helps you understand which dreams and experiences truly align with who you are.
        </p>

        <!-- Add form -->
        <div class="mb-8 p-5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Add a value</p>
          <div class="space-y-3">
            <input
              v-model="newValue.name"
              type="text"
              placeholder="e.g. Adventure, Family, Growth..."
              class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
              @keydown.enter.prevent="addValue"
            />
            <input
              v-model="newValue.description"
              type="text"
              placeholder="What does this mean to you? (optional)"
              class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 text-sm text-gray-600 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
            />
            <!-- Color picker -->
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs text-gray-400">Color</span>
              <button
                v-for="c in VALUE_COLORS"
                :key="c.value"
                class="w-5 h-5 rounded-full transition-transform"
                :class="newValue.color === c.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''"
                :style="{ backgroundColor: c.hex }"
                @click="newValue.color = c.value"
              />
            </div>
            <UButton :disabled="!newValue.name.trim()" size="sm" @click="addValue">Add value</UButton>
          </div>
        </div>

        <!-- Values list -->
        <div v-if="store.values.length" class="space-y-3">
          <div
            v-for="v in store.values"
            :key="v.id"
            class="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 group"
          >
            <span class="w-3 h-3 rounded-full shrink-0 mt-1.5" :style="{ backgroundColor: valueHex(v.color) }" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 dark:text-white">{{ v.name }}</p>
              <p v-if="v.description" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ v.description }}</p>
            </div>
            <button
              class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none shrink-0"
              @click="store.deleteValue(v.id)"
            >×</button>
          </div>
        </div>
        <div v-else class="text-center py-16 text-gray-400">
          <p class="text-sm">No values yet. What do you stand for?</p>
        </div>
      </div>

      <!-- ── WHO AM I ────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'whoami'">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Write about who you are — not for anyone else. Come back and revise it as you grow. Each version is saved so you can see how you've changed.
        </p>

        <!-- Editor -->
        <div class="mb-8">
          <textarea
            v-model="whoAmIText"
            placeholder="I am someone who..."
            rows="8"
            class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-gray-800 dark:text-gray-200 leading-relaxed resize-none focus:outline-none focus:border-primary-400 dark:focus:border-primary-600 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-700"
          />
          <div class="flex items-center justify-between mt-3">
            <p v-if="store.whoAmIVersions.length" class="text-xs text-gray-400">
              Last updated {{ formatDate(store.whoAmIVersions[0]!.createdAt) }}
            </p>
            <span v-else />
            <UButton :disabled="!whoAmIText.trim() || whoAmIText === store.currentStatement" size="sm" @click="saveWhoAmI">
              {{ store.currentStatement ? 'Save new version' : 'Save' }}
            </UButton>
          </div>
        </div>

        <!-- History -->
        <div v-if="store.whoAmIVersions.length > 1">
          <button
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="showHistory = !showHistory"
          >
            <UIcon :name="showHistory ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-3.5" />
            Previous versions ({{ store.whoAmIVersions.length - 1 }})
          </button>
          <div v-if="showHistory" class="space-y-4">
            <div
              v-for="v in store.whoAmIVersions.slice(1)"
              :key="v.id"
              class="pl-4 border-l-2 border-gray-100 dark:border-gray-800 py-1"
            >
              <p class="text-xs text-gray-400 mb-1">{{ formatDate(v.createdAt) }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap line-clamp-4">{{ v.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── LETTERS ─────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'letters'">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Write a letter to your future self. It will be sealed until the date you choose.
        </p>

        <!-- Write button / form -->
        <Transition name="compose">
          <div v-if="composingLetter" class="mb-8 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-4">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">New letter</p>
            <input
              v-model="newLetter.subject"
              type="text"
              placeholder="Subject — what is this letter about?"
              class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:outline-none py-1.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors font-medium"
            />
            <textarea
              v-model="newLetter.body"
              placeholder="Dear future me..."
              rows="8"
              class="w-full bg-transparent text-gray-800 dark:text-gray-200 leading-relaxed resize-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
            />
            <div class="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <label class="text-xs text-gray-400 shrink-0">Open on</label>
              <input
                v-model="newLetter.openOn"
                type="date"
                :min="tomorrow"
                class="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:outline-none text-sm text-gray-700 dark:text-gray-300 py-1 transition-colors"
              />
            </div>
            <div class="flex gap-2">
              <UButton :disabled="!newLetter.subject.trim() || !newLetter.body.trim() || !newLetter.openOn" @click="saveLetter">Seal & save</UButton>
              <UButton variant="ghost" color="neutral" @click="composingLetter = false">Cancel</UButton>
            </div>
          </div>
        </Transition>

        <UButton v-if="!composingLetter" variant="outline" color="neutral" icon="i-lucide-pen-line" class="mb-8" @click="composingLetter = true">
          Write a letter
        </UButton>

        <!-- Sealed letters -->
        <div v-if="sealedLetters.length" class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Still sealed</p>
          <div class="space-y-3">
            <div
              v-for="l in sealedLetters"
              :key="l.id"
              class="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <UIcon name="i-lucide-lock" class="size-5 text-gray-300 dark:text-gray-600 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ l.subject }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Opens {{ formatDate(l.openOn) }}</p>
              </div>
              <button
                class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none shrink-0"
                @click="store.deleteLetter(l.id)"
              >×</button>
            </div>
          </div>
        </div>

        <!-- Opened letters -->
        <div v-if="openLetters.length">
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Ready to read</p>
          <div class="space-y-4">
            <div
              v-for="l in openLetters"
              :key="l.id"
              class="group rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 overflow-hidden"
            >
              <div class="flex items-center gap-3 px-5 py-4 border-b border-amber-100 dark:border-amber-900/40">
                <UIcon name="i-lucide-mail-open" class="size-4 text-amber-400 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 dark:text-white">{{ l.subject }}</p>
                  <p class="text-xs text-gray-400">Written {{ formatDate(l.createdAt) }} · Opened {{ formatDate(l.openOn) }}</p>
                </div>
                <button
                  class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all text-lg leading-none shrink-0"
                  @click="store.deleteLetter(l.id)"
                >×</button>
              </div>
              <div class="px-5 py-4">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{{ l.body }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!sealedLetters.length && !openLetters.length && !composingLetter" class="text-center py-16 text-gray-400">
          <UIcon name="i-lucide-mail" class="size-10 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p class="text-sm">No letters yet. What do you want your future self to know?</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMeStore } from '~/stores/me'
import { VALUE_COLORS, valueHex } from '~/types/me'

const store = useMeStore()
onMounted(() => store.load())

const tabs = [
  { value: 'values', label: 'Values' },
  { value: 'whoami', label: 'Who Am I' },
  { value: 'letters', label: 'Letters' },
] as const

type Tab = typeof tabs[number]['value']
const activeTab = ref<Tab>('values')

// ── Values ───────────────────────────────────────────────────────────────────

const newValue = ref({ name: '', description: '', color: 'violet' })

async function addValue() {
  if (!newValue.value.name.trim()) return
  await store.addValue({ name: newValue.value.name.trim(), description: newValue.value.description.trim() || undefined, color: newValue.value.color })
  newValue.value = { name: '', description: '', color: 'violet' }
}

// ── Who Am I ─────────────────────────────────────────────────────────────────

const whoAmIText = ref('')
const showHistory = ref(false)

watch(() => store.currentStatement, val => { whoAmIText.value = val }, { immediate: true })

async function saveWhoAmI() {
  if (!whoAmIText.value.trim() || whoAmIText.value === store.currentStatement) return
  await store.saveWhoAmI(whoAmIText.value.trim())
}

// ── Letters ───────────────────────────────────────────────────────────────────

const composingLetter = ref(false)
const newLetter = ref({ subject: '', body: '', openOn: '' })

const tomorrow = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

const sealedLetters = computed(() => store.lettersWithStatus.filter(l => l.isSealed))
const openLetters = computed(() => store.lettersWithStatus.filter(l => !l.isSealed))

async function saveLetter() {
  if (!newLetter.value.subject.trim() || !newLetter.value.body.trim() || !newLetter.value.openOn) return
  await store.addLetter({ subject: newLetter.value.subject.trim(), body: newLetter.value.body.trim(), openOn: newLetter.value.openOn })
  newLetter.value = { subject: '', body: '', openOn: '' }
  composingLetter.value = false
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.compose-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.compose-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.compose-enter-from,
.compose-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
