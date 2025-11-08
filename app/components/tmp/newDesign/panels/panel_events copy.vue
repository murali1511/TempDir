<template>
  <v-row class="fill-height" >
    <v-col class="mt-n5 mb-n5 ml-n4">
      <v-sheet height="64" class="mr-n8" >
        <v-toolbar flat class="ml-n2">
        <v-toolbar-title>
          <v-btn
            class=""
            color="primary"
            variant="elevated"
            size="small"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            color="grey-darken-2"
            size="x-small"
            variant="text"
            icon
            @click="prev"
            class="mr-2"
          >
            <v-icon size="x-large" color="black"> mdi-menu-left </v-icon>
          </v-btn>

 <span
            v-if="calendar"
            :class="[
              $vuetify.display.xs
                ? $i18n.locale.value == 'ml'
                  ? 'smallest-text'
                  : 'text-caption'
                : 'text-subtitle-2',
              'font-weight-bold',
              'ml-n2',
            ]"
          >
            {{ calendar.title }}
          </span>

          <v-btn
            color="grey-darken-2"
            size="x-small"
            variant="text"
            icon
            @click="next"
            class=""
          >
            <v-icon size="x-large" color="black"> mdi-menu-right </v-icon>
          </v-btn>
          </v-toolbar-title>
          <!-- <v-toolbar-title
            v-if="calendar"
            :class="[
              $vuetify.display.xs
                ? $i18n.locale.value == 'ml'
                  ? 'text-caption'
                  : 'text-body-2'
                : 'text-h6',
              'font-weight-bold',
              'ml-n1',
            ]"
          >
            {{ calendar.title }}
          </v-toolbar-title> -->
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary font-weight-bold"
                variant="outlined"
                v-bind="props"
                size="small"
                class=""
                width="75"
              >
                <span class="text-caption font-weight-bold">{{ typeToLabel[type] }}</span>
                <v-icon end class="text-h5 mr-n2"> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600" class="mr-n8" >
        <v-calendar
          ref="calendar"
          v-model="focus"
          :event-color="getEventColor"
          :events="events"
          :type="type"
          color="primary"
          @change="updateRange"
          @click:date="viewDay"
          @click:event="showEvent"
          @click:more="viewDay"
          class="bg-yellow-lighten-5"
        >
        </v-calendar>

        <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
          :close-on-content-click="false"
          location="end"
        >
          <v-card color="yellow-lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon> {{selectedEvent.eventIcon}}</v-icon>
              </v-btn>
             
              <v-toolbar-title class="font-weigth-bold text-subtitle-1"> {{ selectedEvent.name }}</v-toolbar-title>
             
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <!-- Event Header -->
              <v-card-text class="text-center">
                <p class="text-subtitle-2 font-weight-bold mb-2">
                  {{ selectedEvent.name }}
                </p>
                <p class="mb-2 font-weight-bold text-black">
                  {{ format(selectedEvent.start, "fullDate") }}

                  {{
                    (new Date(selectedEvent.end) -
                      new Date(selectedEvent.start)) /
                      (1000 * 60 * 60 * 24) <
                    1
                      ? ""
                      : `-
                    ${format(selectedEvent.end, "fullDate")}`
                  }}
                 
                </p>
                <b class="text-black font-weight-bold">{{
                  $t("event_popup_msg_1")
                }}</b>
                {{selectedEvent.poojaTiming}}
                <div
                  class="text-center text-caption font-weight-bold text-white"
                  v-html="selectedEvent.poojaTiming"
                ></div>
              </v-card-text>

              <!-- short description -->
              <div v-if="selectedEvent.description" class="mb-3">
                <div v-html="selectedEvent.description"></div>
              </div>

              <!-- participation -->
              <div v-if="selectedEvent.participation?.length" class="mb-3">
                <div class="font-weight-medium mb-1">Participation</div>
                <v-list dense>
                  <v-list-item
                    v-for="(p, i) in selectedEvent.participation"
                    :key="i"
                  >
                    <v-list-item-icon
                      ><v-icon small :color="selectedEvent.color"
                        >mdi-account-group</v-icon
                      ></v-list-item-icon>
                    <v-list-item-content v-html="p" class="ml-2"></v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>

              <!-- notes -->
              <div v-if="selectedEvent.specialNote?.length" class="mb-3">
                <div class="font-weight-medium mb-1">Notes</div>
                <ul class="ml-4">
                  <li v-for="(n, i) in selectedEvent.specialNote" :key="i">
                  <span v-html="n" ></span>  
                  </li>
                </ul>
              </div>

              <!-- contact & location -->
              <v-divider class="my-2" />
              <div class="d-flex flex-column gap-2">
                <div v-if="selectedEvent.contact?.email" class="mb-1">
                  <v-icon left size="16" class="mr-2">mdi-email</v-icon>
                  <a :href="`mailto:${selectedEvent.contact.email}`">{{
                    selectedEvent.contact.email
                  }}</a>
                </div>

                <div v-if="selectedEvent.contact?.phone" class="mb-1">
                  <v-icon left size="16" class="ml-n2 mr-2">mdi-phone</v-icon>
                  <a :href="`tel:${selectedEvent.contact.phone}`">{{
                    selectedEvent.contact.phone
                  }}</a>
                </div>

                <div v-if="selectedEvent.contact?.website" >
                  <v-icon left size="16" class="ml-n2 mr-2">mdi-web</v-icon>
                  <a
                    :href="selectedEvent.contact.website"
                    target="_blank"
                    rel="noreferrer"
                    >Visit website</a
                  >
                </div>

                <div
                  v-if="
                    selectedEvent.location?.name ||
                    (selectedEvent.location?.lat && selectedEvent.location?.lng)
                  "
                >
                  <v-icon left size="16">mdi-map-marker</v-icon>
                  <span>{{
                    selectedEvent.location?.name ||
                    selectedEvent.location.lat +
                      "," +
                      selectedEvent.location.lng
                  }}</span>
                </div>
              </div>
            </v-card-text>
            <!-- actions -->
            <v-card-actions>
              <v-btn text small @click="onShare(selectedEvent)">Share</v-btn>
              <v-spacer />
              <v-btn text small @click="openInMaps(selectedEvent)"
                >Open in Maps</v-btn
              >
              <v-btn
                color="secondary"
                variant="elevated"
                @click="selectedOpen = false"
                size="small"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import {allevents} from "@/stores/events.js"
