<template>
  <div class="ma-0" max-width="1100">
    <v-card :class="[' mx-auto rounded-lg g_border mt-6']" :color="colorScheme[1]">
      <v-card-title
        class="d-flex justify-space-between align-center text-subtitle-1 grab"
        :style="`color: ${colorScheme[0]}`"
      >
        {{ $t("poojatime") }}
      </v-card-title>

      <section class="pl-2 pr-2 bg-color-gold">
        <v-card class="rounded-2xl overflow-hidden elevation-6">
          <!-- HERO -->
          <div class="relative">
            <v-img
              :src="temple?.heroImage || defaultHero"
              height="280"
              cover
              class="hero-img"
            />
            <div class="hero-overlay about-card" />
          </div>

          <!-- BODY -->

          <!-- main description  START-->
          <v-container>
            <!-- Hero / Summary Card -->
            <v-card class="hero-card rounded-2xl elevation-8 overflow-hidden mb-6">
              <div class="relative">
                <div class="hero-overlay about-card" />
                <div class="absolute inset-0 d-flex align-end">
                  <v-container class="pb-5">
                    <div class="d-flex align-center flex-wrap ga-3">
                      <v-avatar
                        :size="avatarSize"
                        class="ring"
                        v-if="$vuetify.display.smAndUp"
                      >
                        <v-img :src="temple?.logo || deityFallback" />
                      </v-avatar>
                      <div class="text-black">
                        <div
                          class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold"
                        >
                          {{ temple?.name }}
                        </div>
                        <div class="text-body-2 opacity-90">
                          {{ temple?.location?.village }},
                          {{ temple?.location?.district }},
                          {{ temple?.location?.state }}
                        </div>
                      </div>
                      <v-spacer />

                      <!-- CTAs -->
                      <div class="d-flex ga-2 justify-center">
                        <v-btn
                          color="white"
                          variant="elevated"
                          class="text-primary"
                          :href="`tel:${temple?.contact?.phone}`"
                          prepend-icon="mdi-phone"
                          size="small"
                        >
                          {{ phonePretty }}
                        </v-btn>
                        <v-btn
                          color="white"
                          variant="elevated"
                          class="text-primary"
                          prepend-icon="mdi-map-marker-radius"
                          :href="mapsUrl"
                          target="_blank"
                          size="small"
                        >
                          Directions
                        </v-btn>
                      </div>
                    </div>
                    <!-- deity chips -->
                    <div
                      v-if="temple?.deities?.length"
                      class="mb-4 d-flex flex-wrap ga-2 mt-4"
                      :class="$vuetify.display.smAndUp ? 'pl-15' : ''"
                    >
                      <v-chip
                        v-for="(d, i) in temple.deities"
                        :key="i"
                        :size="$vuetify.display.smAndUp ? 'large' : 'small'"
                        variant="flat"
                        class="text-white transition-all"
                        :class="tab === i ? 'elevation-6 selected-chip' : 'elevation-1'"
                        :style="{
                          background: d.gradient,
                          transform: tab === i ? 'scale(1.05)' : 'scale(1)',
                          border:
                            tab === i
                              ? '2px solid rgba(255,255,255,0.8)'
                              : '1px solid rgba(255,255,255,0.3)',
                        }"
                        @click="tab = i"
                        link
                      >
                        <v-avatar start>
                          <v-img :src="d.image"></v-img>
                        </v-avatar>
                        {{ deities_list[i] }}
                      </v-chip>
                    </div>

                    <!-- quick facts -->
                  </v-container>
                </div>
              </div>
            </v-card>

            <!-- Timeline Card -->
            <!-- <v-card class="glass rounded-2xl elevation-4 mb-10">
              <v-card-text> -->
            <!-- contents / sections from JSON -->
            <v-card
              class="rounded-2xl elevation-5 overflow-hidden mb-6"
              :style="{ background: temple.deities[tab].gradient }"
            >
              <v-card-title class="text-h6 pl-6">
                <v-avatar size="small">
                  <v-img :src="temple.deities[tab].image"></v-img>
                </v-avatar>
                {{ temple.deities[tab].name }}</v-card-title
              >
              <v-divider :thickness="3" color="black" />
              <v-card-text>
                <v-data-table
                  v-if="filtered_offers.length > 0"
                  :headers="headers"
                  :items="filtered_offers"
                  :items-per-page="8"
                  class="elevation-1 rounded-lg"
                  density="compact"
                  :class="$vuetify.display.smAndUp ? 'pl-8' : ''"
                >
                  <template v-slot:item.name="{ item }">
                    <span class="text-body-2 font-weight-bold pl--6">{{
                      item.name
                    }}</span>
                    <temple-offer-info
                      v-if="item.additionalInfo"
                      :message="item.additionalInfo"
                    ></temple-offer-info>
                  </template>
                  <template v-slot:item.cost="{ item }">
                    <span class="text-body-2 font-weight-bold pl--16">{{
                      item.cost
                    }}</span>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <!-- </v-card-text>
            </v-card> -->
          </v-container>

          <!-- main description END -->
        </v-card>
      </section>
    </v-card>
  </div>
