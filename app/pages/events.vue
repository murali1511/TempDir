// pages/temple-events.vue (script setup)
<script setup>
import { ref } from "vue";
import { getEventsByTID } from "~/utils/eventsService.js";

const tid = "T0002";
const grouped = ref([]);

// default expands spanning events across months
grouped.value = getEventsByTID(tid);

// if you wanted NOT to expand spanning events:
// grouped.value = getEventsByTID(tid, { expandSpanning: false })
</script>

<template>
  <div>
    <h2>Events for {{ tid }}</h2>
    <div v-if="grouped.length === 0">No events found.</div>
    <div v-for="block in grouped" :key="block.monthYear" class="month-block">
      <h3>{{ block.monthYear }}</h3>
      <ul>
        <li v-for="ev in block.events" :key="ev.eventID">
          <strong>{{ ev.eventTitle }}</strong>
          <div>{{ ev.date.startDate }} — {{ ev.date.endDate }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
