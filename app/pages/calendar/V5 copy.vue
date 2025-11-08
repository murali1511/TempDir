<template>
  <div>
    <!-- Calendar -->
    <div class="calendar">
      <!-- Header -->
      <div class="calendar-header">
        <v-btn
          icon
          @click="prevMonth"
          size="small"
          :style="`background: ${colorScheme[0]} `"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <h3 :style="`color: ${colorScheme[0]} `">{{ formattedMonthYear }}</h3>
        <v-btn
          icon
          @click="nextMonth"
          size="small"
          :style="`background: ${colorScheme[0]} `"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- View Selection -->
      <div class="view-selector text-center mt-2">
        <v-btn
          @click="setView('day')"
          :color="currentView === 'day' ? colorScheme[0] : ''"
          class="mr-1"
          size="small"
          >Day</v-btn
        >
        <v-btn
          @click="setView('week')"
          :color="currentView === 'week' ? colorScheme[0] : ''"
          class="mr-1"
          size="small"
          >Week</v-btn
        >
        <v-btn
          @click="setView('month')"
          :color="currentView === 'month' ? colorScheme[0] : ''"
          size="small"
          >Month</v-btn
        >
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
          :class="{
            'other-month': day.isOtherMonth,
            'has-program': day.hasEvent,
            'is-today': day.isToday,
          }"
          :variant="day.isToday ? 'elevated' : 'flat'"
          @click="handleDayClick(day)"
          size="small"
        >
          {{ day.date }}
        </v-btn>
      </div>
    </div>

    <!-- Start - Event Details Card -->
    <v-card
      v-if="sortedFilteredEvents.length > 0"
      class="mt-3 calendar"
      max-width="600px"
    >
      <v-card-title class="text-center bg-red text-body-1">
        {{ getTitleForView }}
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(event, index) in sortedFilteredEvents" :key="index">
            <v-list-item-title>
              <event-popup-dialog :event="event"> </event-popup-dialog>
            </v-list-item-title>
            <v-list-item-subtitle class="ml-2 mt-1 font-weight-bold">
              <div v-if="formatDate(event.start) === formatDate(event.end)">
                {{ formatDate(event.start) }}
              </div>
              <div v-else>
                {{ formatDate(event.start) }} to {{ formatDate(event.end) }}
              </div>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="ml-2 mt-1 mb-1"
              :class="$i18n.locale.value === 'en' ? 'text-subtitle-2' : 'text-caption'"
              >{{ event.location.name }}, {{ event.location.city }}</v-list-item-subtitle
            >
            <v-divider :thickness="1" class="border-opacity-25" color="black" />
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- End - Event Details Card -->
    <v-row justify="center" class="mt-5">
      <v-btn
        :color="colorScheme[0]"
        variant="elevated"
        prepend-icon="mdi-home"
        to="/"
        max-width="400px"
        min-width="125px"
        class="mx-auto d-flex"
      >
        Home
      </v-btn>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useDate } from "vuetify";
import { dbStore } from "~/composables/dbStore";
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

const db = useFirestore();
const date = useDate();
const { $i18n } = useNuxtApp();

const currentDate = ref(new Date()); // Current visible date
const selectedDay = ref(null); // Selected day and its events
const currentView = ref("day"); // Current view (day, week, month)
const formattedDateSelectedDay = ref("");

// Event Data
const events = ref([]);

// Start - Lifecycle hook to fetch data when component is mounted
onMounted(() => {
  fetchData();
});
// End - Lifecycle hook to fetch data when component is mounted

