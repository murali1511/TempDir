<template>
  <v-row>
    <carousels></carousels>

    <v-slide-group
      v-model="model"
      class="pa-8 ml-n10 mr-n10 mt-n5"
      selected-class="bg-primary"
      mandatory
      show-arrows
      center-active
    >
      <v-slide-group-item
        v-for="(program, index) in programs"
        :key="index"
        v-slot="{ isSelected, toggle, selectedClass }"
      >
        <div class="card-wrapper mt-2 mb-10 ml-2 mr-2" @click="toggle">
          <v-card
            rounded="xl"
            :ripple="{ class: 'text-blue' }"
            :variant="selected == index ? 'elevated' : 'tonal'"
            class="feature-card"
            :color="selected == index ? colorScheme[0] : colorScheme[1]"
            @mouseenter="hover = index"
            @mouseleave="hover = -1"
            :class="{ 'hovered-card': hover === index }"
            @click="CardSelected(index)"
          >
            <v-icon
              size="48"
              class="mt-n8"
              :color="selected == index ? colorScheme[1] : 'black'"
              >{{ program.icon }}</v-icon
            >
            <h3
              :class="[
                'mt-3 mb-2 font-weight-bold',
                $i18n.locale.value == 'en' ? 'text-body-1' : 'text-body-2',
              ]"
              :style="` color:  ${selected == index ? 'black' : 'white'}`"
            >
              {{ program.title }}
            </h3>
            <p
              :class="[$i18n.locale.value == 'en' ? 'text-body-2' : 'text-caption']"
              :style="` color:  ${selected == index ? 'white' : 'black'}`"
            >
              {{ program.description }}
            </p>
          </v-card>
        </div>
      </v-slide-group-item>
    </v-slide-group>

    <!-- <v-card class="mx-auto" prepend-icon="$vuetify" min-width="375" max-width="800">
    <template v-slot:title>
      <span class="font-weight-black" v-if="selected >= 0">
        {{ `${selected + 1}.` }} {{ programs[selected].title }}</span
      >
    </template>
    <template v-slot:subtitle>
      <span v-if="selected >= 0"> {{ programs[selected].description }}</span>
    </template>

    <v-card-text class="bg-surface-light pt-4" v-if="selected >= 0">
      {{ programs[selected].description }}
    </v-card-text>
  </v-card> -->

    <component class="mt-n15" :is="currentComponent" />
  </v-row>
</template>

<script setup>
import history from "@/components/history.vue";
import mythology from "@/components/mythology.vue";
import deities from "@/components/deitiesV2.vue";
import about from "@/components/about.vue";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

// const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

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
      currentComponent.value = about;
      break;
    case 1:
      currentComponent.value = history;
      break;
    case 2:
      currentComponent.value = mythology;
      break;
    case 3:
      currentComponent.value = deities;
      break;
    default:
      currentComponent.value = null;
      break;
  }
};

onMounted(() => {
  CardSelected(0);
});
// Example update in your colorScheme store:
const colorScheme = ["#2c3e50", "#ecf0f1"];
// Current component to display
const currentComponent = ref(history);

