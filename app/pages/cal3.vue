<template>
  <v-container>
    <v-calendar
      ref="calendar"
      v-model="focus"
      :events="events"
      :event-color="getEventColor"
      :type="type"
      color="primary"
      height="600"                  
      @change="updateRange"
      @click:date="viewDay"
      @click:event="showEvent"
      @click:more="viewDay"         
    >
      <!-- custom day slot: render few events and show +N more only if there are hidden events -->
      <template #day="{ date }">
        <div class="my-day-cell">
          <!-- optional day number -->
          <!-- <div class="day-number">{{ fmtDay(date) }}</div> -->

          <!-- visible events -->
          <div class="day-events">
            <div
              v-for="(ev, i) in visibleEvents(date)"
              :key="ev.id ?? `${date}-${i}`"
              class="event-item"
              @click.stop="showEvent(ev)"
            >
              {{ ev.name }}
            </div>
          </div>

          <!-- only show when there are more events than visible -->
          <v-btn
            v-if="hiddenCount(date) > 0"
            small
            text
            @click.stop="openMore(date)"
          >
            +{{ hiddenCount(date) }} more
          </v-btn>
        </div>
      </template>
    </v-calendar>

    <!-- Dialog listing the hidden events -->
    <v-dialog v-model="dialog" max-width="520px">
      <v-card>
        <v-card-title>Events on {{ activeDate }}</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(ev, i) in activeEvents" :key="i">
              <v-list-item-content>
                <div class="text-subtitle-2">{{ ev.name }}</div>
                <div class="text-caption">{{ ev.start }}</div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn text @click="dialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const focus = ref(new Date().toISOString().slice(0, 10)) // v-model date (YYYY-MM-DD)
const type = ref('month')
const dialog = ref(false)
const activeEvents = ref([])
const activeDate = ref(null)

// Customize how many rows you want visible per day:
const VISIBLE_PER_DAY = 3

// sample events — replace these with your real events
const events = [
  { id: 1, name: 'Event 1', start: '2025-10-13T05:30:00',color:'blue',timed:0 },
  { id: 2, name: 'Event 2', start: '2025-10-13T08:00:00',color:'indigo',timed:0 },
  { id: 3, name: 'Event 3', start: '2025-10-13T09:30:00',color:'green',timed:0 },
  { id: 4, name: 'Event 4', start: '2025-10-13T10:30:00',color:'red',timed:1 },
  { id: 5, name: 'Event 5', start: '2025-10-13T11:30:00',color:'blue',timed:0 },
  { id: 6, name: 'Event 6', start: '2025-10-14T12:30:00' ,color:'yellow',timed:1},
   { id: 4, name: 'Event 4', start: '2025-10-15T10:30:00' ,color:'cyan',timed:0},
  { id: 5, name: 'Event 5', start: '2025-10-15T11:30:00' ,color:'orange',timed:1},
  // ...more sample events
]

// helper: normalize day key from any date string (v-calendar's date or event.start)
function dayKey(d) {
  // v-calendar passes date as "YYYY-MM-DD" (or sometimes as ISO). Take first 10 chars.
  return String(d).slice(0, 10)
}

// return events for a date
function eventsForDate(date) {
  const key = dayKey(date)
  return events.filter(ev => String(ev.start).slice(0, 10) === key)
}

function visibleEvents(date) {
  return eventsForDate(date).slice(0, VISIBLE_PER_DAY)
}
function hiddenCount(date) {
  return Math.max(0, eventsForDate(date).length - VISIBLE_PER_DAY)
}

function openMore(date) {
  activeDate.value = dayKey(date)
  activeEvents.value = eventsForDate(date)
  dialog.value = true
}

// optional handlers
function viewDay(date) {
  // open day view or set focus — calendar's default behavior
  focus.value = dayKey(date)
  // you may also navigate or open a custom day drawer
}
function showEvent(ev) {
  // show event details
  alert(JSON.stringify(ev, null, 2))
}

function updateRange(r) {
  // handle visible range changes
  // console.log('range changed', r)
}

function getEventColor (event) {
  // return per-event color or static
  return event.color || 'primary'
}

function fmtDay(date) {
  return dayKey(date) // or format with dayjs if you want numeric only
}
</script>

<style scoped>
.my-day-cell { padding: 4px; display:flex; flex-direction:column; gap:6px; }
.day-number { font-size: 0.75rem; color: rgba(0,0,0,0.6); }
.day-events { display:flex; flex-direction:column; gap:4px; }
.event-item { font-size: 0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer; }
</style>
