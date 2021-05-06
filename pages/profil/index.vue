<template>
  <v-container>
    <h1 class="text-h1">Dashboard</h1>
    <v-subheader>What to do</v-subheader>
    <v-row>
      <v-col cols="4">
        <v-card class="mx-auto" max-width="344">
          <v-img src="/lory-Vei-eKMKR40-unsplash.jpg" height="150px"></v-img>

          <v-card-title> Upload Photos </v-card-title>

          <v-card-subtitle>
            Upload your Photos and create Collections or Rolls.</v-card-subtitle
          >

          <v-card-actions>
            <v-btn color="primary" to="/profil/photos" text> Continue </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto" max-width="344" disabled>
          <v-img
            src="/norbert-kundrak-LJcB7n2F3UQ-unsplash.jpg"
            height="150px"
          ></v-img>

          <v-card-title> Change Settings </v-card-title>

          <v-card-subtitle>
            Overview of your money and your profile settings.</v-card-subtitle
          >

          <v-card-actions>
            <v-btn color="primary" text> Continue </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto" max-width="344">
          <v-img
            src="/clem-onojeghuo-xJXxMR5PXoY-unsplash.jpg"
            height="150px"
          ></v-img>

          <v-card-title> Search Photos </v-card-title>

          <v-card-subtitle>
            Browse through photos, collections and rolls of our community.
          </v-card-subtitle>

          <v-card-actions>
            <v-btn color="primary" text to="/"> Continue </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-subheader>Statistics</v-subheader>
    <v-row
      ><v-col>
        <v-card>
          <v-sparkline
            :value="value"
            smooth="50"
            padding="8"
            :fill="fill"
            color="secondary"
            stroke-linecap="round"
            label-size="4"
            height="100%"
            auto-draw
          >
            <template v-slot:label="item" class="caption text-h6">
              ${{ item.value }}
            </template>
          </v-sparkline>
          <v-container class="pt-0">
            <v-divider></v-divider>
            <div class="px-2 d-flex justify-space-between">
              <p class="caption">Jan. 2020</p>
              <p class="caption">Jan. 2021</p>
            </div>
            <v-subheader class="px-2 text--center"
              >Your earnings this year</v-subheader
            >
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      fill: true,
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    }
  },
}
</script>
