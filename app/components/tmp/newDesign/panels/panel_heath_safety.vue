<template>
  <!-- Loop categories (currently using performance[0]) -->
  <v-container fluid class="pa-0">
    <div class="mb-1 ma-1">
      <v-card>
        <v-card-title class="d-flex align-center bg-orange">
          <div class="font-weight-bold text-subtitle-1">
            <v-icon class="mr-2">mdi-shield-alert</v-icon>
            Heath & Safety
          </div>

          <v-spacer />

          <!-- Category-level toggle: expands/collapses all panels in this category -->
          <v-btn density="compact" color="black" icon @click="toggleAll">
            <v-icon>
              {{ isAllOpen ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>

      <!-- Expansion panels for this category -->
      <!-- v-model binds to openPanels (array of open indexes) -->
      <v-expansion-panels v-model="openPanels" multiple class="rounded-xl mt-2">
        <v-expansion-panel
          v-for="(s, i) in Health_Safety_Temple?.guidelines || []"
          :key="i"
          color="#f2dfa7"
        >
          <v-expansion-panel-title class="d-flex align-center">
            <div class="d-flex align-center font-weight-bold" style="flex: 1">
              <v-icon class="mr-2">{{ s.icon }}</v-icon>
              <span class="text-grey-darken-3">{{ s.head }}</span>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text class="text-body-2">
            <div class="mb-2">{{ s.description }}</div>

            <div
              v-for="(item, index) in s.items"
              class="mt-2 ml-1 text-body-2 font-weight-medium"
            >
              <v-icon class="mr-1" size="8" color="grey-darken-3">mdi-circle</v-icon>
              <span class="text-body-2 font-weight-low text-grey-darken-3">{{
                item
              }}</span>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { performance } from "@/stores/cultural_performance.js";

// v-expansion-panels with `multiple` expects an array of open indices
const Health_Safety = [
  {
    name: "Lokanarkavu Temple",
    TID: "T0001",
    health_and_safety: {
      overview:
        "Lokanarkavu Temple prioritizes the safety and health of devotees through protected and dignified basic facilities, ensuring a secure, hygienic, and comfortable pilgrimage experience in line with Kerala Devaswom Board standards.",
      guidelines: [
        {
          head: "Hygiene",
          icon: "mdi-hand-wash",
          items: [
            "Hand sanitization stations available at entrances and key areas like Chuttambalam.",
            "Masks recommended in crowds; no spitting or littering; daily sanitation of footwear removal areas.",
            "Hygienically prepared prasadam distributed; clean food options at nearby outlets.",
          ],
        },
        {
          head: "Security",
          icon: "mdi-security",
          items: [
            "CCTV surveillance throughout premises; no weapons or prohibited items inside Maryada wall.",
            "Lost and found desk during peak hours; crowd control with volunteer guides during festivals.",
            "Multiple emergency exits along darshan queues; safety warnings installed in key areas.",
          ],
        },
        {
          head: "Visitor Protocols",
          icon: "mdi-account-group",
          items: [
            "Modest dress code (saree/dhoti; no shorts); clockwise pradakshina; silence near Sreekovil.",
            "Priority access for elderly, disabled, and pregnant women; supervised children required.",
            "Clear multilingual signage for navigation to temple areas, medical facilities, and restrooms.",
          ],
        },
        {
          head: "Emergency",
          icon: "mdi-medical-bag",
          items: [
            "First-aid kits and trained staff on-site; tie-up with nearest hospitals (Govt., Co-operative, Parco, Asha—all within 6-7 km).",
            "Local doctors and pharmacies within 5 km; emergency contact: +91-9876543210.",
            "Evacuation plans displayed; quick response for accidents near slippery steps or temple pools.",
          ],
        },
        {
          head: "Transportation Accessibility",
          icon: "mdi-car",
          items: [
            "Nearest station: Vadakara (6 km); autos/taxis readily available.",
            "Direct access to temple parking; no hassle for vehicles.",
            "Local buses from Vadakara town; stop 250 meters from temple.",
          ],
        },
        {
          head: "Pilgrimage Pathway",
          icon: "mdi-map-marker-path",
          items: [
            "Temple on plain land for easy access; 25 meters from parking to premises.",
            "Smooth, maintained pathways for mobility challenges.",
            "Short and convenient walking distance (25 meters from parking).",
          ],
        },
        {
          head: "Infrastructure and Support",
          icon: "mdi-home",
          items: [
            "Shaded seating areas within premises for relaxation.",
            "Clean, safe water readily available.",
            "Washrooms, including elderly and differently-abled designs, accessible on-site.",
          ],
        },
        {
          head: "Weather Considerations",
          icon: "mdi-weather-partly-cloudy",
          items: [
            "Accessible year-round in all conditions.",
            "Covered areas for protection from rain and sunlight.",
          ],
        },
        {
          head: "Crowd Management",
          icon: "mdi-account-multiple",
          items: [
            "Large crowds during festivals; regular days allow darshan in ~1 hour.",
            "Multiple exits along queues for safety.",
          ],
        },
        {
          head: "Safety Signage",
          icon: "mdi-sign-direction",
          items: [
            "Clear, multilingual signs to key areas (temple, medical, pools, restrooms).",
            "Displayed near hazards like slippery steps, steep climbs, and pools.",
          ],
        },
        {
          head: "Food and Nutrition",
          icon: "mdi-food",
          items: [
            "Hygienically prepared and distributed.",
            "Clean, safe options available nearby.",
          ],
        },
        {
          head: "Communication",
          icon: "mdi-chat",
          items: [
            "All major networks available on-site.",
            "Dedicated center for guidance and queries.",
          ],
        },
      ],
    },
  },
];

const Health_Safety_Temple = Health_Safety[0].health_and_safety;
const openPanels = ref([]);

// helper: check if a given panel index is open
function isPanelOpen(i) {
  return openPanels.value.includes(i);
}

// toggle a single panel open/close
function togglePanel(i) {
  const idx = openPanels.value.indexOf(i);
  if (idx === -1) {
    openPanels.value.push(i);
  } else {
    openPanels.value.splice(idx, 1);
  }
}

// computed: true if all panels in this category are open
const isAllOpen = computed(() => {
  const options = Health_Safety_Temple?.guidelines || [];
  return options.length > 0 && openPanels.value.length === options.length;
});

// toggle all panels for the category
function toggleAll() {
  const options = Health_Safety_Temple?.guidelines || [];
  if (isAllOpen.value) {
    openPanels.value = [];
  } else {
    openPanels.value = options.map((_, i) => i);
  }
}
</script>

<style scoped>
.bg-orange {
  background: #f2b84b; /* replace with your theme color or class */
}
</style>