import { ref, onMounted } from "vue";
const { $i18n } = useNuxtApp();
import { useDisplay, useDate } from "vuetify";
const { format, parseIso, diff, date } = useDate();
console.log(Object.keys(date));

const focus = ref("");
const type = ref("month");
const typeToLabel = {
  month: "Month",
  week: "Week",
  day: "Day",
  "4day": "4 Days",
};
const selectedEvent = ref({});
const selectedElement = ref(null);
const selectedOpen = ref(false);
const events = ref([]);
const colors = ref([
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1",
]);
const names = ref([
  "Meeting",
  "Holiday",
  "PTO",
  "Travel",
  "Event",
  "Birthday",
  "Conference",
  "Party",
]);
const calendar = ref(null);

const viewDay = (nativeEvent, { date }) => {
  focus.value = date;
  type.value = "day";
};

const getEventColor = (event) => {
  return event.color;
};

const setToday = () => {
  focus.value = "";
};

const prev = () => {
  if (calendar.value) {
    calendar.value.prev();
  }
};

const next = () => {
  if (calendar.value) {
    calendar.value.next();
  }
};

const showEvent = (nativeEvent, { event }) => {
  const open = () => {
    selectedEvent.value = event;
    selectedElement.value = nativeEvent.target;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (selectedOpen.value = true))
    );
  };

  if (selectedOpen.value) {
    selectedOpen.value = false;
    requestAnimationFrame(() => requestAnimationFrame(() => open()));
  } else {
    open();
  }
  nativeEvent.stopPropagation();
};

const updateRange = (rangePayload) => {
  const newEvents = [];
  for (const temple of allevents) {
    if (!Array.isArray(temple.events)) continue;
    for (const TEvent of temple.events) {
      newEvents.push(parseToCalendarEvent(TEvent));
    }
  }
  events.value = newEvents;
};

