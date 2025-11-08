<template>
  <v-card    class="card_radiant"
>
    <v-data-iterator :items="filteredTemples" :items-per-page="6" :search="search">
      <template v-slot:header>
        <v-toolbar class="px-2 card_radiant">
          <v-text-field
            v-model="search"
            density="compact"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 400px"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>

          <v-text-field
            class="ml-2 number-input"
            v-model="geo_distance"
            prepend-inner-icon="mdi-road"
            density="compact"
            style="max-width: 140px"
            type="number"
            variant="solo"
            hide-details
            single-line
             prefix="km"
             step="0.5"
      min="0"
          </v-text-field>
          <template v-slot:prepend-inner>
    <span class="text-grey-darken-1">km</span>
  </template> 
  
     <v-combobox
          v-if='$vuetify.display.smAndUp'
          v-model="selected_diety"
          :items="dieties_list"
               placeholder="Dieties"
          style="max-width: 260px"
          class="ml-2 mt-6"
          density="compact"
          variant="solo"
          prepend-inner-icon="mdi-temple-hindu"
          chips
            closable-chips
        ></v-combobox>



<!-- Navigation Drawer -->
 
   <!-- Navigation Drawer End-->   


        </v-toolbar>

      </template>

      <template v-slot:default="{ items }">
        <v-container class="pa-2" fluid >
          <v-row dense>
            <v-col
              v-for="(item, index) in items"
              :key="index"
              cols="auto"
              sm="6"
              md="4"
              lg="4"
              xl="4"
            >
              <v-card
                class="pb-3 mb-3 feature-card "
                border
                flat
                :style="{
                  maxWidth: $vuetify.display.smAndUp ? '480px' : '100%', background: colorScheme[0]
                }"
                :min-height="'375px'"
              >
            <v-img
  :src="`/images/${item.raw.home_pic}.jpg`"
  width="526"
  height="200"
  cover
></v-img>
                <v-card-title class="mt-n2 text-subtitle-1">{{ item.raw.name }}</v-card-title>
                <v-card-subtitle class="mt-n2 text-subtitle-2">{{ item.raw.address }}</v-card-subtitle>

<v-list-item>
                  <v-card min-height="100" :color="colorScheme[0]">
                    <p class="mb-2 text-subtitle-2 mt-n1">{{ item.raw.status }}</p>
                        <span class="mb-2 text-body-2 mt-1 text-capitalize">
                      <v-btn density="compact" color="black" size="small" icon=" mdi-temple-hindu"></v-btn> 
                     
                      {{item.raw.deity }}
                    </span>
                    <span class="ml-2 text-caption mt-1">
                      <v-btn density="compact" size="small" color="black" icon="mdi-map-marker-outline" @click="openGoogleMaps(item.raw.coordinates[1],item.raw.coordinates[0],item.raw.name)"></v-btn> 
                      {{
                        calculateDistance(
                          lat1,
                          lon1,
                          item.raw.coordinates[1],
                          item.raw.coordinates[0]
                        ).toFixed(2)
                      }}
                      km 
                      </span>
                      <span>
                       <v-icon icon="mdi-clock" start></v-icon>
                   <span class="text-caption mt-1 ml-n1">{{ `${item.raw.pooja_schedule[0]} ${item.raw.pooja_schedule[1]}`}}</span>
                      </span>
                  </v-card>
                </v-list-item>
  <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-clock" start></v-icon>
                    <div class="text-truncate">{{ item.raw.TID }}</div>
                  </div>
<v-btn
  class="text-none bg-black"
  @click="navigate_home(item.raw.TID)"
  size="small"
  elevation="24"
  border
  @mouseover="hover = true"
  @mouseleave="hover = false"
>
  Read
</v-btn>

                </div>

              
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            icon="mdi-arrow-left"
            variant="tonal"
            rounded
            @click="prevPage"
          ></v-btn>

          <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>

          <v-btn
            :disabled="page >= pageCount"
            density="comfortable"
            icon="mdi-arrow-right"
            variant="tonal"
            rounded
            @click="nextPage"
          ></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script setup>
