<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="viewMode"
        :items="viewModes"
        class="ma-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      ></v-select>
    </v-sheet>
    <v-sheet>
      <v-calendar v-model="value" :events="events" :view-mode="viewMode"></v-calendar>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDate } from "vuetify";

// Reactive state
const viewMode = ref("month");
const viewModes = ref(["month", "week", "day"]);
const value = ref(new Date());
const events = ref([]);

// Vuetify date adapter
const adapter = useDate();

// Sample events
const generateEvents = () => {
  const today = new Date();
  events.value = [
    {
      title: "Team Meeting",
      start: adapter.addDays(today, 1),
      end: adapter.addDays(today, 1),
      color: "blue",
      allDay: false,
    },
    {
      title: "Holiday",
      start: adapter.addDays(today, 3),
      end: adapter.addDays(today, 4),
      color: "green",
      allDay: true,
    },
  ];
};

// Initialize events on mount
onMounted(() => {
  generateEvents();
});
</script>
