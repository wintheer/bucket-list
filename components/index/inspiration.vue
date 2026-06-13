<template>
  <div>
    <h2>{{ header }}</h2>
    <UCarousel
      :items="images"
      :ui="{ item: 'basis-1/4' }"
      class="px-16 overflow-hidden"
    >
      <template #default="{ item }">
        <UCard class="rounded-corner overflow-hidden">
          <template #header>
            <img :src="item.src" :alt="item.alt" class="w-full">
          </template>
          {{ item.text }}
        </UCard>
      </template>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header: string
}>()

const images = [
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png', alt: 'a boat', text: 'This is a boat' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: 'goldhill', text: 'This is a hill' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png', alt: 'fruits', text: 'These are fruits' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: 'goldhill', text: 'This is a hill' },
]
</script>

<style scoped>

.card-img, .rounded-corner {
	border-radius: 10px;
	border: none;
}

h2 {
	margin: 1rem 4rem;
}
</style>