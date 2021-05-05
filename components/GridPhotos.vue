<template>
  <v-container>
    <div :style="gridStyle" v-if="collection">
      <div
        class="griditem"
        v-for="(col, i) in collection"
        :key="i"
        :style="col.group ? 'grid-column-end: span 2;' : ''"
      >
        <v-card
          elevation="2"
          tile
          :class="col.group ? 'd-flex flex-column align-end' : null"
          exact
          :to="'/' + col.fullPath"
        >
          <img :src="col.url" width="100%" />
          <v-card-subtitle :style="col.group ? style : null">
            <v-row>
              <v-col
                cols="6"
                class="text-body-2 text-uppercase font-weight-bold"
              >
                <p
                  style="height: 3em; overflow: hidden"
                  class="mb-0"
                  :title="col.title"
                >
                  {{ col.title }}
                </p>
                <p
                  v-if="col.title.length > 13"
                  class="d-inline"
                  :title="col.title"
                >
                  ... <v-icon small>mdi-information-variant</v-icon>
                </p>
              </v-col>
              <v-col cols="3" class="caption text-right error--text">
                {{ col.views }} <v-icon x-small color="error">mdi-eye</v-icon>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text
            style="background-color: lightgray; width: 100%"
            class="pa-0"
            :style="col.group ? style : null"
          >
            <v-sheet
              color="grey"
              height="20"
              :width="col.views == 0 ? 1 : (col.likes / col.views) * 100"
              min-width="1px"
            ></v-sheet></v-card-text
        ></v-card>
      </div>
    </div>
    <p v-else class="mt-8 caption text-center">no existing uploads</p>
  </v-container>
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
      style: 'width:50%; background-color: white; float:right;',
      gridStyle:
        'display: grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: auto; gap: 10px; grid-auto-flow: dense;',
    }
  },
}
</script>