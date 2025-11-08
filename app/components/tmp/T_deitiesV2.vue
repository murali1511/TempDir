<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-card
          :class="[
            'mx-auto rounded-lg g_border',
            $vuetify.display.smAndUp ? 'ml-12 mr-12' : '',
          ]"
          :color="colorScheme[1]"
          :style="`background: linear-gradient(to right,  #735943,${colorScheme[1]},${colorScheme[0]}, ${colorScheme[1]},#735943)`"
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1 grab"
            :style="`color: ${colorScheme[0]}`"
          >
            {{ $t("deity_h1") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card
              class="mb-2"
              elevation="4"
              outlined
              :color="colorScheme[0]"
              :style="`background: linear-gradient(to bottom,${colorScheme[0]},${colorScheme[0]},#F2E7DC,${colorScheme[0]})`"
            >
              <v-card-title
                class="text-subtitle-1 font-weight-bold text-center"
                :style="`color:
                ${colorScheme[1]}`"
              >
                <span>
                  {{
                    $i18n.locale.value === "en"
                      ? localStore.deities.primedeity.name.en
                      : localStore.deities.primedeity.name.ml
                  }}
                </span>
              </v-card-title>
              <v-divider class="mb-3"></v-divider>

              <v-card-text class="py-2 px-4">
                <v-row>
                  <div class="text-container mx-1">
                    <!-- Image -->
                    <v-img
                      :src="localStore.deities.primedeity.image"
                      height="80"
                      width="80"
                      class="rounded-xl float-left mr-3 mb-1 mt-1"
                      alt="Health and Safety"
                    ></v-img>

                    <!-- Text -->
                    <div
                      class="font-weight-nomal mx-2"
                      :class="
                        $i18n.locale.value === 'en'
                          ? 'text-body-2 text-justify '
                          : 'text-caption'
                      "
                      v-html="
                        $i18n.locale.value === 'en'
                          ? localStore.deities.primedeity.description.en
                          : localStore.deities.primedeity.description.ml
                      "
                    ></div>
                  </div>
                  <v-divider></v-divider>
                </v-row>
                <v-row> </v-row>
              </v-card-text>

              <div
                v-for="(subdeity, index) in localStore.deities.subdeities"
                :key="index"
              >
                <v-card-title
                  class="text-subtitle-2 font-weight-bold text-center"
                  :style="`color:
                ${colorScheme[1]}`"
                >
                  <span>
                    {{
                      $i18n.locale.value === "en" ? subdeity.name.en : subdeity.name.ml
                    }}
                  </span>
                </v-card-title>

                <v-card-text class="py-2 px-4 mt-2">
                  <v-row>
                    <div class="text-container mx-1">
                      <!-- Image -->
                      <v-img
                        :src="subdeity.image"
                        height="70"
                        width="70"
                        class="rounded-xl float-left mr-3 mb-1 mt-1"
                        alt="Health and Safety"
                      ></v-img>

                      <!-- Text -->
                      <div
                        class="font-weight-nomal mx-2 mb-2"
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2 text-justify '
                            : 'text-caption'
                        "
                        v-html="
                          $i18n.locale.value === 'en'
                            ? subdeity.description.en
                            : subdeity.description.ml
                        "
                      ></div>
                    </div>
                    <v-divider></v-divider>
                  </v-row>
                  <v-row> </v-row>
                </v-card-text>
              </div>
              <div></div>
            </v-card>
          </section>
        </v-card>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";
import { useDisplay } from "vuetify";

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const localStore = useLocalStore();

const historyContent = ref("Loading about content..."); // Placeholder text
const historySummary = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const history = localStore.history;

  historyContent.value =
    locale === "en"
      ? history.detail?.en || "Content not available in English."
      : history.detail?.ml || "Content not available in Malayalam.";

  historySummary.value =
    locale === "en"
      ? history.summary?.en || "Content not available in English."
      : history.summary?.ml || "Content not available in Malayalam.";
});

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
const test = () => {
  alert("You clicked Learn more!");
};
</script>

<style scoped>
.text-container {
  position: relative;
}

.float-left {
  float: left; /* Float the image to the left */
}

.text-justify {
  text-align: justify; /* Ensures the text is justified */
}
.description-text_en {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
.description-text_ml {
  line-height: 1.8; /* Adjust the value as needed for desired spacing */
}
.grab {
  cursor: grab;
}
</style>
