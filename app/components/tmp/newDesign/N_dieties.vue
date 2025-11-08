<template>
  <div class="ma-0" max-width="1100">
    <v-card :class="[' mx-auto rounded-lg g_border mt-6']" :color="colorScheme[1]">
      <v-card-title
        class="d-flex justify-space-between align-center text-subtitle-1 grab"
        :style="`color: ${colorScheme[0]}`"
      >
        {{ $t("deity_h1") }}
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
              <v-container class="pb-2">
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

          <!-- main description  START-->
          <v-container>
            <v-row class="d-flex justify-center">
              <v-col
                v-for="(deity, index) in temple.deities"
                :key="index"
                cols="12"
                md="6"
                lg="6"
                class="align-center"
              >
                <v-card
                  class="rounded-xl elevation-4 d-flex flex-column h-100 justify-center"
                  :style="{ background: deity.gradient }"
                >
                  <div class="d-flex justify-center mt-4">
                    <v-img
                      :src="deity.image"
                      max-height="220"
                      max-width="180"
                      class="rounded-lg"
                      cover
                    />
                  </div>

                  <v-card-title class="text-h6 font-weight-bold text-center">
                    {{ deity.name }}
                  </v-card-title>

                  <v-card-text>
                    <p
                      v-for="(para, i) in deity.description"
                      :key="i"
                      class="text-body-1 text-justify mb-3"
                    >
                      {{ para }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
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
</style>
