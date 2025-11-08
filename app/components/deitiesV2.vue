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
              {{ $t("deity_h1") }}

              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click=""
                size="small"
                class="mt-1 ml-6"
              >
                <v-icon>
                  {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-card-title>

            <section v-if="Detailed_display" class="pl-2 pr-2 pb-2 mb-n2">
              <v-card
                class="mb-2"
                elevation="4"
                max-width="800px"
                outlined
                :color="isHovering ? colorScheme[1] : colorScheme[0]"
              >
                <v-list
                  lines="ten"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  <v-list-item
                    class="mt-n2 mb-n2"
                    :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="80">
                        <v-img
                          :src="localStore.deities.primedeity.image"
                          alt="Deity Image"
                        />
                      </v-avatar>
                    </template>

                    <template v-slot:title>
                      <div class="mb-2 text-subtitle-2">
                        {{
                          $i18n.locale.value === "en"
                            ? localStore.deities.primedeity.name.en
                            : localStore.deities.primedeity.name.ml
                        }}
                      </div>
                    </template>
                    <template v-slot:subtitle
                      ><div
                        class="font-weight-nomal"
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
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-card
                class="mb-2"
                elevation="4"
                max-width="800px"
                outlined
                :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
              >
                <v-list lines="six" class="mb-n2">
                  <v-list-subheader
                    class="mt-n2 text-center text-subtitle-2"
                    :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                    >{{ $t("sub_deity") }}</v-list-subheader
                  >
                  <v-divider inset class="border-opacity-25"></v-divider>
                  <div
                    v-for="(subdeity, index) in localStore.deities.subdeities"
                    :key="index"
                  >
                    <v-list-item
                      :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
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
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
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
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
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
              </v-card>
            </section>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
let Detailed_display = ref(false);

const localStore = useLocalStore();

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

// const deities = ref([]);
// deities.values = localStore.deities || "Content not available in English.";
// /
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

.script-text {
  color: #d32f2f;
  font-weight: bold;
}

.v-card-title,
.v-card-subtitle {
  color: white;
}

.v-list-item-content {
  color: black;
}

.dynamic-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  text-align: center;
  font-weight: bold;
}

.icon-align {
  margin-top: 0;
}

.prime-deity-button {
  height: 125px;
  width: 125px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

/* Sub Deities Button - Small Round */
.sub-deity-button {
  height: 80px;
  width: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}
.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}

.gold-background {
  background-color: #f2dfa7;
  color: #282828;
  /* color:  white; Adjust text color if needed */
}
.black-background {
  background-color: #282828;
  color: #f2dfa7;
  /* color:  white; Adjust text color if needed */
}
</style>
