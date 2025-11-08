<template>
  <v-main>
    <v-row>
      <v-col cols="12">
        <tmpT_head></tmpT_head>
        <breadcrumb v-if="!$vuetify.display.mobile" :breadcrumbs="breadcrumbs_items" />
      </v-col>

      <!-- <v-col cols="12" >
      <tmpT_intro />
    </v-col> -->
      <v-slide-group
        v-model="model"
        selected-class="bg-error "
        mandatory
        next-icon="mdi-arrow-right-bold"
        prev-icon="mdi-arrow-left-bold"
        show-arrows
        center-active
        class="box mb-5 rounded-lg mt-n7"
        :class="$vuetify.display.smAndUp ? 'ml-12 mr-12' : ' ml-4 mr-4'"
        :style="`background: linear-gradient(to right,  #c7b985ff,${colorScheme[1]},rgb(160, 136, 117), ${colorScheme[1]}, #c7b985ff)`"
      >
        <v-slide-group-item
          v-for="(program, index) in programs"
          :key="index"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <div class="card-wrapper mt-2 mb-2 ml-2 mr-2" @click="toggle">
            <v-card
              rounded="xl"
              :ripple="{ class: 'text-blue' }"
              :variant="selected == index ? 'elevated' : 'tonal'"
              class="feature-card"
              :color="selected == index ? colorScheme[0] : '#FF9933'"
              :style="
                selected === index
                  ? {
                      boxShadow:
                        '5px 5px 5px rgba(20, 20, 20, 0.8), -5px -5px 10px rgba(17, 17, 17, 0.8)',
                    }
                  : ''
              "
              @mouseenter="hover = index"
              @mouseleave="hover = -1"
              :class="{ 'hovered-card': hover === index }"
              @click="CardSelected(index)"
            >
              <v-icon
                size="30"
                class="mt-n8"
                :color="selected == index ? colorScheme[1] : 'grey'"
                >{{ program.icon }}</v-icon
              >
              <h3
                :class="[
                  'mt-3 mb-2 font-weight-bold',
                  $i18n.locale.value == 'en' ? 'text-body-1' : 'text-body-2',
                ]"
                :style="` color:  ${selected == index ? colorScheme[1] : colorScheme[0]}`"
              >
                {{ program.title }}
              </h3>
              <p
                :class="[$i18n.locale.value == 'en' ? 'text-caption' : 'smallFont']"
                :style="` color:  ${selected == index ? 'black-lighten-5' : 'white'}`"
              >
                {{ program.description }}
              </p>
            </v-card>
          </div>
        </v-slide-group-item>
      </v-slide-group>
      <v-container max-width="1100">
        <component
          :class="$vuetify.display.smAndUp ? 'ma-7 mt-n10' : 'mt-n10'"
          :is="currentComponent"
        />
      </v-container>
    </v-row>
  </v-main>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

import intro from "@/components/tmp/T_intro.vue";
import AboutTemple from "@/components/tmp/newDesign/N_AboutTemple.vue";
import history from "@/components/tmp/T_history.vue";
// import mythology from "@/components/tmp/T_mythology.vue";
// import deities from "@/components/tmp/T_deitiesV2.vue";
import about from "@/components/tmp/T_about.vue";
// import festivals from "@/components/tmp/T_festivalsV1.vue";
import breadcrumb from "@/components/breadcrump.vue";

import NewHistory from "/components/tmp/newDesign/N_historyV2";
import deities from "@/components/tmp/newDesign/N_dietiesV2.vue";
import poojas from "@/components/tmp/newDesign/N_pooja.vue";
import mythology from "@/components/tmp/newDesign/N_mythology.vue";
import DhyanaMantra from "@/components/tmp/newDesign/N_DhyanaMantra.vue";
import etiquette from "@/components/tmp/newDesign/N_Etiquette.vue";
import festivals from "@/components/tmp/newDesign/N_festivals.vue";
import templeOffers from "@/components/tmp/newDesign/N_TempleOffers.vue";
import specialPooja from "@/components/tmp/newDesign/N_SpecialPooja.vue";
import howToReach from "@/components/tmp/newDesign/N_how_to_reach.vue";
import architecture from "@/components/tmp/newDesign/N_architecture.vue";
import facilities from "@/components/tmp/newDesign/N_facilities.vue";
import near_by_facilities from "@/components/tmp/newDesign/N_near_by_facilities.vue";
import cultural from "@/components/tmp/newDesign/N_cultural.vue";
import nearnby_temples from "@/components/tmp/newDesign/N_nearby_temples.vue";
import local_attractions from "@/components/tmp/newDesign/N_local_attractions.vue";
import administration from "@/components/tmp/newDesign/N_administration.vue";
import health_safety from "@/components/tmp/newDesign/N_health_safety.vue";
import events from "@/components/tmp/newDesign/N_events.vue";
import gallery from "@/components/tmp/newDesign/N_imageGallery.vue";