const programs = computed(() =>
  $i18n.locale.value === "en" ? programs_en : programs_ml
);
const programs_en = [
  {
    icon: "mdi-temple-hindu",
    title: "About Temple",
    description: "Explore the history, art, and architecture of temples.",
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
    description:
      "Check daily worship timings pooja schedule and rituals for all devotees.",
  },
  {
    icon: "mdi-meditation",
    title: "Dhyna Mantra",
    description:
      "Learn meditative chants fostering spiritual growth and divine connection.",
  },
  {
    icon: "mdi-handshake-outline",
    title: "Temple Etiquette",
    description:
      "Follow respectful guidelines ensuring a harmonious and sacred temple environment.",
  },
  {
    icon: "mdi-oil-lamp",
    title: "Pooja & Offers",
    description:
      "Daily worship details and special offerings for devotees seeking divine blessings.",
  },
  {
    icon: "mdi-lantern",
    title: "Special Pooja",
    description:
      "Unique rituals performed on auspicious occasions to invoke blessings and spiritual harmony.",
  },
  {
    icon: "mdi-map-marker-path",
    title: "How to Reach",
    description:
      "Travel guidance, route maps, and transportation options for a convenient temple visit.",
  },
  {
    icon: "mdi-domain-outline",
    title: "Architecture & Layout",
    description:
      "A glimpse of sacred design elements and intricate structural highlights of the temple.",
  },
  {
    icon: "mdi-office-building-cog",
    title: "Temple Facilities",
    description:
      "Amenities supporting pilgrims, including rest areas, cloakrooms, and refreshment options.",
  },
  {
    icon: "mdi-map-marker-circle",
    title: "Nearby Facilities",
    description:
      "Accommodation, dining, and essential services available around the temple vicinity.",
  },
  {
    icon: "mdi-drama-masks",
    title: "Temple Art",
    description:
      "Experience  art forms connected with  temple’s rituals and vibrant heritage.",
  },
  {
    icon: "mdi-account-tie-outline",
    title: "Temple Administration",
    description:
      "Official management, trustee details, and leadership overseeing temple operations and development.",
  },
  {
    icon: "mdi-shield-check",
    title: "Health & Safety",
    description:
      "Guidelines ensuring a secure, hygienic environment for devotees and visitors.",
  },
  {
    icon: "mdi-map-search-outline",
    title: "Local Attractions",
    description:
      "Explore notable sites, scenic spots, and cultural landmarks around the temple area.",
  },
  {
    icon: "mdi-calendar-star",
    title: "Events & Festivals",
    description:
      "Calendar of religious celebrations, grand festivities, and community gatherings.",
  },
  {
    icon: "mdi-image-multiple",
    title: "Image Gallery",
    description:
      "A visual collection showcasing the temple’s architecture, rituals, and memorable events.",
  },
];

const programs_ml = [
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
    icon: "mdi-map-marker-path",
    title: "എത്തിച്ചേരേണ്ട വിധം",
    description:
      "എത്തിചേരാനുള്ള  മാർഗനിർദ്ദേശങ്ങളുടെയും ഗതാഗത സൌകര്യങ്ങളുടെയും വിവരങ്ങൾ.",
  },
  {
    icon: "mdi-artstation",
    title: "ക്ഷേത്ര ശില്പങ്ങൾ ",
    description: "ക്ഷേത്രത്തിന്‍റെ  ശില്‍പ ഘടനകളും അതിന്‍റെ രീതികളും.",
  },
  {
    icon: "mdi-office-building-cog",
    title: "ക്ഷേത്ര സൗകര്യങ്ങൾ",
    description: "ക്ഷേത്രത്തിലുള്ള വിശ്രമമുറികൾ,ക്ലോക്ക്റൂം  മുതലായ അനുബന്ധസൗകര്യങ്ങൾ.",
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
    title: "ക്ഷേത്ര പരിപാടികൾ ",
    description: "ആഘോഷങ്ങൾ, ഉത്സവങ്ങൾ, മറ്റ് പരിപാടികൾ.",
  },
  {
    icon: "mdi-image-multiple",
    title: "ചിത്രശാല",
    description: "ക്ഷേത്രത്തെ സംബദ്ധിച്ചുള്ള ഫോട്ടോകളും വീഡിയോകളും.",
  },
];
</script>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 250px;
  padding: 10px;
}

.feature-card {
  text-align: center;
  padding: 16px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 6px 6px 6px rgba(255, 255, 255, 0.5),
    -5px -5px 10px rgba(255, 255, 255, 0.5);
}

.hovered-card {
  box-shadow: 5px 5px 5px rgba(184, 171, 97, 0.8), -5px -5px 10px rgba(184, 171, 97, 0.8);

  transform: scale(1.05);
}

.text-muted {
  color: #777;
}
:root {
  --color-selected: #2c3e50;
  --color-unselected: #ecf0f1;
  --color-black: #0a0a0a;
}
</style>