function parseToCalendarEvent(TempleEvent) {
  // safe extraction of start/end (if your source uses MM/DD/YYYY or DD/MM/YYYY adapt here)
  const start = TempleEvent?.date?.startDate ?? TempleEvent.startDate ?? null;
  const end = TempleEvent?.date?.endDate ?? TempleEvent.endDate ?? null;

  // use provided start/end as-is (Vuetify accepts ISO strings). If they are non-ISO
  // you should convert them to 'YYYY-MM-DD' or full ISO timestamps here.
  return {
    id: TempleEvent.eventID ?? TempleEvent.eventTitle,
    name: TempleEvent.eventTitle ?? TempleEvent.name ?? "Event",
    Category: TempleEvent.eventCategory?? "Daily Rituals",
    eventIcon: TempleEvent.eventIcon ?? "mdi-white-balance-sunny",
    start: start, // e.g. '2025-10-13T05:30:00' or '2025-10-13'
    end: end || undefined,
    color: colors.value[rnd(0, colors.value.length - 1)],
    description: TempleEvent.eventDescription ?? TempleEvent.eventDescription,
    contact: TempleEvent.contact,
    poojaTiming: TempleEvent.eventTime ?? TempleEvent.poojaTiming,
    highlights: TempleEvent.highlights,
    participation: TempleEvent.participation,
    specialNote: TempleEvent.specialNote,
  };
}

const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

onMounted(() => {
  if (calendar.value) {
    calendar.value.checkChange();
  }
});

// sample allevents JSON corrected (structure fixed)
const Tallevents = [
  {
    TID: "T0001",
    name: "Lokanarkavu Temple",
    events: [
      {
        eventID: "E0010",
        eventTitle: "Navratri Celebrations",
        eventDescription: "<b>Navaratri Celebration and Vijaya Dasami Pooja</b>",
        contact: {
          email: "events@lokanarkavutemple.com",
          phone: "+91-495-XXX-XXXX",
          website: "https://lokanarkavutemple.com/navratri",
          whatsapp: "+91-987-XXX-YYYY",
        },
        date: {
          // ISO date/time or just date is fine
          startDate: "2025-10-13",
          endDate: "2025-10-14",
        },
        eventTime: "5:00 AM - 9:00 PM",
        highlights: [
          "Durga Pooja with Kalamezhuthu",
          "Theyyam Performances",
          "Special Annadanam",
        ],
        participation: [
          "Open to all devotees",
          "Pre-registration via website",
          "Family groups encouraged",
        ],
        specialNote: [
          "Eco-friendly kumkum and flowers only",
          "Priority seating for elderly and children",
        ],
      },
      {
        eventID: "E0011",
        eventTitle: "Vijaya Dasami",
        eventDescription: " Vijaya Dasami Pooja",
        contact: {
          email: "events@lokanarkavutemple.com",
          phone: "+91-495-XXX-XXXX",
          website: "https://lokanarkavutemple.com/navratri",
          whatsapp: "+91-987-XXX-YYYY",
        },
        date: {
          // ISO date/time or just date is fine
          startDate: "2025-10-13T18:00",
          endDate: "2025-10-13T20:00",
        },
        eventTime: "5:00 AM - 9:00 PM",
        highlights: [
          "Durga Pooja with Kalamezhuthu",
          "Theyyam Performances",
          "Special Annadanam",
        ],
        participation: [
          "Open to all devotees",
          "Pre-registration via website",
          "Family groups encouraged",
        ],
        specialNote: [
          "<b>Eco-friendly kumkum and flowers only</b>",
          "Priority seating for elderly and children",
        ],
      },

      // add more events in this array as needed
    ],
  },
];
</script>

<style scoped>
.v-calendar-month__header-title {
  font-size: 10px !important; /* adjust as needed */
  font-weight: 600;
}
.v-calendar-month__day-label {
  font-size: 0.9rem !important;
}
.smallest-text {
  font-size: 0.65rem;
  line-height: 1rem;
  letter-spacing: -0.02em; /* tighten spacing slightly */
}
</style>
