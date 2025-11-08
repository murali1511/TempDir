<template>
  <div>
    <v-sheet class="d-flex" tile>
      <v-btn class="ma-2" variant="text" icon @click="prev">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="comfortable"
        label="type"
        variant="outlined"
        hide-details
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        class="ma-2"
        density="comfortable"
        label="event-overlap-mode"
        variant="outlined"
        hide-details
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        class="ma-2"
        density="comfortable"
        label="weekdays"
        variant="outlined"
        hide-details
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" variant="text" icon @click="next">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        :event-color="getEventColor"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :events="events"
        :type="type"
        :weekdays="weekday"
        @change="getEvents"
      ></v-calendar>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const type = ref('month')
const types = ref(['month', 'week', 'day', '4day'])
const mode = ref('stack')
const modes = ref(['stack', 'column'])
const weekday = ref([0, 1, 2, 3, 4, 5, 6])
const weekdays = ref([
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
  { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
])

const value = ref('')
const events = ref([])
const colors = ref(['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey-darken-1'])
const names = ref([
  'Meeting',
  'Holiday',
  'PTO',
  'Travel',
  'Event',
  'Birthday',
  'Conference',
  'Party',
])
const calendar = ref(null)

const getEvents = ({ start, end }) => {
  const newEvents = []

  const min = new Date(`${start.date}T00:00:00`)
  const max = new Date(`${end.date}T23:59:59`)
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)

    newEvents.push({
      name: names.value[rnd(0, names.value.length - 1)],
      start: first,
      end: second,
      color: colors.value[rnd(0, colors.value.length - 1)],
      timed: !allDay,
    })
  }

  events.value = newEvents
}

const getEventColor = (event) => {
  return event.color
}

const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a
}

// Use built-in methods (available in Vuetify 3 v-calendar)
const prev = () => {
  if (calendar.value) {
    calendar.value.prev()
  }
}

const next = () => {
  console.log('Next clicked')  // For debugging
  if (calendar.value) {
    calendar.value.next()
  }
}

onMounted(() => {
  value.value = new Date().toISOString().split('T')[0]
  // Initial events load – use a range based on current type
  const today = { date: value.value }
  const range = type.value === 'month' ? 30 : type.value === 'week' ? 7 : 1
  const endDate = new Date(today.date)
  endDate.setDate(endDate.getDate() + range)
  getEvents({ start: today, end: { date: endDate.toISOString().split('T')[0] } })
})
</script>