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
          :style="`background: linear-gradient(to right,  #735943,${colorScheme[1]},${colorScheme[0]}, ${colorScheme[1]},#735943)`"
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1 grab"
            :style="`color: ${colorScheme[0]}`"
          >
            {{ $t("festivals.title") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card
              class="mb-2"
              elevation="4"
              outlined
              :color="colorScheme[0]"
              :style="`background: linear-gradient(to bottom,${colorScheme[0]},${colorScheme[0]},#F2E7DC,${colorScheme[0]})`"
            >
              <div v-for="(festival, index) in festivals" :key="index">
                <!-- Festival start -->

                <v-card-title
                  class="text-subtitle-1 font-weight-bold text-center bg"
                  :style="`color:
                ${colorScheme[1]}`"
                >
                  <span> {{ festival.name }} {{ festival.time }} </span>
                </v-card-title>
                <v-divider class="mb-3"></v-divider>

                <v-card-text class="py-2 px-4">
                  <v-row>
                    <div class="text-container mx-1">
                      <!-- Image -->
                      <v-img
                        :src="localStore.deities.primedeity.image"
                        height="80"
                        width="80"
                        class="rounded-xl float-left mr-3 mb-1 mt-1"
                        alt="Health and Safety"
                      ></v-img>

                      <!-- Text -->
                      <div
                        class="font-weight-nomal mx-2 mb-2"
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2 text-justify '
                            : 'text-caption'
                        "
                        v-html="festival.detail"
                      ></div>
                    </div>
                    <v-divider></v-divider>
                  </v-row>
                </v-card-text>
              </div>
              <!-- Festival End -->
            </v-card>
          </section>
        </v-card>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";
import { useDisplay } from "vuetify";

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const localStore = useLocalStore();

const historyContent = ref("Loading about content..."); // Placeholder text
const historySummary = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const history = localStore.history;

  historyContent.value =
    locale === "en"
      ? history.detail?.en || "Content not available in English."
      : history.detail?.ml || "Content not available in Malayalam.";

  historySummary.value =
    locale === "en"
      ? history.summary?.en || "Content not available in English."
      : history.summary?.ml || "Content not available in Malayalam.";
});

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
const test = () => {
  alert("You clicked Learn more!");
};

const festivals = [
  {
    name: "Mandala Vilakku",
    time: "30 days of vrischikam",
    image: "",
    detail:
      "  <p>  Unlike most temples that observe the Mandala festival from 1st Vrischikam to 11th Dhanu (41 days),  the <strong>Lokanarkavu Temple</strong> celebrates it only during the 30 days of Vrischikam month.  The remaining 11 days are held at the <strong>Sree Kongannoor Bhagavathi Temple</strong> in Chingapuram   (now part of Mootati village, Koyilandy taluk).  </p>  <p style='margin-top:8px;'>During the first six days, there are no special rituals. From the 7th day, the <em>vilakku</em> festival begins,  with specific days dedicated as follows:  </p><br>  <li>    <strong>16th day:</strong> Naayars (descendants of Vaisya traders)</li>   <li><strong>20th day:</strong> Ayyappa devotees</li>    <li><strong>26th day:</strong> Court staff (<em>kodathi-vilakku</em>)</li>   <li><strong>27th day:</strong> Taluk staff</li>    <li><strong>28th day:</strong> Sponsored by the general public</li> </ul><br>  <p style='margin-bottom:8px;'>    Previously, the last two days were reserved for <em>Katathanat Kovilakam</em>.  </p>  <p>   A legend explains this division. A devotee from Chingapuram, who worshipped Sree Lokanarkavilamma daily,  built a temple in his native place with her blessings. The deity there, Kongannoor Bhagavathi, is believed  to be the younger sister of Lokanarkavilamma, leading to the festival being shared.  </p>  <p style='margin-top:8px;'>   The highlight of the annual event is <strong>Ucchal Ezhunnallathu</strong>, held on the Dhanu <em>Samkramam</em> day.   A procession from Lokanarkavu reaches Kongannoor temple by night. The two goddess-sisters symbolically meet, and the younger one falls asleep in the elder’s lap. At midnight, Lokanarkavilamma proceeds to the Kizhur Shiva temple   and returns by morning. This ritual was paused after the 1946 Temple Entry Proclamation but was revived decades later.  </p>  <p style='margin-top:8px;'> The <strong>chuttuvilakku</strong> (lamp lighting around the temple) remains a major attraction of the festival.  </p",
  },
  {
    name: "Poora Mahotsavam",
    time: "8 days, Meenam",
    image: "",
    detail:
      "  <p>  The <strong>Poora Mahotsavam</strong>, a major annual festival, was introduced around 1840 A.D. It is celebrated over eight days, beginning on the day of the Rohini star and ending with the ritual of Aarattu on the day of the Pooram star, both in the Malayalam month of <strong>Meenam</strong> (March–April). Initially, the festival featured only <i> Kaavoot </i>and <i>Paattu</i>—ritualistic performances and offerings—but over time, its importance and ceremonial depth have significantly increased.<p><br>Today, all essential temple rites associated with an <i>Utsavam</i> (festival) are performed. One of the key highlights is the traditional dance performances by the Theyyampadi Kurups, held on the fifth and sixth days. On the seventh day, rituals like <i>Mettu Ezhunnallathu</i> (ritual procession) and <i> Pallivetta </i>(symbolic royal hunt) take place.<p><br>The final day features <strong>Poora Paattu</strong> and<strong> Poorakali</strong>, both devotional art forms. Poora Paattu narrates the life and valor of the presiding deity, <strong>Bhagavathi</strong>. During the <i>Aarattu</i>, the Bali idols of Goddess Bhagavathi, Lord Vishnu, and Lord Shiva are taken out in procession. Upon return, the Goddess enters her sanctum first, followed by the other deities.<p><br>Next, the <strong>Sreebhootha Bali</strong> ritual is performed at the Bhagavathi shrine. The <strong>Utsava idol </strong>of the Goddess is then taken to the <i>Paattupura </i>(performance hall) of the Vishnu shrine for Uccha Paattu (noon ritual singing). Afterwards, the <strong>Melshanthi</strong> (chief priest), along with the <i>Komaram</i> (oracle), brings the idol back to the Sreekovil after five pradakshinas (circumambulations). The festival concludes with the <strong>Sopana Pushpanjali</strong> ritual.",
  },
];
</script>

<style scoped>
.text-container {
  position: relative;
}

.float-left {
  float: left; /* Float the image to the left */
}

.text-justify {
  text-align: justify; /* Ensures the text is justified */
}
.description-text_en {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
.description-text_ml {
  line-height: 1.8; /* Adjust the value as needed for desired spacing */
}
.grab {
  cursor: grab;
}
</style>
