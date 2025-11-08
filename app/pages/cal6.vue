<template>
  <v-sheet>
    <!-- NOTE: we bind multiple prop name variants so we cover different builds -->
    <v-calendar
      ref="calendar"
      :weekdays="[0,1,2,3,4,5,6]"
      :events="[]"
      :day-formatter="dayFormatter"              
      :day-format="dayFormatter"                   
      :weekday-formatter="weekdayFormatter"        
      :weekday-format="weekdayFormatter"           
      v-bind:weekdayFormatter="weekdayFormatter"  
      v-bind:weekdayFormat="weekdayFormatter"      
      class="my-calendar"
    />
  </v-sheet>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const calendar = ref(null);
const malayalamShort = ['ഞാ','തി','ചോ','ബു','വ്യാ','വെ','ശ'];

// put a console.log so we can see if Vuetify actually calls this
function weekdayFormatter(payload) {
  // payload shape varies by version — log it
  console.log('weekdayFormatter called with:', payload);
  try {
    const dateStr = payload?.date ?? payload?.value ?? payload; // defensive
    const d = new Date(dateStr);
    return malayalamShort[d.getDay()];
  } catch (e) {
    console.warn('weekdayFormatter parse error', e);
    return '';
  }
}

function dayFormatter(payload) {
  console.log('dayFormatter called with:', payload);
  try {
    const dateStr = payload?.date ?? payload?.value ?? payload;
    const d = new Date(dateStr);
    return String(d.getDate());
  } catch {
    return '';
  }
}

onMounted(() => {
  // Delay slightly so internals mount; this logs the component instance to inspect keys if needed
  setTimeout(() => {
    if (!calendar.value) {
      console.warn('calendar ref null — is the calendar rendered?');
      return;
    }
    console.log('calendar.value keys (first 80):', Object.keys(calendar.value).slice(0,80));
    // If you want to see which props the instance has, uncomment:
    // console.log(calendar.value);
  }, 150);
});
</script>

<style scoped>
/* immediate inline fallback in case Vuetify internal CSS overrides SFC */
::v-deep .v-calendar .v-calendar-weekdays .v-btn__content,
::v-deep .v-calendar .v-calendar-weekly__weekday .v-btn__content,
::v-deep .v-calendar .v-calendar-monthly__weekday .v-btn__content {
  font-size: 12px !important;
  line-height: 1 !important;
  padding: 2px 6px !important;
  text-align: center !important;
  white-space: nowrap !important;
  overflow: visible !important;
}

/* If you want an immediate visible change without deep CSS, add a tiny inline override */
/* The slot-less header uses Vuetify internal elements; the ::v-deep rule above targets them. */
</style>
