<template>
  <v-parallax src="/bg-1.png">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h3 class="text-h4 font-weight-bold">
            Reviving Heritage, Connecting Generations
          </h3>
          <p class="text-h6 mt-4 mb-8">
            Preserving temples, fostering cultural identity, and revitalizing traditions
            for future generations.
          </p>
          <v-btn color="primary" class="mr-4">Learn More</v-btn>
          <v-btn color="secondary">Donate Now</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <div id="mission" class="text-h4" style="color: hsl(20, 7.9%, 14.9%)">
            Our Mission
          </div>
          <p class="mb-2 mt-2 text-h6 text-black">
            We are dedicated to preserving our cultural heritage through conservation,
            revitalization, and innovative outreach.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <h2 class="text-h4 text-center mb-8 text-black">Our Initiatives</h2>
      <v-row align="center" justify="center" no-gutters>
        <v-col
          class="d-flex justify-center"
          v-for="program in programs"
          :key="program.title"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="3"
        >
          <v-card
            height="260px"
            width="275px"
            class="d-flex flex-column align-center justify-center ma-3 opacity-80 rounded-xl"
          >
            <div class="text-center mt-2">
              <v-icon color="orange-darken-2" size="x-large">{{ program.icon }}</v-icon>
            </div>
            <v-card-title class="text-center text-h6 mt-2">{{
              program.title
            }}</v-card-title>
            <v-card-text class="text-center">{{ program.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!---  Setting Temple -->

    <!---  End Setting Temple -->
    <v-container>
      <v-card class="mx-auto" max-width="400">
        <v-img class="align-end text-white" height="200" src="/ayodhya.jpg" cover>
          <v-card-title class="justify-center text-center text-black"></v-card-title>
        </v-img>
        <v-card-text>
          <v-select
            v-model="select"
            :items="localStore.TIDs"
            item-title="name_en"
            item-value="TID"
            label="Select Temple"
            persistent-hint
            single-line
            return-object
            density="compact"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="#A64833" @click="navigate_home(select, 1)" variant="elevated">
            Temple Page UX 1<v-icon> mdi-arrow-right-bold </v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-actions class="justify-center">
          <v-btn
            color="#A64833"
            @click="navigate_home(select, 2)"
            variant="elevated"
            prepend-icon="mdi-archive"
          >
            Temple Directory(List)<v-icon> mdi-arrow-right-bold </v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-actions class="justify-center">
          <v-btn
            color="#A64833"
            @click="navigate_home(select, 3)"
            variant="elevated"
            prepend-icon="mdi-google-maps"
          >
            Temple Directory(Map) <v-icon> mdi-arrow-right-bold </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-parallax>

  <!-- Footer -->
  <v-footer v-if="$vuetify.display.mdAndUp" app class="gradiant" style="padding: 10px 0">
    <v-container>
      <v-row class="mt-n8 mb-n8">
        <v-col cols="12" sm="6" md="4" lg="3" xl="3" v-if="$vuetify.display.mdAndUp">
          <h4 style="margin-bottom: 8px; font-size: 16px">Quick Links</h4>
          <v-btn
            size="small"
            to="#about-us"
            color="#8C4C27"
            class="mr-2"
            style="font-size: 12px; padding: 4px"
            >About Us</v-btn
          >
          <v-btn
            size="small"
            to="#mission"
            color="#8C4C27"
            style="font-size: 12px; padding: 4px"
            >Our Mission</v-btn
          >
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
          <h4 style="margin-bottom: 8px; font-size: 16px">Contact Us</h4>
          <p class="text-body-2 mb-1" style="margin: 0; font-size: 14px">
            Email: info@heritage.org
          </p>
          <p class="text-body-2" style="margin: 0; font-size: 14px">
            Phone: +91-9876543210
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
          <h5 style="margin-bottom: 8px; font-size: 16px">Subscribe</h5>
          <v-text-field
            label="Email Address"
            density="compact"
            variant="outlined"
            class="mb-n4 text-caption"
            clearable
          ></v-text-field>
          <v-btn color="#A64833" size="small" style="font-size: 12px; padding: 4px"
            >Subscribe</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
<script setup>
definePageMeta({
  layout: "empty",
  middleware: "auth",
});

import { dbStore } from "@/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "@/stores/localStore.js";
const select = ref("");
const localStore = useLocalStore();
// localStore.setTempleID("T0002");

// onMounted(async () => {
//   try {
//     if (!localStore.RunOnce) {
//       await localStore.Fetch_TIDs();
//       localStore.setRunOnce(true);
//     } else {
//       alert(` home ${localStore.templeID} ${localStore.RunOnce}`);
//       select.value = await localStore.TIDs.find(
//         (entry) => entry.TID === localStore.templeID
//       ); // You can change the index or logic for a different default
//     }

//     // select.value = await localStore.TIDs.find(
//     //   (entry) => entry.TID === localStore.templeID
//     // ); // You can change the index or logic for a different default
//   } catch (error) {
//     console.error("Error fetching offers:", error);
//   }
// });

onMounted(async () => {
  await await localStore.Fetch_TIDs();
  select.value = localStore.TIDs.find((entry) => entry.TID === localStore.templeID);
});

const navigate_home = (selected, option) => {
  if (!selected) {
    alert("select one temple to start");
    return;
  }
  localStore.setTempleID(selected.TID);
  // option == 1 ? navigateTo("/TempleIndex") : navigateTo("/tmp/home4");

  switch (option) {
    case 1:
      navigateTo("/TempleIndex");
      break;
    case 2:
      navigateTo("/tmp/card_temples");
      break;
    default:
      navigateTo("/tmp/MapCluster");
      break;
  }
};

const programs = [
  {
    title: "Heritage Conservation",
    description: "Restoring ancient temples.",
    image: "/logo-9-tr.png",
    icon: "mdi-temple-hindu",
  },
  {
    title: "Cultural Revival",
    description: "Workshops and festivals.",
    image: "/logo-9-tr.png",
    icon: "mdi-hand-heart",
  },
  {
    title: "Infrastructure Development",
    description: "Building roads and facilities.",
    image: "/logo-9-tr.png",
    icon: "mdi-road",
  },
  {
    title: "Digital Outreach",
    description: "Interactive platforms.",
    image: "/logo-9-tr.png",
    icon: "mdi-web",
  },
];
</script>
<style scoped>
.gradiant {
  background: linear-gradient(90deg, #f2dfa7, #a64833, #f2dfa7);
}
.feature-card {
  box-shadow: 5px 5px 5px rgba(14, 14, 14, 0.8), -5px -5px 10px rgba(6, 6, 6, 0.8);
}
</style>
