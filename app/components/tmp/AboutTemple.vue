<template>
  <div class="ma-0" max-width="1100">
    <v-card :class="[' mx-auto rounded-lg g_border mt-6']" :color="colorScheme[1]">
      <v-card-title
        class="d-flex justify-space-between align-center text-subtitle-1 grab"
        :style="`color: ${colorScheme[0]}`"
      >
        {{ $t("about_h1") }}
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
            <div class="absolute inset-0 d-flex align-end">
              <v-container class="pb-5">
                <div class="d-flex align-center flex-wrap ga-3">
                  <v-avatar :size="avatarSize" class="ring">
                    <v-img :src="temple?.logo || deityFallback" />
                  </v-avatar>
                  <div class="text-black">
                    <div class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold">
                      {{ temple?.name }}
                    </div>
                    <div class="text-body-2 opacity-90">
                      {{ temple?.location?.village }}, {{ temple?.location?.district }},
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
              </v-container>
            </div>
          </div>

          <!-- BODY -->
          <v-container class="py-6">
            <!-- deity chips -->
            <div v-if="temple?.deities?.length" class="mb-4 d-flex flex-wrap ga-2">
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

            <!-- quick facts -->
            <v-row class="mb-4" dense>
              <v-col cols="12" md="3">
                <v-card variant="flat" color="transparent">
                  <div class="text-caption font-weight-bold">Nearest Town</div>
                  <div class="text-subtitle-1">
                    {{ temple?.location?.nearestTown }} ({{
                      temple?.location?.distanceFromTown
                    }})
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="flat" color="transparent">
                  <div class="text-caption font-weight-bold">Nearest Airport</div>
                  <div class="text-subtitle-1">
                    {{ temple?.location?.nearestAirport }} ({{
                      temple?.location?.distanceFromAirport
                    }})
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3" v-if="temple?.timings">
                <v-card variant="flat" color="transparent">
                  <div class="text-caption font-weight-bold">Temple Timings</div>
                  <div class="text-subtitle-1">{{ temple.timings }}</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3" v-if="temple?.festival?.name">
                <v-card variant="flat" color="transparent">
                  <div class="text-caption font-weight-bold">Major Festival</div>
                  <div class="text-subtitle-1">{{ temple.festival.name }}</div>
                  <div class="text-caption opacity-80">
                    {{ temple.festival.when }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- main description -->
            <v-card variant="text" class="px-1">
              <div
                v-html="aboutContent"
                :class="
                  $i18n.locale.value === 'en'
                    ? 'text-body-2 c description-text_en  text-justify'
                    : 'text-caption description-text_ml'
                "
              />
            </v-card>

            <v-divider class="my-6" />

            <!-- contents / sections from JSON -->
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-subtitle-1 font-weight-bold mb-2">Contents</div>
                <v-expansion-panels variant="default " multiple class="rounded-xl">
                  <v-expansion-panel v-for="(s, i) in temple?.sections || []" :key="i">
                    <v-expansion-panel-title color="#f2dfa7">
                      <v-icon class="mr-2">mdi-book-open-variant</v-icon>
                      {{ s.title }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="Array.isArray(s.items)" class="d-flex flex-column ga-2">
                        <div v-for="(item, j) in s.items" :key="j" class="d-flex">
                          <v-icon class="mr-2">mdi-circle-small</v-icon>
                          <div v-html="item" />
                        </div>
                      </div>
                      <div v-else v-html="s.content" />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>

              <!-- contact / address -->
              <v-col cols="12" md="5">
                <div class="text-subtitle-1 font-weight-bold mb-2">Contacts</div>
                <v-card class="pa-4 rounded-xl contact glass">
                  <div class="d-flex align-center mb-3 text-body-2">
                    <v-icon class="mr-2">mdi-phone</v-icon>
                    <a
                      :href="`tel:${temple?.contact?.phone}`"
                      class="text-decoration-none"
                    >
                      <span class="text-body-2">{{ phonePretty }}</span>
                    </a>
                  </div>
                  <div class="d-flex align-start mb-2 text-body-2">
                    <v-icon class="mr-2">mdi-email-outline</v-icon>
                    <a
                      v-if="temple?.contact?.email"
                      :href="`mailto:${temple.contact.email}`"
                    >
                      {{ temple.contact.email }}
                    </a>
                    <span v-else class="opacity-70">—</span>
                  </div>
                  <div class="d-flex align-start mb-2 text-body-2">
                    <v-icon class="mr-2">mdi-whatsapp</v-icon>
                    <a
                      v-if="temple?.contact?.phone"
                      :href="`mailto:${temple.contact.phone}`"
                    >
                      {{ temple.contact.phone }}
                    </a>
                    <span v-else class="opacity-70">—</span>
                  </div>
                  <div class="d-flex align-start text-body-2">
                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                    <div class="opacity-90">
                      <div>{{ temple?.address?.line1 }}</div>
                      <div>{{ temple?.address?.line2 }}</div>
                      <div>
                        {{ temple?.address?.city }}, {{ temple?.address?.district }},
                        {{ temple?.address?.state }} –
                        {{ temple?.address?.pincode }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
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
</style>
