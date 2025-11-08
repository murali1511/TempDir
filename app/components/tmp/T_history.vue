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
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1 grab"
            :style="`color: ${colorScheme[0]}`"
          >
            {{ $t("history_h1") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card class="mb-2" elevation="4" outlined :color="colorScheme[0]">
              <v-divider></v-divider>

              <v-card-text class="py-2 px-4">
                <div class="text-container">
                  <div
                    :class="
                      $i18n.locale.value === 'en'
                        ? 'text-body-2 c description-text_en  text-justify'
                        : 'text-caption description-text_ml'
                    "
                    :style="`color:
                ${colorScheme[1]}`"
                    v-html="historyContent"
                  />
                </div>
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn
                  class="text-red font-weight-bold ml-2"
                  color="black"
                  rounded="0"
                  variant="outlined"
                  small
                >
                  Book Pooja
                </v-btn>
              </v-card-actions>
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
