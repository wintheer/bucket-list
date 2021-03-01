<template>
  <div>
    <div class="content">
      <div class="header">
        <h1>Find a purpose in your life</h1>
      </div>

      
        
        <div class="inspiration-images_left">
          <img class="image-fill" src="../assets/cliff-dive.jpg" alt="">
        </div>
        
        <div class="inspiration-images_middle">
          <img class="image-fill" src="../assets/perform.jpg" alt="">
        </div>
        <div class="inspiration-images_right">
          <img class="image-fill" src="../assets/piano.jpg" alt="">
        </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style>
h1 {
  color: white;
  font-size: 3rem;
  text-shadow:
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
}

.content {
  display: grid;
  grid-template-columns: 1fr 40vw 1fr;
  grid-template-areas: "left middle right";


  justify-items: center;

  height: 50rem;

}

@media screen and (max-width: 992px) {
  .content {
    grid-template-columns: 100vw;
  }
}

.header {
  grid-area: middle;
  z-index: 2;
  padding-top: 10rem;
}

.inspiration-images_left {
  grid-area: left;
  
  width: 100%;

  overflow: hidden;
  display: flex;
  justify-content: center;
}

.inspiration-images_middle {
  grid-area: middle;
  width: 100%;

  overflow: hidden;
  display: flex;
  justify-content: center;
}

.inspiration-images_right {
  grid-area: right;
  width: 100%;

  overflow: hidden;
  display: flex;
  justify-content: center;
}

.image-fill {
  height: 100%;
  
}
</style>
