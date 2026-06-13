<template>
  <div>
    <div class="content">
      <div class="header">
        <h1>Find a purpose in your life</h1>
      </div>
      <Splide :options="splideOptions">
        <SplideSlide v-for="(image, index) in images" :key="index">
          <img class="image-fill" :src="image.src" :alt="image.alt">
        </SplideSlide>
      </Splide>
      <IndexInformation />
      <div class="container mx-auto">
        <div class="text-center">
          <UButton class="m-4" size="lg">Start your journey now</UButton>
        </div>
      </div>
      <IndexInspiration style="margin-top: 4rem" header="Inspiration" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Splide, SplideSlide } from '@splidejs/vue-splide'

const images = [
  { src: '/assets/perform.jpg', alt: 'performing' },
  { src: '/assets/cliff-dive.jpg', alt: 'cliff diving' },
  { src: '/assets/piano.jpg', alt: 'playing piano' },
]

const splideOptions = {
  height: '50vh',
  gap: '1rem',
  type: 'loop',
  focus: 'center',
  perPage: 3,
  perMove: 1,
  autoplay: true,
  autoWidth: true,
}
</script>

<style scoped>
h1 {
  font-size: 2rem;
  color: var(--txt-colour);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
}

.content {
  height: 80vh;
}

.image-fill {
  height: 100%;

}

.header {
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 3;
  padding-top: 5vh;
  justify-content: center;
  align-items: center;
}

</style>
