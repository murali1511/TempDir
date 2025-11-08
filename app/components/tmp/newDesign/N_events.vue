<template>
  <div class="ma-0" max-width="1100">
    <v-card :class="[' mx-auto rounded-lg g_border mt-6']" :color="colorScheme[1]">
      <v-card-title
        class="d-flex justify-space-between align-center text-subtitle-1 grab"
        :style="`color: ${colorScheme[0]}`"
      >
        {{ $t("near_facilities_h1") }}
      </v-card-title>

      <section class="pl-1 pr-1 bg-color-gold">
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
                    <div class="d-flex flex-wrap ga-3 justify-center">
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
                      class="mb-4 d-flex flex-wrap ga-2 mt-4 justify-center"
                    >
                      <v-chip
                        v-for="(d, i) in temple.deities"
                        :key="i"
                        size="small"
                        variant="flat"
                        class="text-white transition-all"
                        :style="{
                          background: d.gradient,
                          border: '2px solid rgba(10, 10, 10, 0.3)',
                        }"
                      >
                        <v-avatar start>
                          <v-img :src="d.image"></v-img>
                        </v-avatar>
                        {{ d.name }}
                      </v-chip>
                    </div>
                    <!-- END deity chips -->

                    <!-- quick facts -->
                    <v-row dense class="mb-4 d-flex justify-center">
                      <v-col cols="12" md="3">
                        <v-card variant="flat" color="transparent">
                          <div class="text-caption font-weight-bold">Nearest Town</div>
                          <div class="text-body-2">
                            {{ temple?.location?.nearestTown }} ({{
                              temple?.location?.distanceFromTown
                            }})
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-card variant="flat" color="transparent">
                          <div class="text-caption font-weight-bold">Nearest Airport</div>
                          <div class="text-body-2">
                            {{ temple?.location?.nearestAirport }} ({{
                              temple?.location?.distanceFromAirport
                            }})
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="3" v-if="temple?.timings">
                        <v-card variant="flat" color="transparent">
                          <div class="text-caption font-weight-bold">Temple Timings</div>
                          <div class="text-body-2">{{ temple.timings }}</div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </div>
            </v-card>

            <!-- Timeline Card -->
            <v-card class="glass rounded-2xl elevation-4">
              <v-card-title class="text-subtitle-2">{{
                `Today's Events (${format(new Date(), "fullDate")})`
              }}</v-card-title>
              <v-card-text class="ml-n2 mr-n2">
                <!-- <v-card class="glass rounded-2xl elevation-4 mx-2 pa-2" color="#f2dfa7"> -->
                <div v-if="TodaysEventsByTemple.length < 1">No Events Today</div>
                <div
                  v-else
                  :class="
                    $i18n.locale.value === 'en'
                      ? 'text-body-2 c description-text_en  text-justify pt-2 pb-2'
                      : 'text-caption description-text_ml'
                  "
                  v-for="(event, index) in TodaysEventsByTemple"
                  :key="index"
                  class="text-body-1 mt-n3"
                >
                  <!--Start Event Dialog  -->
                  <v-btn
                    @click="openDialog(event)"
                    variant="text"
                    class="text-capitalize"
                  >
                    <v-avatar
                      size="21"
                      class="mr-1 ml-n2"
                      :color="event.eventColor"
                      text-color="white"
                    >
                      {{ index + 1 }}
                    </v-avatar>
                    {{ event.eventTitle }}
                  </v-btn>
                  <v-dialog v-model="dialog" width="auto">
                    <EventDialog
                      :selectedEvent="selectedEvent"
                      @update:dialog="(val) => (dialog = val)"
                    />
                    <!-- <v-card
                      max-width="400"
                      prepend-icon="mdi-update"
                      text="Your application will relaunch automatically after the update is complete."
                      title="Update in progress"
                    >
                      <template v-slot:actions>
                        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
                      </template>
                    </v-card> -->
                  </v-dialog>
                  <!--End Event Dialog  -->
                </div>

                <!-- </v-card> -->
              </v-card-text>
            </v-card>
            <v-card class="mt-5 glass rounded-2xl elevation-4">
              <v-card-text class="d-flex justify-center align-center">
                <panel />
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
import { Temples_Facilities } from "@/stores/facilities.js";
// import { getTodaysEventsByTemple } from "~/utils/TodaysEvents.js";
import { allevents } from "@/stores/events.js";
import { ref, onMounted, watchEffect } from "vue";
import { useRuntimeConfig } from "#app";
import { useLocalStore } from "/stores/localStore.js";
import panel from "/components/tmp/newDesign/panels/panel_events";
import EventDialog from "@/components/tmp/EventDialog.vue";
// import panel from "/components/tmp/newDesign/panels/panel_cultural_performance";
import { useDisplay, useDate } from "vuetify";
const { format, parseIso, diff, date } = useDate();
// Get today's range
const dialog = ref(false);
const selectedEvent = ref(null);

const { start: todayStart, end: todayEnd } = getTodayRange();
const EventsByTemple = allevents.filter((temple) => {
  return temple.TID === "T0001";
});
// console.log("EventsByTemple", EventsByTemple[0].events);
const TodaysEventsByTemple = EventsByTemple[0].events.filter((event) => {
  const startDate = parseDate(event.date?.startDate);
  // startDate.setHours(0, 0, 0, 0);
  const endDate = parseDate(event.date?.endDate) || startDate;
  // endDate.setHours(23, 59, 59, 999);

  if (!startDate) return false;
  // console.log("match", startDate <= todayEnd && endDate >= todayStart);
  // Check if today's range overlaps event duration
  return startDate <= todayEnd && endDate >= todayStart;
});

function parseDate(dateStr) {
  if (!dateStr) return null;
  const str = dateStr.replace(" ", "T"); // make "YYYY-MM-DD HH:MM" valid ISO
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
}

console.log("events for chosen temple:", EventsByTemple[0].events);

// const temple = temples[1];
const { xs, sm, mdAndUp } = useDisplay();
const avatarSize = computed(() => {
  if (xs.value) return 30;
  if (sm.value) return 45;
  if (mdAndUp.value) return 56;
  return 56;
});

const allOpen = ref(true);
const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const aboutContent = ref("Loading about content..."); // Placeholder text

const temple = temples.find((t) => t.TID === localStore.templeID);
// Watch for changes in language or store data

onMounted(async () => {});

watchEffect(() => {});

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

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

function openDialog(event) {
  selectedEvent.value = event;
  dialog.value = true;
}
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
