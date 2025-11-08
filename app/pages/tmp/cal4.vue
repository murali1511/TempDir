<template>
  <v-container>
    <div class="calendar-wrap">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :events="calendarEvents"
        type="month"
        height="680"
        color="primary"
      >
        <!-- custom event rendering -->
        <template #event="{ event, parsedEvent }">
          <div v-if="event" class="event-pill" @click.stop="openEventDetail(event)">
            <small v-if="parsedEvent?.start?.time" class="event-time">{{ parsedEvent.start.time }}</small>
            <span class="event-title">{{ event.name }}</span>
          </div>
        </template>

        <!-- day slot: show a few events and +N more button -->
        <template #day="{ date }">
          <div class="day-cell">
            <div class="day-number">{{ String(date).slice(8,10) }}</div>

            <div class="day-events">
              <div
                v-for="(ev, i) in visibleEvents(date)"
                :key="ev.id ?? `${date}-${i}`"
                class="day-event-item"
                @click.stop="openEventDetail(ev)"
              >
                {{ ev.name }}
              </div>
            </div>

            <v-btn
              v-if="hiddenCount(date) > 0"
              small
              text
              class="more-btn"
              @click.stop="openDayDialog(date)"
            >
              +{{ hiddenCount(date) }} more
            </v-btn>
          </div>
        </template>
      </v-calendar>
    </div>

    <!-- Event detail dialog -->
    <v-dialog v-model="dialog" max-width="640px">
      <v-card>
        <v-card-title class="text-h6">{{ activeEvent?.name }}</v-card-title>

        <v-card-subtitle v-if="activeEventDateRange">
          {{ activeEventDateRange }}
        </v-card-subtitle>

        <v-card-text>
          <div v-if="activeEvent?.poojaTiming"><strong>Timings:</strong> {{ activeEvent.poojaTiming }}</div>
          <div v-if="activeEvent?.highlights?.length" class="mt-3">
            <strong>Highlights:</strong>
            <ul>
              <li v-for="(h, idx) in activeEvent.highlights" :key="idx">{{ h }}</li>
            </ul>
          </div>

          <div v-if="activeEvent?.participation?.length" class="mt-2">
            <strong>Participation:</strong>
            <ul>
              <li v-for="(p, idx) in activeEvent.participation" :key="idx">{{ p }}</li>
            </ul>
          </div>

          <div v-if="activeEvent?.specialNote?.length" class="mt-2">
            <strong>Notes:</strong>
            <ul>
              <li v-for="(n, idx) in activeEvent.specialNote" :key="idx">{{ n }}</li>
            </ul>
          </div>

          <div v-if="activeEvent?.contact" class="mt-3">
            <strong>Contact</strong>
            <div>Email: <a :href="`mailto:${activeEvent.contact.email}`">{{ activeEvent.contact.email }}</a></div>
            <div>Phone: <a :href="`tel:${activeEvent.contact.phone}`">{{ activeEvent.contact.phone }}</a></div>
            <div v-if="activeEvent.contact.whatsapp">WhatsApp: {{ activeEvent.contact.whatsapp }}</div>
            <div v-if="activeEvent.contact.website"><a :href="activeEvent.contact.website" target="_blank" rel="noreferrer">Website</a></div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Day events dialog (when clicking +N more) -->
    <v-dialog v-model="dayDialog" max-width="560px">
      <v-card>
        <v-card-title>Events on {{ dayDialogDate }}</v-card-title>
        <v-card-text>
          <v-list two-line>
            <v-list-item v-for="(ev,i) in dayDialogEvents" :key="i" @click="openEventDetail(ev)">
              <v-list-item-content>
                <v-list-item-title>{{ ev.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ ev.poojaTiming || ev.start }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn text @click="dayDialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

/*
  Your input JSON (example). In real app this might come from API.
*/
const templeJson = {
  "TID": "T0001",
  "name": "Lokanarkavu Temple",
  "events": [
    {
      "eventID": "E0010",
      "eventTitle": "Navratri Celebrations",
      "contact": {
        "email": "events@lokanarkavutemple.com",
        "phone": "+91-495-XXX-XXXX",
        "website": "https://lokanarkavutemple.com/navratri",
        "whatsapp": "+91-987-XXX-YYYY"
      },
      "date": {
        "startDate": "10/02/2025",
        "endDate": "10/10/2025"
      },
      "poojaTiming": "5:00 AM - 9:00 PM",
      "highlights": [
        "Durga Pooja with Kalamezhuthu",
        "Theyyam Performances",
        "Special Annadanam"
      ],
      "participation": [
        "Open to all devotees",
        "Pre-registration for special poojas via website",
        "Family groups encouraged for group rituals"
      ],
      "specialNote": [
        "Eco-friendly kumkum and flowers only",
        "Priority seating for elderly and children",
        "No external vendors allowed inside premises"
      ]
    }
    // add more event objects here if needed
  ]
}

/* ---------- helpers to parse MM/DD/YYYY --> YYYY-MM-DD ---------- */
function parseMDYtoISO(mdy) {
  if (!mdy || typeof mdy !== 'string') return null
  const parts = mdy.split('/')
  if (parts.length !== 3) return null
  const [MM, DD, YYYY] = parts
  // pad and return ISO date (no time)
  const mm = String(MM).padStart(2, '0')
  const dd = String(DD).padStart(2, '0')
  const yyyy = String(YYYY)
  return `${yyyy}-${mm}-${dd}`
}

function addDaysISO(isoYmd, days = 1) {
  if (!isoYmd) return null
  const dt = new Date(isoYmd + 'T00:00:00')
  dt.setDate(dt.getDate() + days)
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/* ---------- convert temple JSON events to v-calendar events ---------- */
const calendarEvents = computed(() => {
  if (!templeJson?.events || !Array.isArray(templeJson.events)) return []
  return templeJson.events.map(ev => {
    // parse start/end
    const startISO = parseMDYtoISO(ev.date?.startDate) ?? null
    // For proper multi-day inclusive spans many calendars expect end to be non-inclusive,
    // so we set end to the day after the provided endDate.
    const endISOExclusive = ev.date?.endDate ? addDaysISO(parseMDYtoISO(ev.date.endDate), 1) : null

    return {
      id: ev.eventID,
      name: ev.eventTitle,
      start: startISO,                // all-day start
      end: endISOExclusive || undefined, // optional end (non-inclusive)
      color: 'indigo',
      // keep original rich metadata accessible in slots / dialogs
      poojaTiming: ev.poojaTiming,
      highlights: ev.highlights,
      participation: ev.participation,
      specialNote: ev.specialNote,
      contact: ev.contact
    }
  })
})

/* ---------- calendar UI state ---------- */
const focus = ref(new Date().toISOString().slice(0,10))
const VISIBLE_PER_DAY = 3

// dialog state for selected event
const dialog = ref(false)
const activeEvent = ref(null)

// day +N dialog
const dayDialog = ref(false)
const dayDialogDate = ref('')
const dayDialogEvents = ref([])

function openEventDetail(ev) {
  activeEvent.value = ev
  dialog.value = true
}

function openDayDialog(date) {
  const key = String(date).slice(0,10)
  dayDialogDate.value = key
  dayDialogEvents.value = eventsForDate(key)
  dayDialog.value = true
}

/* ---------- helpers to query calendarEvents (always return arrays) ---------- */
function isoDayKey(d) {
  return String(d).slice(0,10)
}

/* check whether a given calendar event occurs on a given day.
   Uses event.start and event.end (end is exclusive if present). */
function eventOccursOnDay(ev, dayIso) {
  if (!ev || !ev.start) return false
  const start = ev.start.slice(0,10)
  // if end present treat as exclusive end (we set it that way above)
  const endEx = ev.end ? ev.end.slice(0,10) : null

  if (endEx) {
    // true when start <= day < endEx
    return (start <= dayIso) && (dayIso < endEx)
  } else {
    return start === dayIso
  }
}

function eventsForDate(date) {
  const day = isoDayKey(date)
  const arr = calendarEvents.value || []
  return arr.filter(ev => eventOccursOnDay(ev, day))
}

function visibleEvents(date) {
  return eventsForDate(date).slice(0, VISIBLE_PER_DAY)
}
function hiddenCount(date) {
  return Math.max(0, eventsForDate(date).length - VISIBLE_PER_DAY)
}

/* helper to present active event date range in dialog */
const activeEventDateRange = computed(() => {
  const ev = activeEvent.value
  if (!ev) return ''
  if (ev.start && ev.end) {
    // show inclusive end as one day before exclusive end
    const endInclusive = addDaysISO(ev.end, -1)
    return `${ev.start} → ${endInclusive}`
  }
  return ev.start ?? ''
})
</script>

<style scoped>
.calendar-wrap { max-width: 960px; margin: 0 auto; }

/* day cell styling */
.day-cell { display:flex; flex-direction:column; gap:6px; min-height:92px; padding:6px; }
.day-number { font-size:0.8rem; color:rgba(0,0,0,0.6); align-self:flex-end; }

/* event pill inside calendar */
.event-pill {
  display:inline-flex;
  gap:8px;
  align-items:center;
  padding:6px 10px;
  border-radius:8px;
  background: rgba(124,58,237,0.06);
  border-left: 4px solid rgba(124,58,237,0.9);
  cursor:pointer;
  font-size:0.85rem;
  max-width: 160px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* day events inside day slot */
.day-event-item {
  padding:6px 8px;
  border-radius:6px;
  background: rgba(0,0,0,0.03);
  font-size:0.85rem;
  cursor:pointer;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.more-btn { align-self:flex-start; margin-top:4px; }
</style>
