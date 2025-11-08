<template>
  <v-theme-provider theme="dark">
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
                {{ $t("history_h1") }}
                <!-- Legends and Folklore

Stories of the temple's origin as told through local folklore.
Connection to legendary figures (e.g., warriors, sages).
Divine Interventions

Tales of miracles performed by the deity.
Stories where the deity is believed to have protected devotees or the temple.
Connection to Epics

References to the temple or deity in Hindu epics like the Mahabharata or Ramayana.
Stories of associated sages or demigods.
Deity-Specific Stories

Legends surrounding the main deity or sub-deities.
Symbolic representation of the deity’s attributes (e.g., Goddess Durga as the protector).
Sacred Sites and Ritual Practices

Mythological explanations for specific rituals or temple practices.
Stories about sacred objects or locations within the temple (e.g., ponds, trees).
Cosmic and Spiritual Significance

Role of the temple in cosmic mythology, such as alignment with celestial events.
Stories explaining the spiritual significance of the temple or its rituals.
Community Myths

Localized stories that connect the community to the temple.
Folklore that celebrates the temple’s role in societal or cultural harmony. -->
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

              <section v-if="Detailed_display" class="pl-2 pr-2 bg-color-gold">
                <v-card
                  class="mb-2"
                  elevation="4"
                  max-width="800px"
                  outlined
                  :color="isHovering ? colorScheme[1] : colorScheme[0]"
                >
                  <v-card-title
                    class="text-subtitle-1 font-weight-bold text-center"
                    :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                  >
                    {{ $t("history_h1") }}
                  </v-card-title>
                  <v-divider></v-divider>

                  <v-card-text class="py-2 px-4">
                    <div class="text-container">
                      <!-- Image -->
                      <v-img
                        :src="`/${localStore.temple_logo}.png`"
                        height="140"
                        width="140"
                        class="rounded float-left mr-2"
                        alt="Health and Safety"
                      ></v-img>

                      <!-- Text -->
                      <div
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2 text-justify description-text_en '
                            : 'text-caption description-text_ml'
                        "
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
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
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const localStore = useLocalStore();

const historyContent = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const history = localStore.history;

  historyContent.value =
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
</style>
