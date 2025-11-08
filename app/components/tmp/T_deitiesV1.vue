<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-card
          class="mx-auto rounded-lg g_border"
          max-width="600"
          :color="colorScheme[1]"
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1"
            :style="`color:
                ${colorScheme[0]}`"
          >
            {{ $t("deity_h1") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <div
              v-for="(specialpooja, index) in localStore.specialpoojas.specialpooja"
              :key="index"
            >
              <v-card
                class="mb-2"
                elevation="4"
                max-width="800px"
                outlined
                :color="colorScheme[0]"
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

                <div>
                  <v-list lines="six" class="mb-n2">
                    <v-list-subheader
                      class="mt-n2 text-center text-subtitle-2"
                      :style="`background:
                ${colorScheme[0]}; color:
                ${colorScheme[1]}`"
                      >{{ $t("sub_deity") }}</v-list-subheader
                    >
                    <v-divider inset class="border-opacity-25"></v-divider>
                    <div
                      v-for="(subdeity, index) in localStore.deities.subdeities"
                      :key="index"
                    >
                      <v-list-item
                        :style="`background:
                ${colorScheme[0]}`"
                      >
                        <template v-slot:prepend>
                          <v-avatar size="70">
                            <v-img :src="subdeity.image" alt="Deity Image" />
                          </v-avatar>
                        </template>

                        <template v-slot:title>
                          <div
                            class="mb-2 text-body-2"
                            :style="`color:
                ${colorScheme[1]}`"
                          >
                            {{
                              $i18n.locale.value === "en"
                                ? subdeity.name.en
                                : subdeity.name.ml
                            }}
                          </div>
                        </template>

                        <template v-slot:subtitle
                          ><div
                            class="description-text"
                            :class="
                              $i18n.locale.value === 'en'
                                ? 'text-body-2 text-justify'
                                : 'text-caption'
                            "
                            :style="`background:
                ${colorScheme[0]}; color:
                ${colorScheme[1]}`"
                            v-html="
                              $i18n.locale.value === 'en'
                                ? subdeity.description.en
                                : subdeity.description.ml
                            "
                          ></div>
                        </template>
                      </v-list-item>
                      <v-divider class="border-opacity-20" color="red"></v-divider>
                    </div>
                  </v-list>
                </div>
              </v-card>
            </div>
          </section>
        </v-card>
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
