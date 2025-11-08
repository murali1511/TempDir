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
                    <div
                      class="d-flex align-center flex-wrap ga-3"
                      :class="$vuetify.display.smAndUp ? '' : 'justify-center'"
                    >
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
                      :class="$vuetify.display.smAndUp ? 'pl-15' : 'justify-center'"
                    >
                      <v-chip
                        v-for="(d, i) in festivals"
                        :key="i"
                        size="small"
                        variant="flat"
                        class="text-white"
                        :style="{
                          background: d.theme.gradient[0],
                          transform: tab === i ? 'scale(1.1)' : 'scale(1)',
                          border:
                            tab === i
                              ? '2px solid rgba(255,255,255,0.8)'
                              : '1px solid rgba(255,255,255,0.3)',
                        }"
                        prepend-icon="mdi-fire"
                        :color="d.theme.gradient[0]"
                        @click="tab = i"
                      >
                        {{ d.festivalName.en }} -
                        <span class="font-weight-bold"
                          >{{ d.date.duration.split(" ")[0] }}D</span
                        >
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
              :color="currentFestival.theme.gradient[0]"
            >
              <v-card-title
                class="text-h6 pl-6"
                :style="{ background: gradientStyle(tab) }"
              >
                {{ currentFestival.festivalName.en }}</v-card-title
              >
              <v-divider :thickness="3" :color="accent(tab)" />

              <v-window v-model="tab" class="pa-4 pa-md-6">
                <v-window-item v-for="(f, i) in festivals" :key="'pane-' + i" :value="i">
                  <v-row :class="['ga-4', 'festival-pane']">
                    <!-- LEFT STACK -->
                    <v-col cols="12" class="d-flex flex-column ga-4">
                      <!-- Dates & Timings -->
                      <v-card class="rounded-2xl" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-calendar-clock</v-icon>
                          <span class="text-subtitle-1 font-weight-bold"
                            >Dates & Timings</span
                          >
                          <v-spacer />
                          <v-chip text-color="black" label>{{ f.date.duration }}</v-chip>
                        </v-card-title>
                        <v-card-text>
                          <div class="d-flex flex-wrap ga-3 mb-4">
                            <v-chip text-color="black" label
                              ><strong>Start: </strong>&nbsp;<span class="text-caption">{{
                                f.date.startDate
                              }}</span></v-chip
                            >
                            <v-chip text-color="black" label
                              ><strong>End: </strong>&nbsp;<span class="text-caption">{{
                                f.date.endDate
                              }}</span></v-chip
                            >
                          </div>
                          <div class="text-subtitle-2 mb-2 font-weight-bold">
                            Festival Daily Schedule
                          </div>
                          <v-timeline density="compact" align="start">
                            <v-timeline-item
                              v-for="(t, idx) in f.timings"
                              :key="'time-' + idx"
                              :dot-color="accent(i)"
                              size="small"
                            >
                              <div class="font-weight-medium mt-2">
                                {{ t.time }} - {{ t.event }}
                              </div>
                            </v-timeline-item>
                          </v-timeline>
                        </v-card-text>
                      </v-card>

                      <!-- Significance & Rituals -->
                      <v-card class="rounded-2xl elevation-3" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-hand-clap</v-icon>
                          <span class="text-subtitle-1 font-weight-bold"
                            >Significance & Special Rituals</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <p class="mb-4 text-body-1">{{ f.significance }}</p>
                          <div class="text-subtitle-2 mb-2 font-weight-black">
                            Special Rituals
                          </div>
                          <v-chip-group column>
                            <v-chip
                              v-for="(r, idx) in f.specialRituals"
                              :key="'ritual-' + idx"
                              :color="accent(i)"
                              variant="tonal"
                              label
                              class="mb-1 text-caption"
                              >{{ r }}</v-chip
                            >
                          </v-chip-group>
                        </v-card-text>
                      </v-card>

                      <!-- Cultural Programs -->
                      <v-card
                        v-if="f.culturalPrograms?.length"
                        class="rounded-2xl elevation-3"
                        :style="gradientStyle(i)"
                      >
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-music-note-outline</v-icon>
                          <span class="text-subtitle-1 font-weight-bold"
                            >Cultural Programs</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <v-table
                            density="comfortable"
                            class="rounded-xl shadow-sm"
                            style="background-color: transparent !important"
                          >
                            <thead>
                              <tr>
                                <th class="font-weight-black">Day</th>
                                <th class="font-weight-black">Program</th>
                                <th class="font-weight-black">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(c, idx) in f.culturalPrograms"
                                :key="'cp-' + idx"
                              >
                                <td>{{ c.day }}</td>
                                <td>{{ c.program }}</td>
                                <td>{{ c.time }}</td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-card-text>
                      </v-card>

                      <!-- RIGHT STACK -->
                      <!-- <v-col cols="12" md="4" class="d-flex flex-column ga-4"> -->
                      <!-- Offerings & Prasad -->
                      <v-card class="rounded-2xl elevation-3" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-bowl-mix</v-icon>
                          <span class="text-subtitle-1 font-weight-bold"
                            >Offerings & Prasad</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <div class="mb-2 text-subtitle-2 font-weight-bold">Prasad</div>
                          <v-chip
                            :color="accent(i)"
                            variant="elevated"
                            label
                            class="mb-3"
                            >{{ f.prasadOffering }}</v-chip
                          >
                          <div class="text-subtitle-2 mb-2 font-weight-bold">
                            Offerings (Vazhipadu)
                          </div>
                          <div class="d-flex flex-wrap ga-2">
                            <v-chip
                              v-for="(o, idx) in f.offerings || []"
                              :key="'off-' + idx"
                              :color="ablack"
                              variant="tonal"
                              label
                              class="text-caption"
                              >{{ o }}</v-chip
                            >
                          </div>
                        </v-card-text>
                      </v-card>

                      <!-- Dress Code -->
                      <v-card class="rounded-2xl elevation-3" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-tshirt-crew</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Dress Code</span>
                        </v-card-title>
                        <v-card-text class="transparant-bg">
                          <v-list
                            density="compact"
                            class="ml-n4"
                            style="background-color: transparent !important"
                          >
                            <v-list-item>
                              <template #prepend
                                ><v-icon :color="accent(i)"
                                  >mdi-gender-male</v-icon
                                ></template
                              >
                              <v-list-item-title
                                >Men:
                                {{
                                  f.dressCode?.men || "Traditional attire suggested"
                                }}</v-list-item-title
                              >
                            </v-list-item>
                            <v-list-item>
                              <template #prepend
                                ><v-icon :color="accent(i)"
                                  >mdi-gender-female</v-icon
                                ></template
                              >
                              <v-list-item-title
                                >Women:
                                {{
                                  f.dressCode?.women || "Traditional attire suggested"
                                }}</v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>

                      <!-- Facilities -->
                      <v-card class="rounded-2xl elevation-3" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-home-group</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Facilities</span>
                        </v-card-title>
                        <v-card-text>
                          <v-list
                            density="compact"
                            class="ml-n4"
                            style="background-color: transparent !important"
                          >
                            <v-list-item
                              v-for="(fc, idx) in f.facilities || []"
                              :key="'fac-' + idx"
                            >
                              <template #prepend
                                ><v-icon :color="accent(i)"
                                  >mdi-checkbox-marked-circle-outline</v-icon
                                ></template
                              >
                              <v-list-item-title class="text-capitalize">{{
                                fc.head
                              }}</v-list-item-title>
                              {{ fc.content }}
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>

                      <!-- Digital Coverage -->
                      <v-card
                        v-if="f.digitalCoverage"
                        class="rounded-2xl elevation-3"
                        :style="gradientStyle(i)"
                      >
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-video</v-icon>
                          <span class="text-subtitle-1 font-weight-bold"
                            >Live & Social</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <div class="d-flex flex-column ga-2">
                            <v-btn
                              v-if="f.digitalCoverage.liveStream"
                              :href="f.digitalCoverage.liveStream"
                              target="_blank"
                              :color="accent(i)"
                              prepend-icon="mdi-youtube"
                              >Watch Live</v-btn
                            >
                            <div
                              v-if="f.digitalCoverage.socialMedia?.length"
                              class="d-flex flex-wrap ga-2"
                            >
                              <v-btn
                                v-for="(link, idx) in f.digitalCoverage.socialMedia"
                                :key="'sm-' + idx"
                                :href="link"
                                target="_blank"
                                variant="tonal"
                                size="small"
                                :color="black"
                                prepend-icon="mdi-open-in-new"
                                >Social {{ idx + 1 }}</v-btn
                              >
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>

                      <!-- Contact -->
                      <v-card class="rounded-2xl elevation-3" :style="gradientStyle(i)">
                        <v-card-title class="d-flex align-center ga-2">
                          <v-icon :color="accent(i)">mdi-phone</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Contact</span>
                        </v-card-title>
                        <v-card-text>
                          <v-list
                            density="compact"
                            class="ml-n4"
                            style="background-color: transparent !important"
                          >
                            <v-list-item
                              v-for="(c, idx) in f.contactInfo || []"
                              :key="'ci-' + idx"
                            >
                              <template #prepend
                                ><v-icon :color="accent(i)"
                                  >mdi-information-outline</v-icon
                                ></template
                              >
                              <v-list-item-title>{{ c.head }}</v-list-item-title>
                              <v-list-item-subtitle class="text-wrap">{{
                                c.content
                              }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
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
// localStore.setTempleID("T0002");

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const aboutContent = ref("Loading about content..."); // Placeholder text

const temple = temples.find((t) => t.TID === localStore.templeID);

// Multi-festival data with theme colors & hero images per festival
const festivals = ref([
  {
    festivalName: { en: "Sree Krishna Jayanthi", ml: "ശ്രീകൃഷ്ണ ജയന്തി" },
    theme: {
      color: "indigo-accent-3",
      gradient: ["#3fb562ff", "#c8c7c9ff"],
      image: "/images/KL13-15.jpg",
    },
    date: {
      startDate: "25th August 2024 (9 ചിങ്ങ 1200)",
      endDate: "28th August 2024 (12 ചിങ്ങ 1200)",
      duration: "4 days",
    },
    timings: [
      { event: "Morning Pooja", time: "5:30 AM" },
      { event: "Special Procession", time: "10:00 AM" },
      { event: "Evening Aarti", time: "6:30 PM" },
    ],
    significance:
      "Sree Krishna Jayanthi celebrates the birth of Lord Krishna, symbolizing the triumph of good over evil and the incarnation of Lord Vishnu to protect Dharma.",
    specialRituals: [
      "Special Abhishekam at 9:00 AM",
      "Procession of Lord Krishna at 10:00 AM",
      "Recitation of Bhagavad Gita in the evening",
      "Children costume contest",
    ],
    prasadOffering: "Sweet Pongal (പായസം)",
    dressCode: { men: "Traditional dhotis", women: "Saris or long skirts" },
    offerings: ["Annadanam", "Tulabharam", "Butter Offering"],
    culturalPrograms: [
      {
        day: "26th Aug",
        program: "Bhajans & Classical Dance",
        time: "7:00 PM",
      },
      { day: "27th Aug", program: "Kathakali Performance", time: "8:00 PM" },
    ],
    sevaOpportunities: [
      {
        seva: "Annadanam Contribution",
        details: "Devotees can sponsor meals.",
      },
      {
        seva: "Volunteer Service",
        details: "Assist in managing queues and prasadam distribution.",
      },
    ],
    donationInfo: {
      bankDetails: "ABC Bank, A/C 123456789, IFSC ABCD0123456",
      onlineLink: "https://www.templefestival.com/donate",
    },
    digitalCoverage: {
      liveStream: "https://youtube.com/templefestival",
      socialMedia: ["https://facebook.com/temple", "https://instagram.com/temple"],
    },
    facilities: [
      { head: "accommodation", content: "Limited rooms. Contact temple." },
      { head: "parking", content: "Parking 500m from temple." },
      { head: "food", content: "Free meals during festival." },
      { head: "firstAid", content: "Medical team & ambulance on-site." },
    ],
    contactInfo: [
      { head: "Phone", content: "+91 9876543210" },
      { head: "Email", content: "info@temple.com" },
    ],
  },
  {
    festivalName: { en: "Annual Utsavam", ml: "വാർഷിക ഉത്സവം" },
    theme: {
      color: "amber-darken-2",
      gradient: ["#c7802eff", "#fcffffff"],
      image:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1400&auto=format&fit=crop",
    },
    date: {
      startDate: "14th January 2025 (Makaram 29)",
      endDate: "20th January 2025 (Kumbham 5)",
      duration: "7 days",
    },
    timings: [
      { event: "Flag Hoisting (Kodiyettam)", time: "8:00 AM" },
      { event: "Ezhunnallippu", time: "6:00 PM" },
      { event: "Aarattu (Final Day)", time: "4:00 PM" },
    ],
    significance:
      "The Annual Utsavam honors the presiding deities with grand rituals, processions, and community celebrations for prosperity and protection.",
    specialRituals: [
      "Kalabhabhishekam",
      "Chenda Melam & Panchari",
      "Aarattu on the final day",
    ],
    prasadOffering: "Aval Nivedyam",
    dressCode: {
      men: "Mundu (no shirt inside sanctum)",
      women: "Kasavu sari or traditional wear",
    },
    offerings: ["Udayasthamana Pooja", "Bhagavathi Seva", "Pushpanjali"],
    culturalPrograms: [
      { day: "16th Jan", program: "Nadaswaram & Thayambaka", time: "7:30 PM" },
      { day: "18th Jan", program: "Ottanthullal", time: "8:00 PM" },
    ],
    sevaOpportunities: [
      {
        seva: "Cleaning Seva",
        details: "Morning cleaning & flower decoration.",
      },
      {
        seva: "Queue Management",
        details: "Assist senior citizens in queues.",
      },
    ],
    donationInfo: {
      bankDetails: "XYZ Bank, A/C 987654321, IFSC WXYZ0987654",
      onlineLink: "",
    },
    digitalCoverage: { liveStream: "", socialMedia: [] },
    facilities: [
      { head: "water", content: "Filtered drinking water counters." },
      { head: "toilets", content: "Clean toilets near north gopuram." },
      { head: "parking", content: "Paid parking at school ground (800m)." },
    ],
    contactInfo: [
      { head: "Helpline", content: "+91 91234 56789" },
      {
        head: "Office Hours",
        content: "9:00 AM – 5:00 PM (festival days extended)",
      },
    ],
  },
]);

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

// Derived
const currentFestival = computed(() => festivals.value[tab.value] || festivals.value[0]);
const heroImage = computed(() => currentFestival.value?.theme?.image || temple.home_pic);

// Accent color for a given festival index
const accent = (i) => festivals.value[i]?.theme?.color || "deep-purple-accent-4";

// Dynamic gradient style per festival card
const gradientStyle = (i) => {
  const g = festivals.value[i]?.theme?.gradient || ["#6A11CB", "#2575FC"];
  return {
    background: `linear-gradient(180deg, white, ${g[0]}, ${g[1]})`,
  };
};
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
