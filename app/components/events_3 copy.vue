<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              class="mx-auto rounded-lg"
              max-width="600"
              :color="isHovering ? colorScheme[0] : colorScheme[1]"
              v-bind="props"
            >
              <v-card-title
                class="d-flex justify-space-between align-center text-subtitle-1"
                :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
              >
                {{ $t("events_h1") }}
                <v-btn
                  :color="btn_color(isHovering)"
                  icon
                  @click="displaytoggle"
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
                  <div
                    v-for="(event, index) in events"
                    :key="index"
                    class="mb-6 align-center justify-center mt-2"
                    :color="isHovering ? colorScheme[1] : colorScheme[0]"
                  >
                    <!-- Event Card -->
                    <!-- <span class="mb-2 font-weight-bold">{{ event.title }}</span>      -->
                    <div class="mb-1 font-weight-bold">
                      <event-popup-dialog :event="event"> </event-popup-dialog>
                    </div>

                    <p
                      class="mb-2 ml-2 font-weight-normal"
                      :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                    >
                      {{
                        date.format(
                          event.date.startDate.toDate().toDateString(),
                          "fullDate"
                        )
                      }}
                      {{
                        (event.date.endDate.toDate() - event.date.startDate.toDate()) /
                          (1000 * 60 * 60 * 24) <
                        1
                          ? ""
                          : `- ${date.format(
                              event.date.endDate.toDate().toDateString(),
                              "fullDate"
                            )}`
                      }}
                    </p>
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
import { ref, onMounted, watchEffect, computed } from "vue";
import { useDisplay } from "vuetify";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useDate } from "vuetify";
import { useRuntimeConfig } from "#app";
import { startAfter } from "firebase/database";
import { dbStore } from "~/composables/dbStore";

// Define props
const props = defineProps({
  collapsable: {
    type: Boolean,
    default: true,
    // required: true, // Ensure the parent passes this prop
  },
});

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(!props.collapsable);

const displaytoggle = () => {
  Detailed_display.value = props.collapsable
    ? !Detailed_display.value
    : Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const config = useRuntimeConfig();
const db = useFirestore();
const date = useDate();

// Responsive breakpoint display
const display = useDisplay();

// Event Data
const events = ref([]);
const isSummary = ref([]);

// Function to fetch data from Firestore
const today = Timestamp.fromDate(new Date()); // Convert JavaScript Date to Firestore Timestamp

const fetchData = async () => {
  try {
    const eventsCollection = collection(db, `events_${$i18n.locale.value}`);
    const q = query(eventsCollection, where("close_date", ">=", today));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      // data.push({ id: doc.id, ...doc.data() });

      const event = doc.data();
      // Convert Firestore Timestamp to a string in "YYYY-MM-DD" format
      const formattedStartDate = new Date(
        event.date.startDate.seconds * 1000
      ).toLocaleDateString("en-CA");
      const formattedEndDate = new Date(
        event.date.endDate.seconds * 1000
      ).toLocaleDateString("en-CA");

      data.push({
        eventid: event.eventID,
        name: event.title,
        start: formattedStartDate,
        end: formattedEndDate,
        ...event,
      });
    });
    events.value = data;
    // Set all events to summary view initially
    isSummary.value = Array(data.length).fill(true);
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};

const switchLanguage = (locale) => {
  $i18n.setLocale(locale);
};

const rootpage = () => {
  navigateTo("/", { redirectCode: 301 });
};
// Lifecycle hook to fetch data when component is mounted
onMounted(() => {
  fetchData();
});

const getText = (start, end) => {
  return `${
    date.format(
      start.toDate().toDateString(),
      "fullDate"
    )(end.toDate() - start.toDate()) /
      (1000 * 60 * 60 * 24) <
    1
      ? ""
      : date.format(end.toDate().toDateString(), "fullDate")
  }`;
};

// Function to add the event to the mobile device's calendar
</script>
