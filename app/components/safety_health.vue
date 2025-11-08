d
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
                {{ $t("safety_health_h1") }}

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
                  <v-divider></v-divider>

                  <v-card-text class="py-2 px-4">
                    <div class="text-container">
                      <!-- Image -->
                      <v-img
                        :src="`/${localStore.temple_logo}.png`"
                        height="150"
                        width="150"
                        class="rounded float-left mr-1 mb-n2"
                        alt="Health and Safety"
                      ></v-img>

                      <!-- Text -->
                      <p
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2 text-justify'
                            : 'text-caption'
                        "
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        {{ localStore.safety_health_short }}
                      </p>
                      <p
                        class="text-body-2 text-justify"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        <!-- {{ localStore.safety_health.entries[0] }} -->

                        <v-list
                          :style="`background: ${
                            isHovering ? colorScheme[1] : colorScheme[0]
                          }`"
                        >
                          <v-list-item
                            v-for="(entry, index) in localStore.safety_health"
                            :key="index"
                            :style="`color:  ${
                              isHovering ? colorScheme[0] : colorScheme[1]
                            }`"
                          >
                            <v-list-item-title
                              class="text-subtitle-2 font-weight-bold d-inline"
                            >
                              <div
                                class="d-block pa-2 rounded"
                                :style="`background:  ${
                                  isHovering ? colorScheme[0] : colorScheme[1]
                                } ; color:  ${
                                  isHovering ? colorScheme[1] : colorScheme[0]
                                }`"
                              >
                                <v-btn
                                  color="red"
                                  density="compact"
                                  class="mr-2"
                                  icon
                                  size="small"
                                  >{{ index + 1 }}</v-btn
                                >
                                {{ `${entry.title}` }}
                              </div>
                              <div v-for="(detail, index) in entry.details" :key="index">
                                <div
                                  class="font-weight-bold"
                                  :class="
                                    $i18n.locale.value === 'en'
                                      ? 'text-body-2  multi-line mt-2'
                                      : 'text-caption multi-line mt-2'
                                  "
                                >
                                  {{ detail.head }}
                                </div>

                                <div
                                  :class="
                                    $i18n.locale.value === 'en'
                                      ? 'text-body-2  multi-line text-justify'
                                      : 'text-caption multi-line text-left'
                                  "
                                >
                                  {{ detail.content }}
                                </div>
                              </div>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>

                        <v-chip
                          variant="outlined"
                          size="x-small"
                          append-icon="mdi-arrow-right-thick"
                          class="d-flex-1 font-italic"
                          @click="test"
                        >
                          Learn more
                        </v-chip>
                      </p>
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
import { ref } from "vue";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value =
    localStore.safety_health == "Not Found"
      ? Detailed_display.value
      : !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Safety_Health(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});

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

.multi-line {
  white-space: normal !important; /* Ensures text wraps to multiple lines */
  overflow: visible !important; /* Removes truncation or ellipsis */
  text-overflow: clip !important; /* Prevents ellipsis from being applied */
}
</style>
