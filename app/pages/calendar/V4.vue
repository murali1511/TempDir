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

      <!-- View Selection -->
      <div class="view-selector text-center mt-2">
        <v-btn @click="setView('day')" :color="currentView === 'day' ? 'primary' : ''" class="mr-1" size="small">Day</v-btn>
        <v-btn @click="setView('week')" :color="currentView === 'week' ? 'primary' : '' " class="mr-1" size="small">Week</v-btn>
        <v-btn @click="setView('month')" :color="currentView === 'month' ? 'primary' : ''" size="small">Month</v-btn>
      </div>

      <!-- Week Days -->
      <div class="calendar-grid">
        <div v-for="day in weekDays" :key="day" class="calendar-cell header">
          {{ day }}
        </div>

        <!-- Days -->
        <v-btn v-for="(day, index) in daysInMonth" :key="index" class="calendar-cell"
          :class="{ 'other-month': day.isOtherMonth, 'has-program': day.hasEvent }"
          :variant="day.isToday ? 'outlined' : 'flat'" @click="handleDayClick(day)" size="small">
          {{ day.date }}
        </v-btn>
      </div>
    </div>

    <!-- Start - Event Details Card -->
<v-card v-if="sortedFilteredEvents.length > 0" class="mt-3 calendar" max-width="600px">
  <v-card-title class="text-center bg-red text-body-1">
    {{ getTitleForView }}
  </v-card-title>
  <v-card-text>
    <v-list>
      <v-list-item v-for="(event, index) in sortedFilteredEvents" :key="index">
        <v-list-item-title>{{ event.name }}</v-list-item-title>
        <v-list-item-subtitle>
          <div v-if="date.format(event.start.toDate().toDateString(), 'fullDate') === date.format(event.end.toDate().toDateString(), 'fullDate')">
            {{ date.format(event.start.toDate().toDateString(), 'fullDate') }}
          </div>
          <div v-else>
            From: {{ date.format(event.start.toDate().toDateString(), 'fullDate') }} to {{ date.format(event.end.toDate().toDateString(), 'fullDate') }}
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card-text>
</v-card>
<!-- End - Event Details Card -->

  </div>
</template>

<script setup>
import { ref, computed , onMounted, watchEffect } from "vue";
import { useDisplay } from 'vuetify';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useDate } from 'vuetify'

// const config = useRuntimeConfig()
const db = useFirestore();
const date = useDate()
const { $i18n } = useNuxtApp();

// Event Data
const events = ref([]);
const isSummary = ref([]);
// Function to fetch data from Firestore
const today = Timestamp.fromDate(new Date()); // Convert JavaScript Date to Firestore Timestamp


const currentDate = ref(new Date()); // Current visible date
const selectedDay = ref(null); // Selected day and its events
const currentView = ref("day"); // Current view (day, week, month)
const formattedDateSelectedDay = ref("");

const fetchData = async () => {
  try {
    const eventsCollection = collection(db, `events_${$i18n.locale.value}`);

    // Calculate the range based on the current view
    let startDate, endDate;

    if (currentView.value === "day") {
      // Day View
      startDate = Timestamp.fromDate(new Date(selectedDay.value?.dateString || currentDate.value.toLocaleDateString("en-CA")));
      endDate = startDate; // Same day
      
      
    } else if (currentView.value === "week") {
      // Week View
      const weekStart = new Date(selectedDay.value?.dateString || currentDate.value);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Saturday)

      startDate = Timestamp.fromDate(new Date(weekStart.toLocaleDateString("en-CA")));
      endDate = Timestamp.fromDate(new Date(weekEnd.toLocaleDateString("en-CA")));
    } else if (currentView.value === "month") {
      // Month View
      const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
      const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

      startDate = Timestamp.fromDate(new Date(monthStart.toLocaleDateString("en-CA")));
      endDate = Timestamp.fromDate(new Date(monthEnd.toLocaleDateString("en-CA")));
    }
    console.log("Query range:", {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });

    // Query Firestore
    const q = query(
      eventsCollection,
      where("date.startDate", "<=", endDate),
      where("date.endDate", ">=", startDate)
    );

    const querySnapshot = await getDocs(q);
 
    let data = [];
    querySnapshot.forEach((doc) => {
      const event = doc.data();
      console.log("Fetched Event:", event);
      data.push({
        id: doc.id,
        name: event.title,
        start: event.date.startDate,
        end: event.date.endDate,
      });
    });

    // Update events
    events.value = data;

console.log("events",events.value)
    // Set all events to summary view initially
    isSummary.value = Array(data.length).fill(true);
  } catch (e) {
    console.error("Error fetching documents: ", e);
  }
};




const switchLanguage = (locale) => {  
     $i18n.setLocale(locale);
};

// Lifecycle hook to fetch data when component is mounted
onMounted(() => {
fetchData();
});
watchEffect(() => {
  fetchData();
});

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
};

// Filtered events based on the selected view
const filteredEvents = computed(() => {
  if (currentView.value === "day") {
    return selectedDay.value?.events || [];
  } else if (currentView.value === "week") {
    const weekStart = new Date(selectedDay.value?.dateString || currentDate.value);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return events.value.filter(
      (event) =>
        (event.start >= weekStart.toLocaleDateString("en-CA") &&
          event.start <= weekEnd.toLocaleDateString("en-CA")) ||
        (event.end >= weekStart.toLocaleDateString("en-CA") &&
          event.end <= weekEnd.toLocaleDateString("en-CA"))
    );
  } else if (currentView.value === "month") {
    const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
    const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

    return events.value.filter(
      (event) =>
        (event.start >= monthStart.toLocaleDateString("en-CA") &&
          event.start <= monthEnd.toLocaleDateString("en-CA")) ||
        (event.end >= monthStart.toLocaleDateString("en-CA") &&
          event.end <= monthEnd.toLocaleDateString("en-CA"))
    );
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
  return [...events.value].sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);
    return dateA - dateB; // Ascending order
  });
});


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
