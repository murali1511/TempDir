<template>
  <v-slide-group
    ref="slideGroup"
    v-model="model"
    class="pa-8 ml-n10 mr-n10"
    selected-class="bg-primary"
    mandatory
    center-active
    show-arrows
    next-icon="mdi-plus"
    prev-icon="mdi-minus"
  >
    <v-slide-group-item
      v-for="(program, index) in programs"
      :key="index"
      v-slot="{ isSelected, toggle, selectedClass }"
    >
      <!-- ADD THE DYNAMIC CLASS HERE -->
      <div
        class="card-wrapper mt-2 mb-10 ml-2 mr-2"
        :class="{ 'selected-card': selected === index }"
      >
        <v-card
          :variant="selected == index ? 'elevated' : 'tonal'"
          class="feature-card"
          :color="selected == index ? colorScheme[0] : colorScheme[1]"
          @mouseenter="hover = index"
          @mouseleave="hover = -1"
          :class="{ 'hovered-card': hover === index }"
          @click="CardSelected(index)"
          @mouseover="
            () => {
              trigger;
            }
          "
        >
          <v-icon
            size="48"
            class="mt-n8"
            :color="selected == index ? colorScheme[1] : 'black'"
          >
            {{ program.icon }}
          </v-icon>
          <h3
            class="mt-3 mb-2"
            :style="` color:  ${selected == index ? 'black' : 'white'}`"
            :class="[$i18n.locale.value === 'en' ? 'text-h6' : 'text-subtitle-1']"
          >
            {{ program.title }}
          </h3>
          <p
            class="text-body-2"
            :style="` color:  ${selected == index ? 'white' : 'black'}`"
            :class="[$i18n.locale.value === 'en' ? 'text-subtitle-1' : 'text-caption']"
          >
            {{ program.description }}
          </p>
          {{ index }}
        </v-card>
      </div>
    </v-slide-group-item>
  </v-slide-group>

  <!-- Detail card area -->

  <div class="mt-4">
    <v-btn @click="triggerPrev" color="primary" class="mr-2">Prev</v-btn>
    <v-btn @click="triggerNext" color="primary">Next</v-btn>
  </div>

  <v-card
    class="mx-auto mt-n12"
    min-width="375"
    max-width="800"
    :prepend-icon="program_card.icon"
  >
    <template v-slot:title>
      <div
        class="font-weight-black"
        :class="[$i18n.locale.value === 'en' ? 'text-h6' : 'text-subtitle-1']"
        v-if="selected >= 0"
      >
        <span>{{ `${selected + 1}.` }} {{ program_card.title }}</span>
      </div>
    </template>

    <v-card-text class="bg-surface-light pt-4" v-if="selected >= 0">
      {{ program_card.description }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import debounce from "lodash/debounce";

const { $i18n } = useNuxtApp();

const hover = ref(-1);
const model = ref(null);
const selected = ref(1);
const slideGroup = ref(null);

const program_card = ref({
  icon: "",
  title: "",
  description: "",
});

const programs = compute(() => ($i18n.locale.value === "en" ? programs_en : programs_ml));
/**
 * Function to scroll to the previous set of slides.
 */

const isLoading = ref(false); // Loading state for the "Next" button

// Function to trigger the "next" action with a 1-second delay
const triggerNext = () => {
  isLoading.value = true; // Enable loading state
  setTimeout(() => {
    if (model.value === null || model.value >= 14) {
      model.value = 0; // Loop back to the first item
    } else {
      model.value += 1; // Move to the next item
    }
    isLoading.value = false; // Disable loading state
  }, 1000); // 1-second delay
};

const triggerPrev = () => {
  isLoading.value = true; // Enable loading state
  setTimeout(() => {
    const triggerPrev = () => {
      if (model.value === null || model.value <= 0) {
        model.value = 14; // Loop back to the last item
      } else {
        model.value -= 1; // Move to the previous item
      }
    };
    isLoading.value = false; // Disable loading state
  }, 1000); // 1-second delay
};
const colorScheme = ["#2c3e50", "#ecf0f1"];

const programs_en = [
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

function CardSelected(index) {
  selected.value = index;
  program_card.value =
    $i18n.locale.value === "en" ? programs_en[index] : programs_ml[index];
  console.log(`card ${index + 1}`, program_card.value);
}
</script>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Needed for absolute-positioned arrow */
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
.selected-card {
  position: relative; /* Make sure .selected-card is positioned so that the pseudo-element can be absolutely placed */
}
/* Arrow only appears if card is selected */

/* Draw a downward pointing triangle */
.selected-card::after {
  content: "";
  position: absolute;
  /* Positioning: place arrow below the card */
  bottom: -20px; /* or however far below you want */
  left: 50%; /* horizontally center */
  transform: translateX(-50%); /* adjust centering */

  /* The “border trick” for a downward arrow: 
     - border-top is colored
     - border-left and border-right are transparent
  */
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 20px solid white; /* color + thickness of arrow “tip” */

  /* Make the pseudo-element a block so it’s rendered */
  display: block;
  width: 10;
  height: 0;
}

.text-muted {
  color: #777;
}
</style>
