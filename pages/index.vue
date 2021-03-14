<template>
  <div>
    <div class="content">
      <div class="header">
        <h1>Find a purpose in your life</h1>
        
        </div>
      <splide :options="splideOptions">
        <SplideSlide v-for="(image, index) in images" :key="index">
          <img class="image-fill" :src="image.src" alt="image.path">
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

export default Vue.extend({
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      images: [
        { src: require("../assets/perform.jpg") },
        { src: require("../assets/cliff-dive.jpg") },
        { src: require("../assets/piano.jpg") },
        
      ],
      splideOptions: {
        height: "60vh",
        gap: "2rem",
        type: 'loop',
        focus: 'center',
        perPage: 3,
        perMove: 1, 
        autoplay: true,
        autoWidth: true,
      }
    };
  },
});
</script>

<style>
h1 {
  color: var(--txt-colour);
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
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
  padding-top: 10vh;
  justify-content: center;
  align-items: center;
  
}
</style>
