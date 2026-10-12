<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Log in to your bucket list</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <UInput v-model="email" type="email" autocomplete="email" size="lg" class="w-full" autofocus required />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <UInput v-model="password" type="password" autocomplete="current-password" size="lg" class="w-full" required />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <UButton type="submit" size="lg" block :loading="loading">Log in</UButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'default' })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await reloadNuxtApp({ path: '/' })
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong, try again'
  } finally {
    loading.value = false
  }
}
</script>
