<template>
  <div>
    <h2>{{ header }}</h2>
    <Splide :options="splideOptions">
      <SplideSlide v-for="(image, index) in images" :key="index">
        <UCard class="rounded-corner overflow-hidden">
          <template #header>
            <img :src="image.src" :alt="image.alt" class="w-full">
          </template>
          {{ image.text }}
        </UCard>
      </SplideSlide>
    </Splide>
  </div>
</template>

<script setup lang="ts">
import { Splide, SplideSlide } from '@splidejs/vue-splide'

defineProps<{
  header: string
}>()

const images = [
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png', alt: 'a boat', text: 'This is a boat' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: 'goldhill', text: 'This is a hill' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png', alt: 'fruits', text: 'These are fruits' },
  { src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: 'goldhill', text: 'This is a hill' },
]

const splideOptions = {
  perPage: 4,
  perMove: 1,
  gap: '1rem',
  padding: '4rem',
  arrows: false,
}
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