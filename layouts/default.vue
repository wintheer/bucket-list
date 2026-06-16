<template>
  <div>
    <nav class="bg-gray-900 text-white px-6 py-3 flex items-center gap-6 sticky top-0 z-50">
      <NuxtLink to="/" class="font-bold text-lg tracking-tight shrink-0">bucket list</NuxtLink>

      <div class="flex items-center gap-1 mx-auto">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link px-3 py-1.5 rounded-md text-sm"
          :class="{ 'nav-link--active': link.to !== '/' && (route.path === link.to || route.path.startsWith(link.to + '/')) }"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <button
          class="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        >
          <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
        <UButton size="sm" icon="i-lucide-plus" to="/add">Add a dream</UButton>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { to: '/list',      label: 'My Dreams' },
  { to: '/journal',   label: 'Journal' },
  { to: '/discover',  label: 'Get Inspired' },
  { to: '/memories',  label: 'Memories' },
  { to: '/me',        label: 'Me' },
  { to: '/review',    label: 'Year in Review' },
]
</script>

<style>
/* Freddy's custom colour palette: https://coolors.co/0d1f22-6290c3-edf7f6-98473e-a37c40 */
:root {
  --jungle-green: #0D1F22;
  --un-blue: #6290C3;
  --txt-colour: #EDF7F6;
  --chestnut: #98473E;
  --sunburst: #A37C40;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.15s, background-color 0.15s;
}
.nav-link:hover {
  color: #fff;
  background-color: rgba(255,255,255,0.08);
}
.nav-link--active {
  color: #fff;
  background-color: rgba(255,255,255,0.12);
}
</style>
