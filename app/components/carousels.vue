<template>  
      <v-carousel
        cycle
        :height="$vuetify.display.smAndUp ? '450px' : '350px'"
        hide-delimiter-background
        show-arrows="hover"
      > 

      <template v-slot:prev="{ props }">
       <v-btn density="comfortable" icon="mdi-arrow-left" variant="text"
        @click="props.onClick"
      ></v-btn>
    </template>
    <template v-slot:next="{ props }">
       <v-btn density="comfortable" icon="mdi-arrow-right" variant="text"
        @click="props.onClick"
      ></v-btn>
    </template>
    
        <v-carousel-item
          v-for="(slide, i) in ($i18n.locale.value == 'en'
            ? localStore.carouselDetail.en
            : localStore.carouselDetail.ml) || carouselData"
          :key="i"
          :src="getPicImage(slide.image)"
          class="g_border rounded-lg"
          position="center"
        >
          <v-sheet
            height="100%"
            class="d-flex align-center justify-center"
            color="rgba(0, 0, 0, 0.5)"
          >
            <div class="text-center">
              <p
                class="text-white mb-4"
                :class="$vuetify.display.smAndUp ? 'text-h6' : 'text-body-1 '"
              >
                {{ slide.title }}
                <div v-if="Object.keys(localStore.carouselDetail).length === 0"> No Temple Selected
                <v-btn
        :color="colorScheme[0]"
        variant="elevated"
        prepend-icon="mdi-home"
        to="/"
        max-width="400px"
        min-width="125px"
        class="mx-auto  mt-5  d-flex"
      >
        Home
      </v-btn>
</div>
              </p>
              <p
                class="text-white"
                :class="$vuetify.display.smAndUp ? 'text-h6' : 'text-body-1 '"
              >
                {{ slide.description }}
              </p>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
   
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
<style global>
.g_border {
  border: 3px solid rgb(17, 16, 16); /* Adds a solid red border with 4px width */
}
.multi-line {
  white-space: normal !important; /* Ensures text wraps to multiple lines */
  overflow: visible !important; /* Removes truncation or ellipsis */
  text-overflow: clip !important; /* Prevents ellipsis from being applied */
}
</style>
