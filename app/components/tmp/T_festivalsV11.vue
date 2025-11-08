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
            {{ $t("festivals.title") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card class="mb-2" elevation="4" outlined :color="colorScheme[0]">
              <v-divider></v-divider>

              <v-card-text class="py-2 px-4">
                <div class="text-container">
                    <div v-for="(festival, index) in festivals" :key="index">
                <v-card-title
                  class="text-h6 font-weight-bold text-center"
                  :style="`color:
                ${colorScheme[1]}`"
                >
                  <span> {{ festival.name }} - {{ festival.time }} </span>
                </v-card-title>

                <v-card-text class="py-2 px-4 mt-2 text-body-2">
                  <v-row>
                      <div
                        class="font-weight-nomal mx-2 mb-2"
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2 text-justify '
                            : 'text-caption'
                        "
                        v-html="festival.detail"
                      ></div>
                    <v-divider></v-divider>
                  </v-row>
                  <v-row> </v-row>
                </v-card-text>
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

const festivals = [
  {
    name: "Mandala Vilakku",
    time: "30 days of vrischikam month",
    image: "",
    detail:
      "  <p>  Unlike most temples that observe the Mandala festival from 1st Vrischikam to 11th Dhanu (41 days),  the <strong>Lokanarkavu Temple</strong> celebrates it only during the 30 days of Vrischikam month.  The remaining 11 days are held at the <strong>Sree Kongannoor Bhagavathi Temple</strong> in Chingapuram   (now part of Mootati village, Koyilandy taluk).  </p>  <p style='margin-top:8px;'>During the first six days, there are no special rituals. From the 7th day, the <em>vilakku</em> festival begins,  with specific days dedicated as follows:  </p><br>  <li>    <strong>16th day:</strong> Naayars (descendants of Vaisya traders)</li>   <li><strong>20th day:</strong> Ayyappa devotees</li>    <li><strong>26th day:</strong> Court staff (<em>kodathi-vilakku</em>)</li>   <li><strong>27th day:</strong> Taluk staff</li>    <li><strong>28th day:</strong> Sponsored by the general public</li> </ul><br>  <p style='margin-bottom:8px;'>    Previously, the last two days were reserved for <em>Katathanat Kovilakam</em>.  </p>  <p>   A legend explains this division. A devotee from Chingapuram, who worshipped Sree Lokanarkavilamma daily,  built a temple in his native place with her blessings. The deity there, Kongannoor Bhagavathi, is believed  to be the younger sister of Lokanarkavilamma, leading to the festival being shared.  </p>  <p style='margin-top:8px;'>   The highlight of the annual event is <strong>Ucchal Ezhunnallathu</strong>, held on the Dhanu <em>Samkramam</em> day.   A procession from Lokanarkavu reaches Kongannoor temple by night. The two goddess-sisters symbolically meet, and the younger one falls asleep in the elder’s lap. At midnight, Lokanarkavilamma proceeds to the Kizhur Shiva temple   and returns by morning. This ritual was paused after the 1946 Temple Entry Proclamation but was revived decades later.  </p>  <p style='margin-top:8px;'> The <strong>chuttuvilakku</strong> (lamp lighting around the temple) remains a major attraction of the festival.  </p",
  },
];

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
