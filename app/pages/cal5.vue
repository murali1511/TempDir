<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            class="ml-2"
            color="primary"
            variant="elevated"
            size="small"
            @click="setToday"
          >
            Today
          </v-btn>

          <v-btn
            color="grey-darken-2"
            size="small"
            variant="text"
            icon
            @click="prev"
          >
            <v-icon size="large">mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn
            color="grey-darken-2"
            size="small"
            variant="text"
            icon
            @click="next"
          >
            <v-icon size="large">mdi-chevron-right</v-icon>
          </v-btn>

          <!-- title: uses $vuetify.display.xs and i18n locale check -->
          <v-toolbar-title
            v-if="calendar"
            :class="[
              ($vuetify?.display?.xs)
                ? ($i18n?.locale?.value === 'ml' ? 'text-caption' : 'text-body-2')
                : 'text-h6',
              'font-weight-bold',
              'ml-n1'
            ]"
          >
            {{ calendar.title || '' }}
          </v-toolbar-title>

          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn
                color="grey-darken-2"
                class="font-weight-bold"
                variant="outlined"
                v-bind="props"
                size="small"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon end>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="type = 'day'"><v-list-item-title>Day</v-list-item-title></v-list-item>
              <v-list-item @click="type = 'week'"><v-list-item-title>Week</v-list-item-title></v-list-item>
              <v-list-item @click="type = 'month'"><v-list-item-title>Month</v-list-item-title></v-list-item>
              <v-list-item @click="type = '4day'"><v-list-item-title>4 days</v-list-item-title></v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
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
        >
          <!-- keep default rendering; custom slots already supported elsewhere -->
        </v-calendar>

        <!-- popup for selected event -->
        <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
          :close-on-content-click="false"
          location="end"
        >
          <v-card color="grey-lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color || 'primary'" dark>
              <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
              <v-toolbar-title v-html="selectedEvent.name || ''"></v-toolbar-title>
              <v-spacer />
              <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
              <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </v-toolbar>

            <v-card-text>
              <span v-html="selectedEvent.description || selectedEvent.details || ''"></span>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="secondary" variant="text" @click="selectedOpen = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const { $i18n } = useNuxtApp() // you already had this

// refs & state
const focus = ref(new Date().toISOString().slice(0, 10)) // YYYY-MM-DD
const type = ref('month')
const typeToLabel = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  '4day': '4 Days'
}

const selectedEvent = ref({})
const selectedElement = ref(null)
const selectedOpen = ref(false)

const events = ref([]) // will be populated by updateRange mapping
const colors = ref(['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'])
const names = ref(['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'])
const calendar = ref(null) // template ref

// sample allevents JSON corrected (structure fixed)
const allevents = [
  {
    TID: 'T0001',
    name: 'Lokanarkavu Temple',
    events: [
      {
        eventID: 'E0010',
        eventTitle: 'Navratri Celebrations',
        eventDescription: 'Navaratri Celebration and Vijaya Dasami Pooja',
        contact: {
          email: 'events@lokanarkavutemple.com',
          phone: '+91-495-XXX-XXXX',
          website: 'https://lokanarkavutemple.com/navratri',
          whatsapp: '+91-987-XXX-YYYY'
        },
        date: {
          // ISO date/time or just date is fine
          startDate: '2025-10-13T05:30:00',
          endDate: '2025-10-13T15:30:00'
        },
        eventTime: '5:00 AM - 9:00 PM',
        highlights: ['Durga Pooja with Kalamezhuthu', 'Theyyam Performances', 'Special Annadanam'],
        participation: ['Open to all devotees', 'Pre-registration via website', 'Family groups encouraged'],
        specialNote: ['Eco-friendly kumkum and flowers only', 'Priority seating for elderly and children']
      }

      // add more events in this array as needed
    ]
  }
]

/* ---------- utility: safe random ---------- */
const rnd = (a, b) => Math.floor((b - a + 1) * Math.random()) + a

/* ---------- calendar controls ---------- */
const setToday = () => { focus.value = new Date().toISOString().slice(0, 10) }
const prev = () => { if (calendar.value?.prev) calendar.value.prev() }
const next = () => { if (calendar.value?.next) calendar.value.next() }