import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { dbStore } from "@/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "@/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
// const colorScheme = ["#FFD700", "#ecf0f1"];

const hover = ref(-1);
const model = ref(0);
const { width } = useDisplay();
const selected = ref(0);

const CardSelected = (index) => {
  selected.value = index;
  console.log(`card ${index + 1}`);

  currentComponent.value = mythology;
  switch (index) {
    case 0:
      currentComponent.value = AboutTemple;
      break;
    case 1:
      currentComponent.value = NewHistory;
      break;
    case 2:
      currentComponent.value = mythology;
      break;
    case 3:
      currentComponent.value = deities;
      break;
    case 4:
      currentComponent.value = poojas;
      break;
    case 5:
      currentComponent.value = DhyanaMantra;
      break;
    case 5:
      currentComponent.value = DhyanaMantra;
      break;
    case 6:
      currentComponent.value = etiquette;
      break;
    case 7:
      currentComponent.value = templeOffers;
      break;
    case 8:
      currentComponent.value = specialPooja;
      break;
    case 9:
      currentComponent.value = festivals;
      break;
    case 10:
      currentComponent.value = howToReach;
      break;
    case 11:
      currentComponent.value = architecture;
      break;
    case 12:
      currentComponent.value = facilities;
      break;
    case 13:
      currentComponent.value = near_by_facilities;
      break;
    case 14:
      currentComponent.value = cultural;
      break;
    case 15:
      currentComponent.value = nearnby_temples;
      break;

    case 16:
      currentComponent.value = administration;
      break;
    case 17:
      currentComponent.value = health_safety;
      break;
    case 18:
      currentComponent.value = local_attractions;
      break;
    case 19:
      currentComponent.value = events;
      break;
    case 20:
      currentComponent.value = gallery;
      break;
    default:
      currentComponent.value = null;
      break;
  }
};

onMounted(() => {
  // localStore.setpageType("temple");
  CardSelected(0);
  onMounted(async () => {
    await await localStore.Fetch_TIDs();
    select.value = localStore.TIDs.find((entry) => entry.TID === localStore.templeID);
  });
});
// Example update in your colorScheme store:

// Current component to display
const currentComponent = shallowRef(history);

const programs = computed(() =>
  $i18n.locale.value === "en" ? programs_en : programs_ml
);
const programs_en = [
  {
    icon: "mdi-om",
    title: "About Temple",
    description: "Journey to explore the rich history, art, and architecture of temples.",
  },
  {
    icon: "mdi-history",
    title: "Temple History",
    description: "Explore ancient origins and stories shaping the temple's legacy.",
  },
  {
    icon: "mdi-book-open-page-variant",
    title: "Temple Mythology",
    description: "Uncover sacred lore, legends, and divine narratives behind the temple.",
  },
  {
    icon: "mdi-account-group-outline",
    title: "Temple Deities",
    description:
      "Discover principal deities and sub deities revered in this holy sanctuary.",
  },
  {
    icon: "mdi-clock-outline",
    title: "Temple Pooja Time",
    description: "Daily worship timings pooja schedule and rituals for devotees.",
  },
  {
    icon: "mdi-meditation",
    title: "Dhyna Mantra",
    description: "Meditative chants for spiritual growth and divine connection.",
  },
  {
    icon: "mdi-handshake-outline",
    title: "Temple Etiquette",
    description: "Guidelines ensuring a harmonious and sacred temple environment.",
  },
  {
    icon: "mdi-oil-lamp",
    title: "Pooja & Offers",
    description:
      "Daily worship details and special offerings, vazhipadu(pooja) for devotees.",
  },
  {
    icon: "mdi-pyramid",
    title: "Special Pooja",
    description: "Unique rituals performed to invoke blessings for devotees.",
  },
  {
    icon: "mdi-flower",
    title: "Temple Festivals",
    description: "Name of the festivals celebrated annually at temple.",
  },
  {
    icon: "mdi-map-marker-path",
    title: "How to Reach",
    description:
      "Travel guidance, route maps, and transportation options for temple visit.",
  },
  {
    icon: "mdi-artstation",
    title: "Architecture & Layout",
    description: "Sacred design elements and structural highlights of the temple.",
  },
  {
    icon: "mdi-office-building-cog",
    title: "Temple Facilities",
    description: "Amenities - rest areas, cloakrooms, and refreshment options.",
  },
  {
    icon: "mdi-map-marker-circle",
    title: "Nearby Facilities",
    description: "Accommodation, dining, and services available around the temple .",
  },
  {
    icon: "mdi-drama-masks",
    title: "Temple Art",
    description: "Art forms connected with  temple’s rituals and vibrant heritage.",
  },
  {
    icon: "mdi-temple-hindu",
    title: "Nearby Temples",
    description: "Sacred temples invite you for a serene spiritual journey today",
  },
  {
    icon: "mdi-account-tie-outline",
    title: "Administration",
    description: "Management, trustee details, and temple operations and development.",
  },
  {
    icon: "mdi-shield-check",
    title: "Health & Safety",
    description: "Guidelines ensuring a secure, hygienic environment for visitors.",
  },
  {
    icon: "mdi-map-search-outline",
    title: "Local Attractions",
    description: "Notable sites and cultural landmarks around the temple area.",
  },
  {
    icon: "mdi-calendar-star",
    title: "Events & Calendar",
    description: "One year Calendar of celebrations, festivities, and events.",
  },
  {
    icon: "mdi-image-multiple",
    title: "Image Gallery",
    description: "A visual collection showcasing related to temple.",
  },
];