definePageMeta({
  layout: "group",
  middleware: "auth",
});

import { ref, onMounted } from "vue";
import { useLocalStore } from "/stores/localStore.js";
import features from "/stores/stores_geojson.js"
import { dbStore } from "~/composables/dbStore";
import breadcrumb from "@/components/breadcrump.vue";
import { useMapStore } from "/stores/mapStore.js";

const localStore = useLocalStore();
const mapStore = useMapStore();

const temples = features
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
// const colorScheme = ["#FFD700", "#ecf0f1"];
const hover = ref(false)
const selected_diety = ref(null)


const search = ref("");
const geo_distance = ref((parseFloat(0).toFixed(1)));
const lat1 = ref(0); // User's latitude
const lon1 = ref(0); // User's longitude

// Watch for changes to geo_distance
watch(geo_distance, (newValue) => {
  if (newValue < 0) {
    geo_distance.value = 0; // Reset to 0 if the value is negative
      }
  geo_distance.value = (parseFloat(geo_distance.value)).toFixed(1);
});



const GetMyLocationPromise = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
};

onMounted(() => {
  // GetMyLocationPromise()
  //   .then((position) => {
  //     lat1.value = position.coords.latitude;
  //     lon1.value = position.coords.longitude;
  //   })
  //   .catch((error) => {
  //     console.error("Failed to retrieve location:", error.message);
  //   });
    lat1.value = mapStore.Currentlocation[1]
        lon1.value = mapStore.Currentlocation[0]
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};



// ✅ Computed Property to Filter & Sort Games Based on Distance
const filteredTemples = computed(() => {
  return temples.features
    .map((item) => {
      // Calculate distance for each item
      const distance = calculateDistance(
        lat1.value,
        lon1.value,
        item.geometry.coordinates[1],
        item.geometry.coordinates[0]
      );
      return { 
        coordinates: item.geometry.coordinates,
        home_pic: item.properties.home_pic,
        TID: item.properties.TID,
        phone:item.properties.phone,
        name: item.properties.name,
        address: item.properties.address,
        city: item.properties.city,
        ward: item.properties.ward,
        village: item.properties.village,
        panchayath: item.properties.panchayath,
        taluk: item.properties.taluk,
        district: item.properties.district,
        country: item.properties.country,
        postalCode: item.properties.postalCode,
        state: item.properties.state,
        deity: item.properties.diety.main,
         pooja_schedule: item.pooja_schedule,
        distance }; // Add distance property
    })
    .filter((item) =>  geo_distance.value == 0 ? true : item.distance <= geo_distance.value) // Filter by user-selected distance
    .sort((a, b) => a.distance - b.distance); // ✅ Sort by distance
});


console.log("filteredTemples=>",filteredTemples.value)

const navigate_home = (selected) => {
  if (selected !=="") {
     localStore.setTempleID(selected);
     localStore.setTemplesSource('/tmp/card_temples')
     navigateTo("/tmp/home4");
  } else {
     alert("No Details Available for the selected temple")
  }
};

const openGoogleMaps = (lat,lng,name) => {
  const encodedName = encodeURIComponent(name);
  // Format: name+@latitude,longitude
  const url = `https://www.google.com/maps/search/${encodedName}+@${lat},${lng}`;
  window.open(url, '_blank');
};

const breadcrumbs_items = computed(() => [
  { title: "Home", href: "/" },
  { title: "Temples Directory", href: "/tmp/card_temples" },
]);

// Dieties List

const addAllOption = (arr) => [  ...arr.filter((v, i, a) => a.indexOf(v) === i)];
const dieties_list = addAllOption(temples.features.map((i) => i.properties.diety.main));
//

</script>

<style scoped>
.feature-card {
  box-shadow: 5px 5px 5px rgba(14, 14, 14, 0.8), -5px -5px 10px rgba(6, 6, 6, 0.8);
}

.justify-text {
  text-align: justify;
  max-width: 480px;
}
.card_radiant {
background: linear-gradient(to right,  #735943,v-bind(colorScheme[1]),v-bind(colorScheme[0]),v-bind(colorScheme[1]),#735943)
}
</style>
