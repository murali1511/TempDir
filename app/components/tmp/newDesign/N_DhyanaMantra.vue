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
          </div>

          <div class="absolute inset-0 d-flex align-end"></div>
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
            <v-row>
              <v-col
                v-for="(entry, idx) in localStore.mantras"
                :key="idx"
                cols="12"
                class="mb-6"
              >
                <v-card
                  elevation="2"
                  rounded="lg"
                  class="pa-4 glass"
                  role="article"
                  :aria-labelledby="`entry-${idx}-title`"
                >
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-img
                      :src="`/diety_img/${entry.deityID}_mini.png`"
                      max-height="80"
                      max-width="80"
                      class="rounded-lg"
                    />

                    <div class="d-flex justify-center mt-4"></div>

                    <div class="glass d-flex align-center">
                      <div>
                        <div
                          :id="`entry-${idx}-title`"
                          class="glass text-h6 font-weight-bold"
                        >
                          {{ entry.deity }}
                        </div>
                        <div class="text-body-2 opacity-75">
                          {{ entry.type }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <v-divider />

                  <v-row class="mt-4" dense>
                    <v-col cols="12" md="6">
                      <div class="mb-2 text-subtitle-2 font-weight-medium">Script</div>
                      <v-card class="pa-3 glass" variant="elevated" elevation="0">
                        <div
                          style="
                            font-size: 1.1rem;
                            line-height: 1.6;
                            white-space: pre-wrap;
                          "
                          class="text-red font-weight-bold"
                        >
                          {{ entry.script }}
                        </div>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="mb-2 text-subtitle-2 font-weight-medium">
                        Transliteration
                      </div>
                      <v-card class="pa-3 glass" variant="elevated" elevation="0">
                        <div
                          style="font-size: 1rem; line-height: 1.6; white-space: pre-wrap"
                          class="text-red font-weight-medium"
                        >
                          {{ entry.transliteration }}
                        </div>
                      </v-card>
                    </v-col>

                    <v-col cols="12" class="mt-4">
                      <div class="mb-2 text-subtitle-2 font-weight-medium">Meaning</div>
                      <v-card class="pa-3 glass" variant="elevated" elevation="0">
                        <div style="line-height: 1.6; white-space: pre-wrap">
                          {{ entry.meaning }}
                        </div>
                      </v-card>
                    </v-col>

                    <v-col cols="12" class="mt-4">
                      <!-- <v-card class="glass"> -->
                      <div class="mb-2 text-subtitle-2 font-weight-medium">Blessings</div>

                      <v-list dense class="glass">
                        <v-list-item
                          v-for="(blessing, bIndex) in entry.blessings"
                          :key="bIndex"
                          class="pa-0 mt-n2 mb-n2"
                        >
                          <v-row no-gutters class="align-center">
                            <!-- Icon Column -->
                            <v-col cols="auto" class="d-flex ml-2 text-right">
                              <v-icon color="red darken-1" size="20"
                                >mdi-star-circle</v-icon
                              >
                            </v-col>
                            <!-- Text Column -->
                            <v-col class="pa-0 ma-0 ml-2">
                              <span
                                class="blessing-text"
                                :class="
                                  $i18n.locale.value === 'en'
                                    ? 'text-body-2 text-justify'
                                    : 'text-caption'
                                "
                                >{{ blessing }}</span
                              >
                            </v-col>
                          </v-row>
                        </v-list-item>
                      </v-list>
                      <!-- </v-card> -->
                    </v-col>
                  </v-row>
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

// static temple JSON (kept inline for ease of preview); you can replace this by fetching from Firestore.
const MantraJson = {
  TID: "T0001",
  entries: [
    {
      deity: "Ganapathi",
      type: "Dhyana Mantra",
      script:
        "ॐ गजाननं भूतगणादिसेवितं कपित्थजम्बूफलचारुभक्षणम्। उमासुतं शोकविनाशकारकं नमामि विघ्नेश्वरपादपङ्कजम्॥",
      transliteration:
        "Om Gajaananam Bhoota Ganaadi Sevitam, Kapitta Jamboo Phala Saara Bhakshanam Umaasutam Shoka Vinaasha Kaarakam, Namaami Vighneswara Paada Pankajam",
      meaning:
        "Salutations to Lord Ganesha, the elephant-faced one, worshipped by all beings and spirits. He is the beloved son of Goddess Uma (Parvati), the destroyer of sorrows, and the remover of obstacles. I bow to the lotus feet of the Lord of all obstacles.",
      blessings: [
        "Removal of obstacles and challenges.",
        "Success in endeavors and new beginnings.",
        "Wisdom, intellect, and prosperity.",
        "Peace, happiness, and spiritual growth.",
      ],
    },
    {
      deity: "Bhagavathi",
      type: "Dhyana Mantra",
      script:
        "ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी। दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तुते॥",
      transliteration:
        "Om Jayanti Mangala Kaali, Bhadra Kaali Kapalini Durga Kshama Shiva Dhaatri, Swaha Swadha Namostute",
      meaning:
        "Salutations to Goddess Bhagavathi, who is the embodiment of victory, auspiciousness, and power. She is the fierce Kali, the compassionate Durga, and the nurturing mother. She is the giver of life and the sustainer of the universe.",
      blessings: [
        "Protection from negative energies and evil forces.",
        "Strength, courage, and fearlessness.",
        "Blessings for prosperity, health, and family well-being.",
        "Spiritual growth and liberation.",
      ],
    },
  ],
};

const localStore = useLocalStore();
// localStore.setTempleID("T0002");
const temple = temples.find((t) => t.TID === localStore.templeID);

const mantras = computed(() => {
  const localeKey = `data_${$i18n.locale.value}`;
  return mantras[localeKey]?.mantras || [];
});

onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Mantra(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});

// Make temple a computed so template can access temple.TID and temple.entries safely
// const mantras = MantraJson?.TID === localStore.templeID ? MantraJson.entries : [];

console.log(localStore.mantras);

// const temple = temples[1];
const { xs, sm, mdAndUp } = useDisplay();
const avatarSize = computed(() => {
  if (xs.value) return 30;
  if (sm.value) return 45;
  if (mdAndUp.value) return 56;
  return 56;
});

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const historyContent = ref("Loading about content..."); // Placeholder text

// const temple = temples.find((t) => t.TID === localStore.templeID);
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
