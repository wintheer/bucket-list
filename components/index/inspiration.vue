<template>
  <div>
			<h2>{{header}}</h2>
			<Splide :options="splideOptions">
				<SplideSlide v-for="(image, index) in images" :key="index">
					<b-card class="rounded-corner" :img-src="image.src" :img-alt="image.alt">
						
							{{image.text}}
						
					</b-card>
				</SplideSlide>
			</Splide>
	</div>
</template>

<script lang="ts">
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Vue from 'vue';

export default Vue.extend({
  name: "index-inspiration",
	components: {
		Splide,
    SplideSlide,
	},
	data() {
		return {
			images: [
				{src: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png', alt: "a boat", text: "This is a boat"},
				{src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: "goldhill", text: "This is a hill"},
				{src: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png', alt: "fruits", text: "These are fruits"},
				{src: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png', alt: "goldhill", text: "This is a hill"},
			],
			splideOptions: {
				perPage: 4,
				perMove: 1, 
				gap: '1rem',
				padding: '4rem',
				arrows: false
			},
		}
	},
	props: [
		'header'
	]
})
</script>

<style scoped>

.card-img, .rounded-corner {
	border-radius: 10px;
	border: none;
}

h2 {
	margin: 1rem 4rem;
}
    
.card-body {
	padding: 5px
}
</style>