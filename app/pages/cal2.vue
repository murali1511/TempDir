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
            <v-icon size="large">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            color="grey-darken-2"
            size="small"
            variant="text"
            icon
            @click="next"
          >
            <v-icon size="large">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="calendar" :class="[
  $vuetify.display.xs ? $i18n.locale.value == 'ml' ? 'text-caption':'text-body-2' : 'text-h6',
  'font-weight-bold',
  'ml-n1'
]">
            {{ calendar.title }}
          </v-toolbar-title>
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                color="grey-darken-2 font-weight-bold"
                variant="outlined"
                v-bind="props"
                size="small"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon end>
                  mdi-menu-down
                </v-icon>
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
   
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
          :close-on-content-click="false"
          location="end"
        >
          <v-card
            color="grey-lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="secondary"
                variant="text"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { $i18n } = useNuxtApp();

const focus = ref('')
const type = ref('month')
const typeToLabel = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  '4day': '4 Days',
}
const selectedEvent = ref({})
const selectedElement = ref(null)
const selectedOpen = ref(false)
const events = ref([])
const colors = ref(['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'])
const names = ref(['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'])
const calendar = ref(null)

const viewDay = (nativeEvent, { date }) => {
  focus.value = date
  type.value = 'day'
}

const getEventColor = (event) => {
  return event.color
}

const setToday = () => {
  focus.value = ''
}

const prev = () => {
  if (calendar.value) {
    calendar.value.prev()
  }
}

const next = () => {
  if (calendar.value) {
    calendar.value.next()
  }
}

const showEvent = (nativeEvent, { event }) => {
  const open = () => {
    selectedEvent.value = event
    selectedElement.value = nativeEvent.target
    requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
  }

  if (selectedOpen.value) {
    selectedOpen.value = false
    requestAnimationFrame(() => requestAnimationFrame(() => open()))
  } else {
    open()
  }

  nativeEvent.stopPropagation()
}

const updateRange = ({ start, end }) => {
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

const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a
}

onMounted(() => {
  if (calendar.value) {
    calendar.value.checkChange()
  }
})
</script>

<style scoped>
.v-calendar-month__header-title {
  font-size: 10px !important; /* adjust as needed */
  font-weight: 600;
}
.v-calendar-month__day-label {
  font-size: 0.9rem !important;
}
</style>