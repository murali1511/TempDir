<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-card
          :class="[
            'mx-auto rounded-lg g_border',
            $vuetify.display.smAndUp ? 'ml-12 mr-12' : '',
          ]"
          :color="colorScheme[1]"
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1 grab"
            :style="`color: ${colorScheme[0]}`"
          >
            {{ $t("about_h1") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card class="mb-2" elevation="4" outlined :color="colorScheme[0]">
              <v-divider></v-divider>

              <v-card-text class="py-2 px-4">
                <div class="text-container">
                  <div
                    :class="
                      $i18n.locale.value === 'en'
                        ? 'text-body-2 c description-text_en  text-justify'
                        : 'text-caption description-text_ml'
                    "
                    :style="`color:
                ${colorScheme[1]}`"
                    v-html="aboutContent"
                  />
                </div>
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn
                  class="text-red font-weight-bold ml-2"
                  color="black"
                  rounded="0"
                  variant="outlined"
                  small
                >
                  Book Pooja
                </v-btn>
              </v-card-actions>
            </v-card>
          </section>
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
