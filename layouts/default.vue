<template>
  <div>
    <nav class="bg-gray-900 text-white px-6 py-3 flex items-center gap-6">
      <NuxtLink to="/" class="font-bold text-lg tracking-tight">bucket-list</NuxtLink>

      <div class="flex items-center gap-4 mx-auto">
        <NuxtLink class="nav-link" to="/inspiration">Inspiration</NuxtLink>
        <NuxtLink class="nav-link" to="/partners">Partners</NuxtLink>
        <NuxtLink class="nav-link" to="/community">Community</NuxtLink>
        <NuxtLink class="nav-link" to="/about">About</NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <UInput size="sm" placeholder="Search..." />
        <UDropdownMenu :items="userMenuItems">
          <UAvatar size="sm" />
        </UDropdownMenu>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const userMenuItems = [
  [
    { label: 'Profile', to: '#' },
    { label: 'Sign Out', to: '#' },
  ],
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

  /* Colour blind colours -- PROTANOPIA */
  --jungle-green--cb: #141421;
  --un-blue--cb: #7576B6;
  --txt-colour--cb: #F1F1F6;
  --chestnut--cb: #747440;
  --sunburst--cb: #92914E;
}

.nav-link {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.15s;
}

.nav-link:hover {
  color: #fff;
}

</style>
