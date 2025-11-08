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
                :style="`color: ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                @click="displaytoggle"
              >
                {{ $t("events_h1") }}
                <v-btn
                  :color="btn_color(isHovering)"
                  icon
                  @click=""
                  size="small"
                  class="mt-1 ml-6"
                  :style="`color: ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  <v-icon>
                    {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-title>

              <section
                v-if="Detailed_display"
                class="pl-2 pr-2"
                :class="isHovering ? colorScheme[0] : colorScheme[1]"
              >
                <v-card
                  class="mb-2"
                  elevation="4"
                  max-width="800px"
                  outlined
                  :color="isHovering ? colorScheme[1] : colorScheme[0]"
                >
                  <div v-if="events.length > 0">
                    <div
                      v-for="(event, index) in filteredEvents"
                      :key="index"
                      class="mb-6 align-center justify-center mt-2"
                    >
                      <div class="mb-1 font-weight-bold">
                        <event-popup-dialog :event="event"></event-popup-dialog>
                      </div>

                      <p
                        class="mb-2 ml-2 font-weight-normal"
                        :style="`color: ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        {{
                          formatDate(event.date?.startDate) +
                          (event.date?.endDate
                            ? ` - ${formatDate(event.date.endDate)}`
                            : "")
                        }}
                      </p>
                    </div>
                  </div>
                  <v-card-actions class="justify-center">
                    <v-btn
                      block
                      color="primary"
                      variant="elevated"
                      prepend-icon="mdi-calendar-check"
                      to="/calendar/V5"
                      class="ma-2"
                    >
                      Detailed Calendar
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
import { ref, watch, onMounted } from "vue";
import { useDate } from "vuetify";
import { useLocalStore } from "/stores/localStore.js";
import { dbStore } from "~/composables/dbStore";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
const localStore = useLocalStore();
const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const goto_Calendar = () => {
  // Pass a value to the child page using route params
  router.push({
    name: "/calendar/V5", // Route name based on file structure
    params: { parentData: "Hello from Parent!" },
  });
};

// Function to fetch data from Firestore
const today = Timestamp.fromDate(new Date()); // Convert JavaScript Date to Firestore Timestamp
const filteredEvents = computed(() =>
  events.value.filter((item) => item.close_date >= today)
);
const date = useDate();
const events = ref([]);

// Format Date Helper
const formatDate = (timestamp) => {
  if (!timestamp) return "Invalid Date";
  const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.format(dateObj, "fullDate");
};

// Watch Locale for Changes
watch(
  () => $i18n.locale.value,
  async (newLocale) => {
    await localStore.Fetch_Events_TID(newLocale); // Fetch events for the current locale
    events.value = localStore.events || [];
  },
  { immediate: true }
);

// Fetch Data on Component Mount
onMounted(async () => {
  await localStore.Fetch_Events_TID($i18n.locale.value);
  events.value = localStore.events || [];
});
</script>
