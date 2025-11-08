<template>
  <v-row>
    <v-col>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            class="mx-auto rounded-lg g_border"
            max-width="600"
            :color="isHovering ? colorScheme[0] : colorScheme[1]"
            v-bind="props"
          >
            <v-card-title
              class="d-flex justify-space-between align-center text-subtitle-1"
              :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
              @click="displaytoggle"
            >
              {{ $t("mantra_summary") }}

              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click=""
                size="small"
                class="mt-1 ml-6"
                :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
              >
                <v-icon>
                  {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-card-title>

            <!-- Dhyna Mantra Display start -->
            <section v-if="Detailed_display" class="pl-2 pb-1">
              <v-row justify="center">
                <div
                  v-for="(mantra, index) in localStore.mantras"
                  :key="index"
                  class="pa-4 ml-4"
                >
                  <v-card
                    class="pa-4 ml-n5 mr-1"
                    :color="isHovering ? colorScheme[1] : colorScheme[0]"
                    max-width="800px"
                    elevation="4"
                    outlined
                  >
                    <v-card-text class="ml-n4 mr-n3" x>
                      <p
                        class="font-weight-bold text-subtitle-1 mt-n5"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        Deity
                      </p>
                      <p
                        class="text-subtitle-1"
                        style="font-family: 'Devanagari', serif"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        {{ mantra.deity }}
                      </p>

                      <p
                        class="font-weight-bold mt-3 text-subtitle-2"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        Script:
                      </p>
                      <p
                        class="script-text text-subtitle-2"
                        style="font-family: 'Devanagari', serif"
                      >
                        {{ mantra.script }}
                      </p>
                      <div
                        :style="` color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        <p class="font-weight-bold mb-1 mt-3 text-subtitle-2">
                          Transliteration:
                        </p>
                        <p
                          :class="
                            $i18n.locale.value === 'en'
                              ? 'text-body-2 text-justify'
                              : 'text-caption'
                          "
                          style=" font-family: 'Devanagari"
                        >
                          {{ mantra.transliteration }}
                        </p>

                        <p class="font-weight-bold mb-1 mt-3 text-subtitle-2">Meaning:</p>
                        <p
                          :class="
                            $i18n.locale.value === 'en'
                              ? 'text-body-2 text-justify'
                              : 'text-caption'
                          "
                          style="font-family: 'Devanagari', serif"
                        >
                          {{ mantra.meaning }}
                        </p>

                        <p class="font-weight-bold mb-1 mt-3 text-subtitle-2">
                          Blessings:
                        </p>
                      </div>
                      <!-- <v-card  color="primary" > -->

                      <v-list dense>
                        <v-list-item
                          v-for="(blessing, bIndex) in mantra.blessings"
                          :key="bIndex"
                          class="pa-0 mt-n2 mb-n2"
                          :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                        >
                          <v-row no-gutters class="align-center">
                            <!-- Icon Column -->
                            <v-col cols="auto" class="d-flex ml-2 text-right">
                              <v-icon color="red darken-1" size="20"
                                >mdi-star-circle</v-icon
                              >
                            </v-col>
                            <!-- Text Column -->
                            <v-col class="pa-0 ma-0">
                              <span
                                class="blessing-text"
                                :class="
                                  $i18n.locale.value === 'en'
                                    ? 'text-body-2 text-justify'
                                    : 'text-caption'
                                "
                                :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                                >{{ blessing }}</span
                              >
                            </v-col>
                          </v-row>
                        </v-list-item>
                      </v-list>
                      <!-- </v-card> -->
                    </v-card-text>
                    <v-card class="mx-auto red-background" max-width="300"> </v-card>
                  </v-card>
                </div>
              </v-row>
            </section>

            <!-- Dhyna Mantra Display end -->
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from "vue";
import { mantras } from "@/composables/mantra.js";
import { dbStore } from "~/composables/dbStore";
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const { $i18n } = useNuxtApp();

const mantras_locale = computed(() => {
  const localeKey = `data_${$i18n.locale.value}`;
  return mantras[localeKey]?.mantras || [];
});

onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Mantra(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});
</script>

<style scoped>
.temple-theme {
  background-color: #fff6e0;
}

.temple-header {
  background-image: url("/images/temple-background.jpg");
  background-size: cover;
  background-blend-mode: multiply;
}

.mantra-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.script-text {
  color: #d32f2f;
  font-weight: bold;
}

.dynamic-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  text-align: center;
  font-weight: bold;
}

.icon-align {
  margin-top: 0;
}

.blessing-content {
  margin-top: 2px;
}

.blessing-text {
  margin-left: 10px;
  display: block;
  text-align: left;
}
.section_width {
  max-width: 600px;
}
</style>
