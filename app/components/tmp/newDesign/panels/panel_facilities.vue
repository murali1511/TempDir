<template>
  <!-- Loop categories -->
  <v-container fluid class="pa-0">
    <div
      v-for="(faci, k) in Temples_Facilities[0].accessibility_and_facilities"
      :key="k"
      class="mb-4 ma-2"
    >
      <v-card>
        <v-card-title class="d-flex align-center bg-orange">
          <div class="text-h5 font-weight-bold text-subtitle-2">
            <v-icon>{{ faci.icon }}</v-icon>
            {{ faci.category }}
          </div>

          <v-spacer />

          <!-- Category-level toggle: expands/collapses all panels in this category -->
          <v-btn density="compact" class="" color="black" icon @click="toggleAll(k)">
            <v-icon>
              {{ isAllOpen(k) ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>

      <!-- Expansion panels for this category -->
      <!-- v-model binds to openPanels[k] (array of open indexes) -->
      <v-expansion-panels v-model="openPanels[k]" multiple class="rounded-xl mt-2">
        <v-expansion-panel v-for="(s, i) in faci.features || []" :key="i" color="#f2dfa7">
          <!-- Panel header: shows title + an icon button to toggle only this panel -->
          <v-expansion-panel-title class="d-flex align-center">
            <div class="d-flex align-center" style="flex: 1">
              <v-icon class="mr-2" :color="s.available ? 'green' : 'red'">{{
                s.available ? "mdi-check-circle" : "mdi-close-circle"
              }}</v-icon>
              <span>{{ s.name }}</span>
            </div>

            <!-- Per-panel toggle button.
                 .stop prevents the button click from toggling the whole header twice.
                 Using @click.stop so header expand/collapse still works if user clicks header text.
            -->
            <!-- <v-btn icon small @click.stop="togglePanel(k, i)">
              <v-icon>
                {{ isPanelOpen(k, i) ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </v-btn> -->
          </v-expansion-panel-title>

          <v-expansion-panel-text class="text-body-2">
            <div v-if="Array.isArray(s.description)" class="d-flex flex-column gap-2">
              <div
                v-for="(item, j) in s.description"
                :key="j"
                class="d-flex align-center"
              >
                <v-icon class="mr-2" small>mdi-circle-small</v-icon>
                <span>{{ item }}</span>
              </div>
            </div>

            <div v-else>{{ s.description }}</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { Temples_Facilities } from "@/stores/facilities.js";

// paste your Facilities data (trimmed here for brevity)
const Facilities = [
  {
    temple: {
      name: "Lokanarkavu Temple",
      description:
        "Lokanarkavu Temple, located in Memunda near Vatakara, Kozhikode, Kerala, is an ancient Hindu temple dedicated to Goddess Durga (Bhagavathy). Devotees visiting this sacred site often seek convenient nearby facilities for a comfortable and hassle-free pilgrimage. The following outlines key amenities within a 5-10 km radius, focusing on practical needs like rest, food, health, travel, and local exploration.",
    },
    nearby_facilities: [
      {
        category: "Accommodation",
        description:
          "Multiple lodging options are available for devotees within 5-10 km, ranging from budget guesthouses to mid-range hotels, ensuring restful stays during temple visits and festivals.",
        icon: "mdi-bed",
        options: [
          {
            name: "Lokanarkavu Devaswom Guest House",
            distance: "On-site / 0 km",
            details:
              "Provides clean dormitories and private rooms at affordable rates (starting ~₹500/night), ideal for pilgrims with basic amenities like attached baths and hot water.",
          },
          {
            name: "PWD Guest House, Vadakara",
            distance: "5 km",
            details:
              "Government-run budget accommodation with simple rooms (~₹300-600/night), suitable for short stays; book via local PWD office.",
          },
          {
            name: "Queens Tourist Home",
            distance: "4 km (Vadakara town)",
            details:
              "Comfortable mid-range hotel with AC/non-AC rooms (~₹800-1500/night), free Wi-Fi, and proximity to bus/rail stations; family-friendly with vegetarian meal options.",
          },
          {
            name: "Malabar Residency",
            distance: "5 km",
            details:
              "Budget hotel (~₹600-1200/night) with clean rooms and parking; convenient for groups attending Pooram festival.",
          },
          {
            name: "Sea Queen Hotel",
            distance: "6 km",
            details:
              "Mid-range option (~₹1000-2000/night) near Vadakara Beach, offering sea views and Kerala-style dining.",
          },
        ],
      },
      {
        category: "Dining Options",
        description:
          "A variety of eateries serve authentic Kerala cuisine, including sattvic vegetarian meals for devotees. Focus on hygienic, affordable spots emphasizing local flavors like appam, sadhya, and seafood.",
        icon: "mdi-silverware-fork-knife",
        options: [
          {
            name: "Temple Road Eateries",
            distance: "0-1 km",
            details:
              "Small family-run stalls offering budget thalis (₹50-100) and banana leaf meals; quick service for pre/post-darshan bites.",
          },
          {
            name: "Hotel Blue Nile",
            distance: "7 km (Vadakara)",
            details:
              "Popular for Kerala sadhya and non-veg curries (₹150-300); clean, AC seating with takeaway for pilgrims.",
          },
          {
            name: "Local Vegetarian Spots (e.g., Sree Krishna Bhavan)",
            distance: "4-5 km",
            details:
              "Pure veg restaurants serving dosas, idlis, and festival specials (₹80-150); ideal for fasting devotees.",
          },
          {
            name: "Seafood and Malabar Cuisine Outlets",
            distance: "5-6 km (near Vadakara Beach)",
            details:
              "Casual diners like Malabar Kitchen offering fish fry and biryani (₹200-400); open late for evening visits.",
          },
        ],
      },
      {
        category: "Healthcare Facilities",
        description:
          "Reliable medical support is accessible for emergencies or routine care, with 24/7 services in Vadakara town to ensure devotee safety during extended stays.",
        icon: "mdi-medical-bag ",
        options: [
          {
            name: "Vatakara Co-operative Hospital",
            distance: "5 km",
            details:
              "Multi-specialty facility with 24/7 emergency, pharmacy, and specialties like orthopedics and general medicine; affordable co-op rates.",
          },
          {
            name: "Government Taluk Hospital, Vadakara",
            distance: "6 km",
            details:
              "Free/public emergency care, OPD, and basic diagnostics; handles common ailments for pilgrims.",
          },
          {
            name: "Parco Hospital",
            distance: "6 km",
            details:
              "Private multi-specialty with ICU, ambulance, and 24/7 ER; quick consultations for outpatients.",
          },
          {
            name: "Cee Yam Hospital",
            distance: "5 km",
            details:
              "Modern private hospital focusing on general surgery and maternity; on-site pharmacy.",
          },
          {
            name: "Local Clinics and Pharmacies",
            distance: "Within 5 km",
            details:
              "Ayurvedic centers and 24-hr chemists for minor needs like fever meds or ointments.",
          },
        ],
      },
      {
        category: "Fuel Stations and Essential Services",
        description:
          "Convenient stops for vehicle refueling, cash access, and daily necessities, helping devotees manage travel logistics without hassle.",
        icon: "mdi-gas-station",
        options: [
          {
            name: "Indian Oil Petrol Pump",
            distance: "4 km (on NH-66)",
            details:
              "Full-service station with diesel, petrol, air pump, and convenience store; open 24/7.",
          },
          {
            name: "Bharat Petroleum Pump",
            distance: "5.5 km",
            details:
              "Reliable fuel outlet with EV charging points; nearby auto repair if needed.",
          },
          {
            name: "ATMs and Banks",
            distance: "Within 4 km (Vadakara town)",
            details:
              "SBI, Canara Bank branches and ATMs (e.g., HDFC, ICICI); cash for offerings and digital UPI widely accepted.",
          },
          {
            name: "Convenience Stores",
            distance: "1-3 km",
            details:
              "Local kiranas for puja items, snacks, and toiletries; some stock temple souvenirs.",
          },
        ],
      },
      {
        category: "Transportation",
        description:
          "Easy connectivity via road, rail, and air, with local options for last-mile travel to the temple.",
        icon: "mdi-bus  ",
        options: [
          {
            name: "Local Buses and Autos",
            distance: "On-site access",
            details:
              "Frequent KSRTC buses from Vadakara (₹10-20 fare); autos/taxis for door-to-temple (~₹100-200).",
          },
          {
            name: "Vadakara Railway Station",
            distance: "5 km",
            details:
              "Major stop on Mangalore-Kochi line; trains like Mangalore Express; pre-paid auto stand.",
          },
          {
            name: "Calicut International Airport",
            distance: "77-87 km",
            details:
              "Nearest airport with taxis (~₹1500-2000) or buses; Kannur Airport alternative (55 km).",
          },
          {
            name: "Car Rentals and Cabs",
            distance: "Available in Vadakara",
            details:
              "Ola/Uber or local cabs for day trips (~₹10/km); parking at temple for self-drive.",
          },
        ],
      },
      {
        category: "Shopping and Souvenirs",
        description:
          "Places to buy puja essentials, local crafts, and mementos reflecting Kerala's heritage, enhancing the devotional experience.",
        icon: "mdi-cart",
        options: [
          {
            name: "Temple Counters",
            distance: "On-site",
            details:
              "Official stalls for coconuts, flowers, kumkum, and prasadam packets (~₹20-100).",
          },
          {
            name: "Vadakara Markets",
            distance: "4-5 km",
            details:
              "Local bazaars for Kerala spices, handicrafts, and Kalaripayattu souvenirs like wooden artifacts.",
          },
          {
            name: "Sargaalaya Craft Village (Iringal)",
            distance: "10 km",
            details:
              "Artisan hub for handlooms, metalwork, and temple-inspired jewelry; workshops available.",
          },
        ],
      },
      {
        category: "Nearby Attractions",
        description:
          "Complementary sites for cultural immersion, allowing devotees to extend their visit with spiritual or scenic outings.",
        icon: "mdi-map-marker-star",
        options: [
          {
            name: "Thacholi Manikkoth Temple",
            distance: "2 km",
            details:
              "Historic shrine linked to Kalaripayattu hero Thacholi Othenan; serene spot for additional prayers.",
          },
          {
            name: "Vadakara Beach and Sandbanks",
            distance: "6 km",
            details:
              "Relaxing beach with river confluence; ideal for evening walks post-darshan.",
          },
          {
            name: "Muthappan Temple (Parassini Madham)",
            distance: "15 km (nearby option)",
            details:
              "Famous for theyyam rituals; cultural extension for folklore enthusiasts.",
          },
          {
            name: "Lokanarkavu Kalaripayattu Academy",
            distance: "On-site vicinity",
            details:
              "Watch or learn martial arts sessions; ties into temple's warrior heritage.",
          },
        ],
      },
    ],
  },
];

// openPanels will hold arrays of open indexes per category:
// e.g. openPanels[0] = [0,2] means category 0 has panels 0 and 2 open.
const openPanels = reactive({});

// initialize openPanels keys for existing categories (empty => all collapsed)
onMounted(() => {
  const categories = Temples_Facilities[0].accessibility_and_facilities || [];
  categories.forEach((_, idx) => {
    // ensure each category starts with an array (collapsed)
    if (!openPanels[idx]) openPanels[idx] = [];
  });
});

/* helpers */

// returns true if panel i in category k is open
function isPanelOpen(k, i) {
  return Array.isArray(openPanels[k]) && openPanels[k].includes(i);
}

// toggle single panel open/close (doesn't affect other panels)
function togglePanel(k, i) {
  if (!Array.isArray(openPanels[k])) openPanels[k] = [];
  const idx = openPanels[k].indexOf(i);
  if (idx === -1) {
    // open it
    openPanels[k].push(i);
  } else {
    // close it
    openPanels[k].splice(idx, 1);
  }
}

// returns true if every panel in category k is open
function isAllOpen(k) {
  const options = Temples_Facilities[0].accessibility_and_facilities?.[k]?.features || [];
  if (!Array.isArray(openPanels[k])) return false;
  return openPanels[k].length === options.length && options.length > 0;
}

// toggle all panels for category k (expand all or collapse all)
function toggleAll(k) {
  const options = Temples_Facilities[0].accessibility_and_facilities?.[k]?.features || [];
  if (!openPanels[k]) openPanels[k] = [];

  if (isAllOpen(k)) {
    // collapse all
    openPanels[k] = [];
  } else {
    // expand all => set indexes [0,1,2,...]
    openPanels[k] = options.map((_, i) => i);
  }
}
</script>

<style scoped>
/* small adjustments if you want */
.bg-orange {
  background: #f2b84b; /* replace with your theme color or class */
}
</style>
