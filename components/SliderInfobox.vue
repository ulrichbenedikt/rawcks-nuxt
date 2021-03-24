<template>
  <v-container
    style="position: absolute; bottom: 14px; right: 4px; width: 400px"
  >
    <v-card style="background-color: rgba(0, 0, 0, 0.2)" dark>
      <v-card-title class="text-h6">
        {{ slidesInfos.title }}
      </v-card-title>

      <v-card-subtitle>by {{ slidesInfos.photographer }}</v-card-subtitle>

      <v-card-actions>
        <v-btn plain class="caption"> go to photographer </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'SlidesInfobox',
  props: {
    slidesInfos: {
      type: Object,
      default: {},
    },
  },
}
</script>