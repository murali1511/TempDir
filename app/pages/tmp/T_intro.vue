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
          v-bind="props"
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
                  <!-- Image -->
                  <v-img
                    :src="`/${localStore.temple_logo}.png`"
                    height="140"
                    width="140"
                    class="rounded float-left mr-2"
                    alt="Health and Safety"
                  ></v-img>

                  <!-- Text -->
                  <div
                    :class="
                      $i18n.locale.value === 'en'
                        ? 'text-body-2 c description-text_en  text-justify'
                        : 'text-caption description-text_ml'
                    "
                    :style="`color:
                ${colorScheme[1]}`"
                    v-html="aboutIntro"
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

const aboutIntro = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const about = localStore.about;

  aboutIntro.value =
    locale === "en"
      ? "Palayad Theru Sri Maha Ganapathi Temple is a renowned place of worship located in Palayad Nada, Vadakara Taluk, Kozhikode district. This temple is uniquely dedicated to Lord Ganapathi and Goddess Bhagavathi, making it a spiritually significant destination for devotees. The temple complex consists of two main shrines: the primary shrine dedicated to Lord Ganapathi and another to Goddess Bhagavathi. These sanctuaries symbolize divine grace and spiritual power."
      : "പാലയാട് തെരു ശ്രീ മഹാഗണപതി ക്ഷേത്രം കോഴിക്കോട് ജില്ലയിലെ വടകര താലൂക്കിലെ പാലയാട് നടയിൽ സ്ഥിതിചെയ്യുന്ന ഒരു പ്രശസ്ത ആരാധനാലയമാണ്. ഈ ക്ഷേത്രം ശ്രീ ഗണപതി ദേവനും ഭഗവതി ദേവിയുമായുള്ള സമർപ്പിതമായതുകൊണ്ട് ഭക്തർക്കു ആത്മീയ പ്രാധാന്യമുള്ള സ്ഥാനമാണ്. ക്ഷേത്ര സമുച്ചയത്തിൽ രണ്ട് പ്രധാന ദേവാലയങ്ങൾ ഉണ്ട്: പ്രധാന ദേവാലയം ശ്രീ ഗണപതിക്ക് സമർപ്പിച്ചതും മറ്റൊന്ന് ഭഗവതി ദേവിയ്ക്ക് സമർപ്പിച്ചതുമാണ്. ഈ ദേവാലയങ്ങൾ ദൈവിക അനുഗ്രഹത്തെയും ആത്മീയ ശക്തിയെയും പ്രതിനിധീകരിക്കുന്നു";
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
