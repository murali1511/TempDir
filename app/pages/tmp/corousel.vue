<template>
  <v-container class="d-flex justify-center align-center carousel-container">
    <v-carousel hide-delimiters cycle height="400" class="carousel">
      <v-carousel-item
        v-for="(slide, i) in ($i18n.locale.value == 'en'
          ? localStore.carouselDetail.en
          : localStore.carouselDetail.ml) || carouselData"
        :key="i"
        :src="getPicImage(slide.image)"
        class="g_border rounded-lg"
      >
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
// Import the temple data
import { ref, onMounted, watchEffect } from "vue";

import { useDate } from "vuetify";
import { useRuntimeConfig } from "#app";
import { format } from "date-fns";
import { dbStore } from "~/composables/dbStore";
import { useLocalStore } from "/stores/localStore.js";
import { useRoute } from "vue-router";

const route = useRoute();
const carouselData = { title: "loading .....", description: "loading .....", image: "" };
const localStore = useLocalStore();

// await localStore.fetch_Carousel();

// Accessing the dynamic route parameter
// const paramdata = route.params.TID || "No Data Received";
// localStore.setTempleID(route.query.TID);

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme, role, set_role } = dbStore();
const db = useFirestore();

const date = useDate();

const active_role = ref(role.value);

// Lifecycle hook to fetch data when component is mounted
onMounted(() => {
  $i18n.setLocale(localStore.locale);
  // console.log("Shared data", sharedData);
});

const getPicImage = (image) => {
  return useAssets(`/assets/images/${image}`);
};

const color_scheme = {
  text_color: "#f2dfa7;",
  text_reverse: "#282828",
  bg_color: "#282828",
  bg_reverse: "#f2dfa7",
};
</script>

<style scoped>
.carousel-container {
  width: 80vw; /* Limit width to 80% of the viewport */
  margin: auto; /* Centering horizontally */
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel {
  max-width: 60vw; /* Adjust max width */
  border-radius: 12px; /* Smooth edges */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}
</style>