const programs_ml = [
  {
    icon: "mdi-temple-hindu",
    title: "ക്ഷേത്രം",
    description: "ക്ഷേത്രത്തിന്റെ ചരിത്രം, നിർമിതി, കല, ശില്പ എന്നിവ.",
  },
  {
    icon: "mdi-history",
    title: "ക്ഷേത്രചരിത്രം",
    description: "ക്ഷേത്രവുമായി ബന്ധപ്പെടുന്ന ചരിത്രവും പാരമ്പര്യവും. ",
  },
  {
    icon: "mdi-book-open-page-variant",
    title: "ക്ഷേത്രപുരാണം",
    description: "പ്രതിഷ്ഠകളും, ആചാരങ്ങളും ദൈവിക  സങ്കൽങ്ങളും.",
  },
  {
    icon: "mdi-account-group-outline",
    title: "ക്ഷേത്ര പ്രതിഷ്ഠകൾ",
    description: "പ്രതിഷ്ഠകളുടെ ദിവ്യശക്തിയും,  ആദ്ധ്യാത്മിക പ്രാധാന്യവും.",
  },
  {
    icon: "mdi-clock-outline",
    title: "പൂജാവേള",
    description: "ദൈനംദിന പൂജാക്രമങ്ങളും പ്രാർത്ഥനാ സമയങ്ങളും അറിയുക.",
  },
  {
    icon: "mdi-meditation",
    title: "ധ്യാനമന്ത്രം",
    description: "പ്രതിഷ്ഠകളുമായി ആത്മീയ ബന്ധത്തിന്‍റെ ധ്യാനമന്ത്രം.",
  },
  {
    icon: "mdi-handshake-outline",
    title: "ക്ഷേത്രാചാരങ്ങൾ",
    description: " ആത്മീയ ചൈതന്യം നിലനിർത്താൻ പാലിക്കേണ്ട  ക്ഷേത്ര ആചാരങ്ങൾ.",
  },
  {
    icon: "mdi-oil-lamp",
    title: "ക്ഷേത്ര നേർച്ചകൾ",
    description: "ദൈനംദിന ആരാധനയോടൊപ്പമുള്ള  ഭക്തർക്കുള്ള നേർച്ചകൾ.",
  },
  {
    icon: "mdi-pyramid",
    title: "പ്രത്യേക പൂജ",
    description: "ക്ഷേത്രത്തിൽ നടത്തപ്പെടുന്ന പ്രത്യേക  പൂജ സംബന്ധിച്ച വിവരണം.",
  },
  {
    icon: "mdi-star-shooting",
    title: "ക്ഷേത്ര ഉത്സവങ്ങൽ",
    description: "ക്ഷേത്രത്തിൽ ആഘോഷിക്കുന്ന ഉത്സവങ്ങളുടെ പേരുകൾ",
  },
  {
    icon: "mdi-map-marker-path",
    title: "എത്തിച്ചേരേണ്ട വിധം",
    description: "എത്തിചേരാനുള്ള  മാർഗനിർദ്ദേശങ്ങളും ഗതാഗത സൌകര്യങ്ങളും.",
  },
  {
    icon: "mdi-artstation",
    title: "ക്ഷേത്ര നിർമ്മിതി ",
    description: "ക്ഷേത്രത്തിന്‍റെ  നിർമ്മിതിയും ശില്‍പ ഘടനകളും.",
  },
  {
    icon: "mdi-office-building-cog",
    title: "ക്ഷേത്ര സൗകര്യങ്ങൾ",
    description: "ക്ഷേത്രത്തിലുള്ള വിശ്രമമുറികൾ,ക്ലോക്ക്റൂം, അനുബന്ധസൗകര്യങ്ങൾ.",
  },
  {
    icon: "mdi-map-marker-circle",
    title: "അടുത്ത സൗകര്യങ്ങൾ",
    description: "ഭക്ഷണം, താമസം, മറ്റു സൌകര്യങ്ങളുടെയും വിവരങ്ങൾ.",
  },
  {
    icon: "mdi-drama-masks",
    title: "ക്ഷേത്ര കല",
    description: "ക്ഷേത്രവുമായി ബന്ധപ്പെട്ട കലാരൂപങ്ങളും സാംസ്കാരികവൈഭവവും.",
  },
  {
    icon: "mdi-temple-hindu",
    title: "അടുത്തുള്ള ക്ഷേത്രങ്ങൾ",
    description: "ഭക്തർക്ക് സന്ദർശിക്കാവുന്ന അടുത്തുള്ള പവിത്ര ക്ഷേത്രങ്ങൾ",
  },
  {
    icon: "mdi-account-tie-outline",
    title: "ക്ഷേത്ര ഭരണം",
    description: "ഭരണാസമിതിയെയും ഭരണാരീതിയെയും പറ്റിയുള്ള വിവരങ്ങൾ.",
  },
  {
    icon: "mdi-shield-check",
    title: "ആരോഗ്യവും സുരക്ഷയും",
    description: "ഭക്തരുടെ സുരക്ഷയും ആരോഗ്യശുചിത്വം ഉറപ്പാക്കുന്ന മാർഗങ്ങൾ.",
  },
  {
    icon: "mdi-map-search-outline",
    title: "സന്ദർശിക്കാവുന്ന സ്ഥലങ്ങൾ",
    description: "ക്ഷേത്രത്തിന് അടുത്തുള്ള സന്ദർശിക്കാവുന്ന സ്ഥലങ്ങൾ.",
  },
  {
    icon: "mdi-calendar-star",
    title: "ക്ഷേത്ര കലണ്ടർ ",
    description: "ആഘോഷങ്ങൾ, ഉത്സവങ്ങൾ, മറ്റ് പരിപാടികൾ.",
  },
  {
    icon: "mdi-image-multiple",
    title: "ചിത്രശാല",
    description: "ക്ഷേത്രത്തെ സംബദ്ധിച്ചുള്ള ഫോട്ടോകളും വീഡിയോകളും.",
  },
];
console.log("localStore.TemplesSource Hoem4", localStore.TemplesSource);

