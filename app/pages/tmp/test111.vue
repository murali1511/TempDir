<template>
  <v-container>
    <v-text-field
      v-model="startDateInput"
      label="Start (date & time)"
      type="datetime-local"
      variant="outlined"
      density="compact"
      placeholder="Select start date & time"
    />
    <p>Raw internal: {{ form.date.startDate }}</p>
    <!-- Shows: 2025-11-07T12:00:00.000Z -->
    <p>Displayed: {{ startDateInput }}</p>
    <!-- Now shows: 2025-11-07T12:00 (in local time components) -->
  </v-container>
</template>

<script setup>
import { reactive, computed } from "vue";

const form = reactive({
  date: {
    startDate: "2025-11-07T12:00:00.000Z", // Stored as UTC ISO
  },
});

const startDateInput = computed({
  get() {
    if (!form.date.startDate) return "";
    try {
      const date = new Date(form.date.startDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      // Format using LOCAL time components for datetime-local display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  },
  set(value) {
    if (!value) {
      form.date.startDate = "";
      return;
    }
    // Parse as LOCAL time, store as UTC ISO
    const date = new Date(value);
    if (isNaN(date.getTime())) return;
    form.date.startDate = date.toISOString();
  },
});
</script>