const viewDay = (payload) => {
  // Vuetify may give either (nativeEvent, { date }) or just date depending on version.
  // Support both signatures:
  const date = payload?.date ?? (payload ?? null)
  if (!date) return
  focus.value = String(date).slice(0, 10)
  type.value = 'day'
}

/* click:event handler signature: (nativeEvent, { event }) in many versions.
   handle either form gracefully. */
const showEvent = (nativeEventOrPayload, maybePayload) => {
  let nativeEvent = null
  let event = null

  if (maybePayload && maybePayload.event) {
    nativeEvent = nativeEventOrPayload
    event = maybePayload.event
  } else if (nativeEventOrPayload?.event) {
    event = nativeEventOrPayload.event
    nativeEvent = nativeEventOrPayload.nativeEvent || null
  } else {
    // fallback: payload may be the event object itself
    event = nativeEventOrPayload
  }

  if (!event) return

  const open = () => {
    selectedEvent.value = event
    // try to attach activator element; prefer currentTarget if available
    selectedElement.value = (nativeEvent?.currentTarget) || (nativeEvent?.target) || null
    // small double rAF to let v-menu measure correctly when using element activator
    requestAnimationFrame(() => requestAnimationFrame(() => (selectedOpen.value = true)))
  }

  if (selectedOpen.value) {
    selectedOpen.value = false
    requestAnimationFrame(() => requestAnimationFrame(open))
  } else {
    open()
  }

  if (nativeEvent?.stopPropagation) nativeEvent.stopPropagation()
}

/* ---------- convert allevents -> simple calendar events ---------- */
/* updateRange receives the visible calendar range from v-calendar; signature may vary.
   We'll accept any payload and then map allevents to `events` (the array v-calendar uses). */
function parseToCalendarEvent(TempleEvent) {
  // safe extraction of start/end (if your source uses MM/DD/YYYY or DD/MM/YYYY adapt here)
  const start = TempleEvent?.date?.startDate ?? TempleEvent.startDate ?? null
  const end = TempleEvent?.date?.endDate ?? TempleEvent.endDate ?? null

  // use provided start/end as-is (Vuetify accepts ISO strings). If they are non-ISO
  // you should convert them to 'YYYY-MM-DD' or full ISO timestamps here.
  return {
    id: TempleEvent.eventID ?? TempleEvent.eventTitle,
    name: TempleEvent.eventTitle ?? TempleEvent.name ?? 'Event',
    start: start, // e.g. '2025-10-13T05:30:00' or '2025-10-13'
    end: end || undefined,
    color: colors.value[rnd(0, colors.value.length - 1)],
    description: TempleEvent.eventDescription ?? TempleEvent.eventDescription,
    contact: TempleEvent.contact,
    poojaTiming: TempleEvent.eventTime ?? TempleEvent.poojaTiming,
    highlights: TempleEvent.highlights,
    participation: TempleEvent.participation,
    specialNote: TempleEvent.specialNote
  }
}

const updateRange = (rangePayload) => {
  // rangePayload shape can vary; we don't strictly need start/end here to create events,
  // but we'll parse it defensively if you want to filter events to visible range.
  // For now we simply map allevents -> events list (flatten temples -> temple.events)
  const newEvents = []

  // flatten all temples' events
  for (const temple of allevents) {
    if (!Array.isArray(temple.events)) continue
    for (const TEvent of temple.events) {
      newEvents.push(parseToCalendarEvent(TEvent))
    }
  }

  events.value = newEvents
}

/* getEventColor - return color value for an event (used by :event-color) */
const getEventColor = (event) => event?.color ?? 'primary'

/* ---------- lifecycle ---------- */
onMounted(() => {
  // initial populate
  updateRange()
  // if calendar exposes checkChange (older examples), call it
  if (calendar.value?.checkChange) calendar.value.checkChange()
})
</script>

<style scoped>
.v-calendar-month__header-title {
  font-size: 14px !important;
  font-weight: 600;
}
.v-calendar-month__day-label {
  font-size: 0.95rem !important;
}

/* small custom tweaks */
.event-pill { cursor: pointer; }
</style>
