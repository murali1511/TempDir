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
                    >
                      <v-chip
                        v-for="(d, i) in temple.deities"
                        :key="i"
                        size="small"
                        variant="flat"
                        class="text-white"
                        color="purple"
                        prepend-icon="mdi-flower-tulip"
                      >
                        {{ d.name }}
                      </v-chip>
                    </div>
                  </v-container>
                </div>
              </div>
            </v-card>

            <!-- Timeline Card -->
            <v-card class="glass rounded-2xl elevation-4 mb-10">
              <v-card-text>
                <div
                  v-html="historyContent"
                  :class="
                    $i18n.locale.value === 'en'
                      ? 'text-body-2 c description-text_en  text-justify'
                      : 'text-caption description-text_ml'
                  "
                />
                <v-divider class="my-6" />

                <!-- contents / sections from JSON -->
                <v-row>
                  <v-col cols="12" md="7">
                    <div class="text-subtitle-1 font-weight-bold mb-2">Summary</div>
                    <v-expansion-panels variant="default " multiple class="rounded-xl">
                      <v-expansion-panel v-for="(s, i) in temple?.history || []" :key="i">
                        <v-expansion-panel-title color="#f2dfa7">
                          <v-icon class="mr-2">mdi-book-open-variant</v-icon>
                          {{ s.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-boady-2">
                          <div
                            v-if="Array.isArray(s.items)"
                            class="d-flex flex-column ga-2"
                          >
                            <div v-for="(item, j) in s.items" :key="j" class="d-flex">
                              <v-icon class="mr-2">mdi-circle-small</v-icon>
                              {{ item }}
                            </div>
                          </div>
                          {{ s.content }}
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
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

// JS (not TS) per your preference
// const props = defineProps({
//   temple: { type: Object, required: true }
// })

import { useDisplay } from "vuetify";

const data = {
  TID: "T0001",
  schedule: [
    {
      color: "green",
      event: "Opening of Sanctum(Sree Kovil)",
      size: "large",
      time: "04:00 AM",
    },
    { color: "orange", event: "Abhishekam", size: "small", time: "04:30 AM" },
    { color: "orange", event: "Usha Pooja", size: "small", time: "05:00 AM" },
    {
      color: "orange",
      event: "Ethruthu pooja",
      size: "small",
      time: "05:30 AM",
    },
    { color: "red", event: "Closing", size: "small", time: "06:15 AM" },
    { color: "green", event: "Opening", size: "small", time: "07:15 AM" },
    { color: "orange", event: "Seeveli", size: "small", time: "07:30 AM" },
    {
      color: "red",
      event: "Closing & Pantheeradi pooja",
      size: "small",
      time: "08:00 AM",
    },
    { color: "green", event: "Opening", size: "small", time: "08:30 AM" },
    { color: "red", event: "Closing 12:00PM", size: "large", time: "11:30 AM" },
    { color: "green", event: "Opening", size: "large", time: "04:30 PM" },
    {
      color: "orange",
      event: "Deeparadhana & Niveddyam. Athazha Pooja",
      size: "small",
      time: "07:00 PM",
    },
    {
      color: "red",
      event: "Athazha siveeli & Closing for the day.",
      size: "large",
      time: "07:45 PM",
    },
  ],
  short_schedule: "4:00am - 7:45pm",
};
const colorMap = {
  green: "success",
  orange: "warning",
  red: "error",
};

const fullDate = computed(() => {
  const d = new Date();
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
});

// const temple = temples[1];
const { xs, sm, mdAndUp } = useDisplay();
const avatarSize = computed(() => {
  if (xs.value) return 30;
  if (sm.value) return 45;
  if (mdAndUp.value) return 56;
  return 56;
});

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const historyContent = ref("Loading about content..."); // Placeholder text

const temple = temples.find((t) => t.TID === localStore.templeID);
// Watch for changes in language or store data

watchEffect(() => {
  const locale = $i18n.locale.value;
  const history = localStore.history;

  historyContent.value =
    locale === "en"
      ? history.detail?.en || "Content not available in English."
      : history.detail?.ml || "Content not available in Malayalam.";
});

console.log(historyContent.value);
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
</style>