// Start - Fectch Data from Firebase
const fetchData = async () => {
  try {
    const eventsCollection = collection(db, `events_${$i18n.locale.value}`);
    // Fetch all documents in the collection
    const querySnapshot = await getDocs(eventsCollection);

    let data = [];
    querySnapshot.forEach((doc) => {
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

    // Update events
    events.value = data;

    console.log("events", events.value);
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};
// End - Tectch Data from firebase

// const events = ref([
//   { id: "E0001", name: "Executive committee Meeting", start: "2024-11-22", end: "2024-11-24", color: "blue" },
//   { id: "E0002", name: "Pooja", start: "2024-11-22", end: "2024-11-22", color: "blue" },
//   { id: "E0003", name: "Workshop", start: "2024-11-18", end: "2024-11-18", color: "green" },
//   { id: "E0004", name: "Conference", start: "2024-11-19", end: "2024-11-20", color: "red" },
//   { id: "E0005", name: "Meeting", start: "2024-12-22", end: "2024-12-24", color: "blue" },
//   { id: "E0006", name: "Conference", start: "2024-12-05", end: "2024-12-05", color: "blue" },
//   { id: "E0007", name: "Conference AI", start: "2024-11-05", end: "2024-11-05", color: "blue" },
//   { id: "E0008", name: "Conference AI", start: "2024-11-15", end: "2024-11-15", color: "blue" },
// ]);

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
    const dateString = date.toLocaleDateString("en-CA"); // Use YYYY-MM-DD format
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

const setView = (view) => {
  currentView.value = view;
  if (view === "week" && !selectedDay.value) {
    selectedDay.value =
      daysInMonth.value.find((day) => day.isToday) || daysInMonth.value[0];
  }
};

// Filtered events based on the selected view
const filteredEvents = computed(() => {
  if (currentView.value === "day") {
    return selectedDay.value?.events || [];
  } else if (currentView.value === "week") {
    // Determine the week start and end dates
    const weekStart = new Date(selectedDay.value?.dateString || currentDate.value);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Saturday)

    return events.value.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      // Check if the event overlaps with the week
      return (
        (eventStart >= weekStart && eventStart <= weekEnd) || // Event starts in the week
        (eventEnd >= weekStart && eventEnd <= weekEnd) || // Event ends in the week
        (eventStart <= weekStart && eventEnd >= weekEnd) // Event spans the entire week
      );
    });
  } else if (currentView.value === "month") {
    const monthStart = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      0
    );

    return events.value.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      return (
        (eventStart >= monthStart && eventStart <= monthEnd) ||
        (eventEnd >= monthStart && eventEnd <= monthEnd) ||
        (eventStart <= monthStart && eventEnd >= monthEnd)
      );
    });
  }
  return [];
});

const formattedView = computed(() => {
  if (currentView.value === "day") {
    return formattedDateSelectedDay.value || "Selected Day";
  } else if (currentView.value === "week") {
    return "Selected Week";
  } else {
    return "Selected Month";
  }
});

const switchLanguage = (locale) => {
  $i18n.setLocale(locale);
};

const handleDayClick = (day) => {
  selectedDay.value = day;
  formattedDateSelectedDay.value = new Date(day.dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchData().then(() => {
    // Automatically select today's date if available
    const today = daysInMonth.value.find((day) => day.isToday);
    if (today) {
      selectedDay.value = today;
      formattedDateSelectedDay.value = new Date(today.dateString).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    }
  });
});

const getTitleForView = computed(() => {
  if (currentView.value === "day") {
    // Display the selected day
    return `Events for ${formattedDateSelectedDay.value || "Selected Day"}`;
  } else if (currentView.value === "week") {
    // Calculate the start and end of the selected week
    const weekStart = new Date(selectedDay.value?.dateString || currentDate.value);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Saturday)

    return `Events- ${formatDate(weekStart.toLocaleDateString("en-CA"))} to ${formatDate(
      weekEnd.toLocaleDateString("en-CA")
    )}`;
  } else if (currentView.value === "month") {
    // Display the selected month and year
    const options = { year: "numeric", month: "long" };
    return `Events- ${currentDate.value.toLocaleDateString("en-GB", options)}`;
  }
  return "Events"; // Default fallback
});

const sortedFilteredEvents = computed(() => {
  // Sort the filtered events by their start date
  return [...filteredEvents.value].sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);
    return dateA - dateB; // Ascending order
  });
});

const event_popup = (eventID) => {
  alert(eventID);
};
</script>

<style scoped>
.calendar {
  width: 100%;
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
  border: 1px solid #292d30;
  border-radius: 8px;
  background: white;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  background: #282828;
  border-bottom: 1px solid #ddd;
  border-radius: 8px;
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
  background: gray;
}

.calendar-cell.current-day {
  color: rgb(255, 255, 255);
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

/* Style for dates from other months */
.other-month {
  color: #ccc;
  /* Light gray text for dates not in the current month */
}
.is-today {
  color: black;
  font-weight: bolder;
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
.v-btn--size-default {
  padding: opx;
}
</style>
