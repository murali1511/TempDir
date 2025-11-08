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
                {{ $t("specialpooja_h1") }}
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
                <div
                  v-for="(specialpooja, index) in localStore.specialpoojas.specialpooja"
                  :key="index"
                >
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
                      <span> {{ specialpooja.name }} </span>
                      <span class="text-body-2">{{ ` (${specialpooja.time})` }} </span>
                    </v-card-title>
                    <v-divider class="mb-3"></v-divider>

                    <v-card-text class="py-2 px-4">
                      <v-row>
                        <div class="text-container">
                          <!-- Image -->
                          <v-img
                            :src="`/${localStore.temple_logo}.png`"
                            height="100"
                            width="100"
                            class="rounded float-left mr-3 mb-1 mt-1"
                            alt="Health and Safety"
                          ></v-img>

                          <!-- Text -->
                          <div
                            class="description-text mt-1 mr-2"
                            :class="
                              $i18n.locale.value === 'en'
                                ? 'text-body-2 text-justify '
                                : 'text-caption '
                            "
                            :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                            v-html="specialpooja.description"
                          />
                        </div>
                        <v-divider></v-divider>
                      </v-row>
                      <v-row>
                        <v-list
                          lines="full"
                          :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                        >
                          <v-list-item
                            v-for="(entry, index) in specialpooja.details"
                            :key="index"
                            :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                          >
                            <v-icon color="red mr-2 mb-1 mt-1">mdi-check-circle</v-icon>
                            <v-list-item-title
                              class="font-weight-bold d-inline"
                              :class="
                                $i18n.locale.value === 'en'
                                  ? 'text-body-1'
                                  : 'text-caption'
                              "
                            >
                              {{ entry.head }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                              class="opacity-80 ml-8"
                              :class="
                                $i18n.locale.value === 'en'
                                  ? 'text-body-2 text-justify'
                                  : 'text-caption'
                              "
                            >
                              {{ entry.content }}
                            </v-list-item-subtitle>
                            <v-divider color="black" opacity=".2" class="mt-1" />
                          </v-list-item>
                        </v-list>
                      </v-row>
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
                </div>
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
    localStore.specialpoojas == "Not Found"
      ? Detailed_display.value
      : !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Specialpooja(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});
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
</style>
