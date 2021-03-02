<template>
  <div>
    <div class="content">
      <div class="header">
        <h1>Find a purpose in your life</h1>
      </div>

      
        
        <div class="inspiration-images_left">
          <img class="image-fill" src="../assets/cliff-dive.jpg" alt="">
        </div>
        <button class="arrow left">
          <ArrowButton/>
        </button>
        <div class="inspiration-images_middle">
          <img class="image-fill" src="../assets/perform.jpg" alt="">
        </div>
        <button class="arrow right">
          <ArrowButton/>
        </button>
        <div class="inspiration-images_right">
          <img class="image-fill" src="../assets/piano.jpg" alt="">
        </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ArrowButton from "../assets/svgs/arrow.svg"

export default Vue.extend({
  components: {
    ArrowButton,
  }
});
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

button {
  background: transparent;
  border: 0;
  outline: 0;
}

path {
  transition: all 250ms ease-in-out;
}

.arrow {
  cursor: pointer;
  width: 70px;
  height: 90px;
  align-self: center;
  z-index: 2;
}

.left{
  grid-area: left;
  justify-self: end;
}

.right {
  grid-area: right;
  justify-self: start;
  transform: rotate(180deg);
}

.arrow:hover path {
  stroke-width: 6;
}

.arrow:active path {
  stroke-width: 8;
  transition: all 200ms ease-in-out;
}

@media screen and (max-width: 992px) {
  .content {
    grid-template-columns: 100vw;
  }

  .left {
    grid-area: left;
    justify-self: start;
  }

  .right {
    grid-area: left;
    justify-self: end;
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
