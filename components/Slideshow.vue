<template>
  <div>
    <v-carousel
      :cycle="show"
      height="100vh"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh"
      hide-delimiter-background
      hide-delimiters
      :show-arrows="showArrows"
      next-icon=""
      prev-icon=""
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <v-img :lazy-src="slide.url" :src="slide.url"></v-img>
            <SliderInfobox :slidesInfos="slide" />
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-btn
      icon
      v-if="show"
      @click="close"
      style="
        position: fixed;
        top: 0;
        right: 0;
        margin: 4px 4px;
        width: 48px;
        height: 48px;
      "
    >
      <v-icon color="white">mdi-arrow-collapse</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Slideshow',
  props: {
    slides: {
      type: Array,
      default: [],
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSlideshow: this.show,
      showArrows: false,
      colors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4',
      ],
      // slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    },
  },
}
</script>
