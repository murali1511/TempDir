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
              class="d-flex justify-space-between align-center text-subtitle-1 ml-2"
              :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
              @click="displaytoggle"
              ><div>
                {{ $t("poojatime") }}

                <span class="compressed-text text-caption">
                  ({{ localStore.pooja_short }})</span
                >
              </div>

              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click=""
                size="small"
                class="mt-2 ml-6 mr-2 mb-1"
                :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
              >
                <v-icon>{{
                  Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </v-card-title>
            <!-- <v-card-subtitle v-if="!Detailed_display" class="text-body_1 font-weight-bold  text-white-darken-5 ml-2">(6:00AM-8:30AM 5PM-7:30PM)</v-card-subtitle> -->
            <!-- Expanded Pooja and Darsan information -->
            <section v-if="Detailed_display" class="pl-7 pr-7 pb-2">
              <v-card
                elevation="5"
                class="pa-2 mantra-card ml-n5 mr-n5"
                :color="isHovering ? colorScheme[1] : colorScheme[0]"
              >
                <v-timeline
                  align="start"
                  side="end"
                  line-thickness="6 "
                  density="compact"
                  class="ml-2"
                >
                  <v-timeline-item
                    v-for="poojaTime in localStore.pooja_schedule"
                    :key="poojaTime.time"
                    :dot-color="poojaTime.color"
                    size="small"
                  >
                    <div class="d-flex mt-1">
                      <strong
                        class="text-caption font-weight-bold"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                        >{{ timeString(poojaTime.time) }}</strong
                      >
                      <div
                        class="text-caption ml-1"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        {{ poojaTime.event }}
                      </div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
                <div
                  class="text-caption text-center font-weight-bold"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  {{ $t("pooja_darsan_msg_1") }}
                </div>
              </v-card>
            </section>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { usePoojaTypes } from "@/composables/stores.js";
import { ref, onMounted, watchEffect } from "vue";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useDate } from "vuetify";
import { useRuntimeConfig } from "#app";
import { format } from "date-fns";
import { dbStore } from "~/composables/dbStore";
import { useLocalStore } from "/stores/localStore.js";

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

// const names =  ['bhagavathi_temple.jpg', 'shiva_temple.jpg', 'vishnu_temple.jpg', 'small']
// const titles = ['Bhagavathi', 'Shiva', 'Vishnu']
const PoojaTypes = usePoojaTypes().value;
const db = useFirestore();
const { $i18n } = useNuxtApp();
const pooja_darsan = ref([]);
const short_schedule = ref();
const date = useDate();
const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const Detailed_display = ref(false);

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};
const switchLanguage = (locale) => {
  $i18n.setLocale(locale);
};

// Lifecycle hook to fetch data when component is mounted
onMounted(() => {
  // fetchData();
});

const poojatoggle = () => {
  Detailed_display.value = !Detailed_display.value;
  return Detailed_display;
};
const timeString = (date) => {
  const tdate = date.toDate();
  return format(tdate, "h:mm a");
};
</script>
<style scoped>
.v-timeline--vertical.v-timeline {
  row-gap: 4px;
  height: 100%;
}

.v-card-title {
  padding: 0.1rem 0.5rem;
}
.v-card-subtitle {
  padding: 0.1rem 0.5rem;
}
.red-background {
  background-color: #f2dfa7;
  /* color:  white; Adjust text color if needed */
}
.compressed-text {
  letter-spacing: -0.5px; /* Reduce letter spacing */
}
</style>
