<template>
  <div class="ma-0" max-width="1100">
    <v-card :class="[' mx-auto rounded-lg g_border mt-6']" :color="colorScheme[1]">
      <v-card-title
        class="d-flex justify-space-between align-center text-subtitle-1 grab"
      >
        {{ $t("etiquette_h1") }}
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
                <!-- contents / sections from JSON -->
                <v-row>
                  <v-col cols="12">
                    <div class="text-subtitle-1 font-weight-bold mb-2">Temple Rules</div>
                    <v-expansion-panels variant="default " multiple class="rounded-xl">
                      <v-expansion-panel v-for="(s, i) in etiquette_list || []" :key="i">
                        <v-expansion-panel-title color="#f2dfa7">
                          <v-icon class="mr-2" v-if="$vuetify.display.smAndUp"
                            >mdi-book-open-variant</v-icon
                          >
                          <span
                            :class="
                              $vuetify.display.smAndUp
                                ? 'text-body-1'
                                : 'text-caption ml-n4'
                            "
                            >{{ s.title }}</span
                          >
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
                          {{ s.description }}
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

const etiquette = {
  en: [
    {
      title: "Dress modestly",
      description:
        "Visitors are expected to wear clean and modest clothing. Avoid revealing or flashy attire. Traditional attire like saree, dhoti, or salwar kameez is preferred in many temples.",
    },
    {
      title: "Remove shoes",
      description:
        "Footwear should always be removed before entering the temple premises. This is a sign of respect and helps maintain the sanctity of the sacred space.",
    },
    {
      title: "Behave quietly",
      description:
        "Maintain silence or speak softly inside the temple. Avoid loud conversations, running, or any disruptive behavior to preserve the atmosphere of devotion.",
    },
    {
      title: "Don't bring food or drink",
      description:
        "Food, drinks, or snacks should not be carried inside the temple halls, except for offerings that are meant for rituals.",
    },
    {
      title: "Don't hug or show affection",
      description:
        "Temples are spaces of devotion. Public displays of affection like hugging or holding hands are discouraged inside the premises.",
    },
    {
      title: "Don't smoke or drink alcohol",
      description:
        "Consumption of alcohol, smoking, or carrying such items into the temple premises is strictly prohibited.",
    },
    {
      title: "Don't lie down or sleep",
      description:
        "Avoid lying down, sitting casually, or sleeping inside the temple premises as it is considered disrespectful.",
    },
    {
      title: "Bring an offering",
      description:
        "It is customary to bring offerings such as flowers, fruits, coconuts, or incense to present before the deity as a mark of devotion.",
    },
    {
      title: "Cover your head",
      description:
        "In some temples, especially in northern India, covering the head with a cloth, shawl, or dupatta is a sign of respect while praying.",
    },
    {
      title: "Don't visit during menstrual period",
      description:
        "According to traditional customs, women are advised not to enter temple sanctums during menstruation, as the body is considered to be in a natural cleansing process.",
    },
  ],
  ml: [
    {
      title: "വിനയത്തോടെ വസ്ത്രധാരണം ചെയ്യുക",
      description:
        "ക്ഷേത്രത്തിലെത്തുന്നവർ ശുദ്ധവും വിനീതവുമായ വസ്ത്രം ധരിക്കണം. തുറന്നുകാണിക്കുന്നതോ കെട്ടിപ്പൊക്കമുള്ള വസ്ത്രങ്ങൾ ഒഴിവാക്കണം. നിരവധി ക്ഷേത്രങ്ങളിൽ സാരി, മുണ്ടു, സൽവാർ കമ്മീസ് പോലുള്ള പരമ്പരാഗത വസ്ത്രങ്ങൾ പ്രാധാന്യം നൽകുന്നു.",
    },
    {
      title: "ചെരുപ്പ് കളയുക",
      description:
        "ക്ഷേത്രപ്രവേശനത്തിന് മുൻപ് ചെരുപ്പുകൾ നീക്കം ചെയ്യണം. ഇത് ആദരസൂചകവും ക്ഷേത്രത്തിന്റെ പരിശുദ്ധി നിലനിർത്തുന്നതിനും സഹായകരവുമാണ്.",
    },
    {
      title: "ശാന്തമായി പെരുമാറുക",
      description:
        "ക്ഷേത്രത്തിനുള്ളിൽ ശാന്തത പാലിക്കുകയോ മെല്ലെ സംസാരിക്കുകയോ വേണം. ഉറക്കെ സംസാരിക്കലോ ഓടലോ ഭക്തിപൂർണ്ണമായ അന്തരീക്ഷത്തെ ബാധിക്കുന്ന പെരുമാറ്റങ്ങളോ ഒഴിവാക്കണം.",
    },
    {
      title: "ഭക്ഷണമോ പാനീയങ്ങളോ കൊണ്ടുവരരുത്",
      description:
        "വിശേഷമായി സമർപ്പിക്കേണ്ട നേർച്ചകൾ ഒഴികെ, ഭക്ഷണം, പാനീയങ്ങൾ, അല്ലെങ്കിൽ പലഹാരങ്ങൾ ക്ഷേത്രത്തിനകത്ത് കൊണ്ടുവരാൻ പാടില്ല.",
    },
    {
      title: "ആലിംഗനം ചെയ്യുകയോ സ്‌നേഹം പ്രകടിപ്പിക്കുകയോ ചെയ്യരുത്",
      description:
        "ക്ഷേത്രങ്ങൾ ഭക്തിയുടെ സ്ഥലങ്ങളാണ്. ആലിംഗനം ചെയ്യുക, കൈപിടിക്കുക തുടങ്ങിയ പൊതുവായ സ്‌നേഹപ്രകടനങ്ങൾ ക്ഷേത്രത്തിനുള്ളിൽ അനുവദനീയമല്ല.",
    },
    {
      title: "പുകവലിക്കരുത്, മദ്യപിക്കരുത്",
      description:
        "മദ്യം, പുകയില എന്നിവ ക്ഷേത്രത്തിനകത്ത് കൊണ്ടുവരുകയോ ഉപയോഗിക്കുകയോ പാടില്ല.",
    },
    {
      title: "കിടക്കുകയോ ഉറങ്ങുകയോ ചെയ്യരുത്",
      description:
        "ക്ഷേത്രത്തിനകത്ത് കിടക്കുകയോ സാധാരണയായി ഇരിക്കുകയോ ഉറങ്ങുകയോ ചെയ്യുന്നത് അപമാനകരമായി കണക്കാക്കപ്പെടുന്നു.",
    },
    {
      title: "ഒരു നേർച്ച കൊണ്ടുവരിക",
      description:
        "ദേവനു മുൻപിൽ ഭക്തിപൂർവ്വം സമർപ്പിക്കാൻ പുഷ്പങ്ങൾ, പഴങ്ങൾ, തേങ്ങ, ധൂപക്കട്ടകൾ എന്നിവ കൊണ്ടുവരുന്നത് പതിവാണ്.",
    },
    {
      title: "തല മൂടുക",
      description:
        "ചില ക്ഷേത്രങ്ങളിൽ, പ്രത്യേകിച്ച് ഉത്തരേന്ത്യയിൽ, പ്രാർത്ഥനയ്ക്കിടെ തല മൂടുന്നത് (ശാല, ഓളം, മുണ്ട്) ആദരസൂചകമായി കണക്കാക്കുന്നു.",
    },
    {
      title: "മാസവാര സമയത്ത് ക്ഷേത്രത്തിൽ വരരുത്",
      description:
        "പരമ്പരാഗത ആചാരപ്രകാരം, സ്ത്രീകൾ മാസവാരത്തിനിടെ ക്ഷേത്രത്തിന്റെ ഗർഭഗൃഹത്തിൽ പ്രവേശിക്കരുത് എന്ന് കരുതപ്പെടുന്നു, കാരണം ശരീരം സ്വാഭാവികമായ ശുദ്ധീകരണ ഘട്ടത്തിലാണെന്ന് വിശ്വസിക്കുന്നു.",
    },
  ],
};

const colorMap = {
  green: "success",
  orange: "warning",
  red: "error",
};

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
const etiquette_list = ref("Loading about content..."); // Placeholder text

const temple = temples.find((t) => t.TID === localStore.templeID);
// Watch for changes in language or store data

watchEffect(() => {
  const locale = $i18n.locale.value;
  etiquette_list.value = etiquette[locale];
});

console.log(etiquette_list.value);
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
