<template>
  <v-theme-provider theme="dark">
    <!-- Temple Origins Section -->
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="5" color="#F2DFA7" class="pa-2 g_border rounded-lg">
          <v-card-title
            class="font-weight-bold d-flex justify-space-between align-center dynamic-subtitle"
          >
            About the Temple
          </v-card-title>
          <v-card-text>
            <v-divider class="mt-n2 mb-3"></v-divider>

            <div
              :class="
                $i18n.locale.value === 'en'
                  ? 'text-body-1 text-justify'
                  : 'text-caption  '
              "
              class="compressed-text"
              v-html="aboutContent"
            ></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
// Import the temple data
import { ref, onMounted, watchEffect } from "vue";
import { useRuntimeConfig } from "#app";
import { useDate } from "vuetify";
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

const aboutContent = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const about = localStore.about;

  aboutContent.value =
    locale === "en"
      ? about?.en || "Content not available in English."
      : about?.ml || "Content not available in Malayalam.";
});

const date = useDate();

// Lifecycle hook to fetch data when component is mounted
onMounted(() => {});

// Store the data in a reactive variable
// const aboutTemple= $i18n.locale.value === 'en' ? aboutData.en : aboutData.ml);
</script>

<style>
.v-card-title {
  font-weight: bold;
  font-size: 1.25rem;
}

.v-card-text {
  line-height: 1.6;
}

.v-card-subtitle {
  font-size: 1.1rem;
  margin-top: 20px;
}

.v-list-item-content {
  margin-bottom: 10px;
}

.dynamic-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: bold;
  /* Make the title bold */
}

.dynamic-subtitle {
  font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: normal;
  /* Make the title bold */
}

.dynamic-sub-subtitle {
  font-size: clamp(0.95rem, 3.5vw, 1.3rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: bold;
  /* Make the title bold */
}

.no-margin {
  margin: 0;
  /* Removes all margins */
}
.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
  color: black;
}
.compressed-text {
  letter-spacing: -0.5px; /* Reduce letter spacing */
}
</style>