const breadcrumbs_items = computed(() =>
  $i18n.locale.value === "en"
    ? [
        { title: "Home", href: "/" },
        { title: "Temples", href: localStore.TemplesSource },
        {
          title: localStore.name.en,
          href: "/tmp/home4",
        },
        {
          title: programs.value[selected.value]?.title || "Loading...",
          href: null,
        },
      ]
    : [
        { title: "ഹോം പേജ് ", href: "/" },
        {
          title: "ക്ഷേത്രങ്ങൾ",
          href: localStore.TemplesSource,
        },
        { title: localStore.name.ml, href: "/tmp/home4" },
        {
          title: programs.value[selected.value]?.title || "Loading...",
          href: null,
        },
      ]
);
</script>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 185px;
  padding: 5px;
}

.feature-card {
  text-align: center;
  padding: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  width: 185px;
  height: 185px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 6px 6px 6px rgba(255, 255, 255, 0.5),
    -5px -5px 10px rgba(255, 255, 255, 0.5);
}

.hovered-card {
  box-shadow: 5px 5px 5px rgba(20, 20, 20, 0.8), -5px -5px 10px rgba(17, 17, 17, 0.8);

  transform: scale(1.05);
}

:root {
  /* --color-selected: #2c3e50; */
  --color-selected: v-bind(colorScheme[1]);
  --color-unselected: rgb(241, 238, 236);
  --color-black: #0a0a0aff;
}
.smallFont {
  font-size: 9px;
}
.box {
  box-shadow: 5px 5px 5px rgb(6, 6, 6), -5px -5px 5px rgb(12, 12, 12);
}
</style>
