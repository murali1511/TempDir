<template>
  <v-container fluid class="pa-0">
    <div class="">
      <v-card>
        <v-card-title class="d-flex align-center bg-orange">
          <div class="font-weight-bold text-subtitle-1">
            <v-icon class="mr-2">mdi-map-search</v-icon>
            {{ $t("local_attractions_h1") }}
          </div>
        </v-card-title>
      </v-card>

      <v-card class="mx-auto rounded-lg g_border mt-2">
        <v-list class="bg-yellow-lighten-4">
          <v-list-item
            v-for="(attraction, index) in sortedAttractions(
              localStore.attractions.attractions
            )"
            :key="index"
            class="pa-3 list-item mt-n2"
            :class="$vuetify.display.smAndUp ? 'ml-5 mr-5' : ''"
          >
            <!-- main content -->
            <v-list-item-content class="ps-0">
              <!-- title row: title (truncated) + map icon aligned right -->
              <div class="title-row">
                <div class="title-text text-subtitle-2 font-weight-bold">
                  <v-avatar size="28" class="me-1" color="red" text-color="white">
                    {{ index + 1 }}
                  </v-avatar>
                  {{ attraction.title }}
                </div>
              </div>

              <!-- address (up to 2 lines) -->

              <div
                :class="[
                  'address  mt-1 ml-9',
                  $i18n.locale.value === 'en'
                    ? 'text-body-2 text-justify'
                    : 'text-caption text-left',
                ]"
              >
                {{ attraction.description }}
              </div>

              <!-- distance -->
              <div class="mt-2 text-body-2 font-weight-medium ml-9">
                {{
                  `${$i18n.locale.value === "en" ? "Distance" : "ദൂരം"}: ${
                    attraction.distance
                  } ${$i18n.locale.value === "en" ? "km" : "കി.മി "}`
                }}
              </div>

              <v-divider thickness="3" class="mt-2" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";
import { get_NearestTemples } from "/utils/nearest_n_temples.js";

const localStore = useLocalStore();
const tooltipReveal = ref(false);
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const sortedAttractions = (attractions) => {
  return attractions.slice().sort((a, b) => a.distance - b.distance);
};

onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Attractions(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});

const openGoogleMaps = (lat, lng, name) => {
  const encodedName = encodeURIComponent(name);
  // Format: name+@latitude,longitude
  const url = `https://www.google.com/maps/search/${encodedName}+@${lat},${lng}`;
  window.open(url, "_blank");
};
</script>

<style scoped>
.temple-theme {
  background-color: #fff6e0;
}

.temple-header {
  background-image: url("/images/temple-background.jpg");
  background-size: cover;
  background-blend-mode: multiply;
}

<style scoped > .list-item {
  align-items: flex-start;
}

/* Title row: keep icon fixed and let title take remaining space and truncate */
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Title text truncation (single line) */
.title-text {
  flex: 1 1 auto;
  min-width: 0; /* required for ellipsis to work in flexbox */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Map button stays compact */
.map-btn {
  flex: 0 0 auto;
}

/* Address: allow up to 2 lines with ellipsis */
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

/* Minor spacing tweaks */
.v-divider[inset] {
  margin-left: 36px; /* aligns divider with content, adjust to match avatar width + gap */
}
</style>
