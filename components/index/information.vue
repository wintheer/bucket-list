<template>
  <b-container class="bucket-info" fluid>
    <b-row class="h-100" align-v="center">
      <b-col class="goals">Set your own goals.</b-col>
      
      <b-col class="tracking">Track, update and share your goals.</b-col>

      <b-col class="inspiration">Get inspiration from more than 200 different categories.</b-col>

      <b-col class="community">Share your experiences with the bucket-list community.</b-col>

    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: "index-information",
})
</script>

<style scoped>
.bucket-info {
  text-align: center;
  width: 100vw;
  height: 7rem;
}
</style>