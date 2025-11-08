<template>
  <div>
    <!-- Calendar -->
    <div class="calendar">
      <!-- Header -->
      <div class="calendar-header">
        <v-btn icon @click="prevMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <h3>{{ formattedMonthYear }}</h3>
        <v-btn icon @click="nextMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Week Days -->
      <div class="calendar-grid">
        <div v-for="day in weekDays" :key="day" class="calendar-cell header">
          {{ day }}
        </div>

        <!-- Days -->
        <v-btn
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="calendar-cell"
          :class="{ 'other-month': day.isOtherMonth, 'has-program': day.hasEvent }"
          :variant="day.isToday ? 'outlined' : 'flat'"
          @click="handleDayClick(day)"
          size="small"
        >
          {{ day.date }}
        </v-btn>
      </div>
    </div>

    <!-- Event Details Card -->
    <v-card v-if="selectedDay && selectedDay.events.length > 0" class="mt-5 calendar" max-width="600px">
      <v-card-title class="text-center bg-red text-body-1">
        Events on {{ formattedDateSelectedDay }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(event, index) in selectedDay.events"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>{{ event.name }}</v-list-item-title>
              <v-list-item-subtitle>
                From: {{ formatDate(event.start) }} to {{ formatDate(event.end) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const currentDate = ref(new Date()); // Current visible date
const selectedDay = ref(null); // Selected day and its events
const formattedDateSelectedDay = ref("");

const events = ref([
  { name: "Executive committee Meeting ", start: "2024-11-22", end: "2024-11-24", color: "blue" },
  { name: "Pooja", start: "2024-11-22", end: "2024-11-22", color: "blue" },
  { name: "Workshop", start: "2024-11-18", end: "2024-11-18", color: "green" },
  { name: "Conference", start: "2024-11-19", end: "2024-11-20", color: "red" },
  { name: "Meeting", start: "2024-12-22", end: "2024-12-24", color: "blue" },
]);

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  // Get the first and last day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Determine the dates to display before and after this month for alignment
  const daysBefore = firstDay.getDay();
  const daysAfter = 6 - lastDay.getDay();

  // Create a range of dates
  const days = [];
  const totalDays = daysBefore + lastDay.getDate() + daysAfter;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, month, i - daysBefore + 1);
    const isOtherMonth = date.getMonth() !== month;
    const isToday = date.toDateString() === new Date().toDateString();

    // Match events with this date using start and end date
    const dateString = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    const matchingEvents = events.value.filter(
      (event) => dateString >= event.start && dateString <= event.end
    );

    days.push({
      date: date.getDate(),
      dateString, // Store the formatted date string
      isToday,
      isOtherMonth,
      hasEvent: matchingEvents.length > 0, // Flag to highlight days with events
      events: matchingEvents, // Store the matching events for this day
    });
  }
  return days;
});

const formattedMonthYear = computed(() => {
  const options = { year: "numeric", month: "long" };
  return currentDate.value.toLocaleDateString(undefined, options);
});

const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

// Handle day click
const handleDayClick = (day) => {
  selectedDay.value = day;
  formattedDateSelectedDay.value = new Date(day.dateString).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.calendar {
    width: 100%;
    max-width: 600px;
    margin: auto;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
    background: #f4f4f4;
    border-bottom: 1px solid #ddd;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 10px;
}

.calendar-cell {
    text-align: center;
    padding: 4px;
    border-radius: 4px;
    position: relative;
}

.calendar-cell.header {
    font-weight: bold;
    background: #f4f4f4;
}

.calendar-cell.current-day {
    color: white;
    /* White text */
    font-weight: bolder;
}

.calendar-cell.other-month {
    color: #ccc;
}

.event-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: 2px auto;
    position: relative;
}

/* Style for the current day (e.g., today's date) */
.current-day {

    color: red;
    /* White text */
    font-weight: bold;

}

/* Style for dates from other months */
.other-month {
    color: #ccc;
    /* Light gray text for dates not in the current month */
}

/* Style for dates that have events/programs */
.has-program {
    background: #28a745;
    /* Green background for program dates */
    color: white;
    /* White text for readability */
    border-radius: 8px;
    /* Rounded corners */
}
</style>
