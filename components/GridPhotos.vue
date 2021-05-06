<template>
  <v-container>
    <div :style="gridStyle" v-if="collection.length > 0">
      <div
        class="griditem"
        v-for="(col, i) in collection"
        :key="i"
        :style="col.group ? 'grid-column-end: span 2;' : ''"
      >
        <v-card elevation="0" :to="'/users/' + col.fullPath">
          <img :src="col.url" width="100%"
        /></v-card>
        <v-card
          elevation="0"
          tile
          :class="col.group ? 'd-flex flex-column' : null"
          :style="col.group ? style : ''"
          exact
          :width="col.group ? '50%' : '100%'"
          :to="'/users/' + col.fullPath"
        >
          <v-card-subtitle
            class="pa-0 d-flex text-body-2 text-uppercase font-weight-bold"
          >
            <p :title="col.title">
              {{ col.title }}
            </p>
            <v-spacer />
            <p cols="3" class="caption text-right error--text">
              {{ col.views.length }}
              <v-icon x-small color="error">mdi-eye</v-icon>
            </p>
          </v-card-subtitle>
          <v-card-text
            style="background-color: lightgray; width: 100%"
            class="pa-0"
          >
            <v-sheet
              color="grey"
              height="20"
              :width="col.views == 0 ? 1 : (col.likes / col.views) * 100"
              min-width="3px"
            ></v-sheet></v-card-text
        ></v-card>
      </div>
    </div>
    <p v-else class="mt-8 caption text-center">no existing photos</p>
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
      style:
        'width:50%; background-color: white; float:right; padding: 10px 1px 10px 10px; transform: translateY(-50%); margin-right: -1px;',
      gridStyle:
        'display: grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: auto; gap: 10px; grid-auto-flow: dense;',
    }
  },
}
</script>