</template>

<script setup>
import { temples } from "@/stores/TempleAbout.js";
import { ref, onMounted, watchEffect } from "vue";
import { useRuntimeConfig } from "#app";
import { useDate } from "vuetify";
import { useLocalStore } from "/stores/localStore.js";

import { useDisplay } from "vuetify";

// const temple = temples[1];
const { xs, sm, mdAndUp } = useDisplay();
const avatarSize = computed(() => {
  if (xs.value) return 30;
  if (sm.value) return 45;
  if (mdAndUp.value) return 56;
  return 56;
});

const localStore = useLocalStore();
const deities_list = ref([]); // List of deities
const selected_deity = ref(""); // Selected deity from the combobox
const subdiety_pooja = ref(""); // Selected deity from the radio group
const isHovering = ref(false); // Example hover state
const { $i18n } = useNuxtApp();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const aboutContent = ref("Loading about content..."); // Placeholder text

const temple = temples.find((t) => t.TID === localStore.templeID);

// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const about = localStore.about;

  aboutContent.value =
    locale === "en"
      ? about?.en || "Content not available in English."
      : about?.ml || "Content not available in Malayalam.";
});

const defaultHero =
  "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop";
const deityFallback =
  "https://images.unsplash.com/photo-1609743522653-6c5b8d9a5f8a?q=80&w=300&auto=format&fit=crop";

const phonePretty = computed(() => {
  const p = temple?.contact?.phone || "";
  // prettify indian numbers (basic)
  return p.replace(/(\d{5})(\d{5})/, "$1 $2");
});

const mapsUrl = computed(() => {
  const loc = temple?.geo;
  if (loc?.lat && loc?.lng) {
    return `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
  }
  const parts = [temple?.name, temple?.address?.city, temple?.address?.state];
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    parts.filter(Boolean).join(" ")
  )}`;
});

// Tab state
const tab = ref(0);

const heroImage = computed(() => currentFestival.value?.theme?.image || temple.home_pic);

// Dynamic gradient style per festival card
const gradientStyle = (i) => {
  const g = festivals.value[i]?.theme?.gradient || ["#6A11CB", "#2575FC"];
  return {
    background: `linear-gradient(180deg, white, ${g[0]}, ${g[1]})`,
  };
};

// Table headers for v-data-table
const headers = [
  { title: "Offering", key: "name", align: "start" },
  { title: "Amt (INR)", key: "cost", align: "center" },
];
// Fetch offers on component mount
onMounted(async () => {
  try {
    await localStore.Fetch_Offers($i18n.locale.value);
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
});

// Watch for changes in temple_offers and update deities_list
watch(
  () => localStore.temple_offers,
  (newOffers) => {
    if (newOffers && newOffers.length > 0 && newOffers !== "Not Found") {
      deities_list.value = newOffers.map((entry) => entry.deity);

      // Set the first entry of deities_list as the default value for the combobox and radio group
      if (deities_list.value.length > 0) {
        selected_deity.value = deities_list.value[0];
        // subdiety_pooja.value = deities_list.value[0];
      }
    } else {
      deities_list.value = []; // Fallback if offers are empty
    }
  },
  { immediate: true }
);

// Compute filtered offers based on the selected deity
const filtered_offers = computed(() => {
  selected_deity.value = deities_list.value[tab.value];
  if (!selected_deity.value || !localStore.temple_offers) return [];

  // Find the selected deity's offers
  const selectedDeityEntry = localStore.temple_offers.find(
    (entry) => entry.deity === selected_deity.value
  );

  return selectedDeityEntry ? selectedDeityEntry.offers : [];
});

console.log(localStore.temple_offers);
// Derived
</script>

<style>
.about-card {
  background: rgb(var(--v-theme-surface));
}
.hero-img {
  filter: saturate(1.05) contrast(1.03);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(183, 141, 25, 0.55) 100%
  );
}
.lh-md {
  line-height: 1.8;
}
.glass {
  backdrop-filter: saturate(140%) blur(8px);
  background: color-mix(in oklab, var(--v-theme-surface), transparent 35%);
  border: 1px solid color-mix(in oklab, var(--v-theme-on-surface), transparent 88%);
}
.ring {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
}
.contact a {
  color: inherit;
}
.page-bg {
  min-height: 100vh;
  background: radial-gradient(
      1200px 600px at 10% -10%,
      rgba(59, 130, 246, 0.18),
      transparent
    ),
    radial-gradient(900px 500px at 110% 0%, rgba(16, 185, 129, 0.18), transparent),
    linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0));
}

.appbar-gradient {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.1));
}

/* Timeline */
.time-pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 9999px;
  font-variant-numeric: tabular-nums;
  background: rgba(0, 0, 0, 0.06);
}

/* Utility */
.gap-2 > * + * {
  margin-left: 0.5rem;
}

.icon-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.selected-chip {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}
</style>
