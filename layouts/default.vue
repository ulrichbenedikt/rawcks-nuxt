<template>
  <v-app>
    <v-expand-transition>
      <Slideshow
        v-show="showSlideshow"
        :slides="slides"
        :show.sync="showSlideshow"
        class="mx-auto secondary"
        style="height: 100vh"
      />
    </v-expand-transition>
    <v-expand-transition>
      <v-card class="overflow-hidden" v-show="!showSlideshow">
        <v-app-bar
          absolute
          color="#000000"
          dark
          shrink-on-scroll
          prominent
          :src="slides[0].url"
          fade-img-on-scroll
          scroll-target="#scrolling-techniques-5"
          scroll-threshold="500"
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
            ></v-img>
          </template>

          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>

          <v-app-bar-title
            ><v-btn
              to="/"
              nuxt
              exact
              class="ma-0 pa-0 text-h4"
              width="auto"
              height="100%"
              :ripple="false"
              plain
              >{{ title }}</v-btn
            ></v-app-bar-title
          >

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn
            icon
            v-if="!showSlideshow"
            @click="showSlideshow = !showSlideshow"
          >
            <v-icon>mdi-arrow-expand</v-icon>
          </v-btn>
        </v-app-bar>
        <v-sheet
          id="scrolling-techniques-5"
          class="overflow-y-auto"
          max-height="100vh"
        >
          <v-main style="height: 100%; min-height: 100vh; margin-top: 128px">
            <v-container>
              <nuxt />
            </v-container>
          </v-main>
        </v-sheet>
        <v-navigation-drawer v-model="drawer" fixed temporary app>
          <NavList />
        </v-navigation-drawer>

        <v-footer :absolute="!fixed" app>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-card>
    </v-expand-transition>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      showSlideshow: false,
      fixed: false,
      slides: [
        {
          title: 'You Are',
          url: 'https://images.unsplash.com/photo-1616442751986-fe0df84ad730',
          photographer: 'stefan moertl',
        },
        {
          title: 'Art',
          url: 'https://images.unsplash.com/photo-1616361889157-7b095931aea5',
          photographer: 'Paweł Czerwiński',
        },
        {
          title: 'Person',
          url: 'https://images.unsplash.com/photo-1616467632393-4dffad0c27f4',
          photographer: 'Lee Chinyama',
        },
      ],
      title: 'RAWCKS',
      user: this.$store.state.modules.user,
    }
  },
}
</script>
