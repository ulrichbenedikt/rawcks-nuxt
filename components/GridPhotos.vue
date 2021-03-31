<template>
  <v-container>
    <v-row v-if="collection">
      <v-col v-for="(col, i) in collection" :key="i" cols="12" md="3">
        <v-card elevation="0" tile>
          <img :src="col.url" width="100%" />
          <v-card-subtitle class="pa-0 pt-1 mb-2">
            <v-row>
              <v-col
                cols="6"
                class="text-body-2 text-uppercase font-weight-bold"
              >
                {{ col.title }}
              </v-col>
              <v-col cols="6" class="caption text-right error--text">
                {{ col.views }} <v-icon x-small color="error">mdi-eye</v-icon>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text
            style="background-color: lightgray; width: 100%"
            class="pa-0"
          >
            <v-sheet
              color="grey"
              height="20"
              :width="col.views == 0 ? 1 : (col.likes / col.views) * 100"
              min-width="1px"
            ></v-sheet></v-card-text></v-card></v-col
    ></v-row>
    <p v-else class="mt-8 caption text-center">
      no existing uploads
    </p></v-container
  >
</template>

<script>
export default {
  props: {
    collection: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      h: '100%',
    }
  },
}
</script>