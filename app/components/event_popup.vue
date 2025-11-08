<template>


      <v-row no-gutters align="center" justify="center">
        <v-col cols="12" class="custom-col">
          <div v-for="(event, index) in events" :key="index" class="mb-6 align-center justify-center mt-2">
            <!-- Event Card -->
            <v-card elevation="5" class="rounded-lg pa-4 gradient-red">
              <v-card-title :class="[display.smAndDown ? 'text-subtitle-1' : 'text-h4']" class="font-weight-bold text-center">
                {{ event.title }}
              </v-card-title>
              <v-card-text class="text-center">
                <p class="text-subtitle-2 font-weight-medium mb-2">{{ event.location.name }}, {{ event.location.city }}</p>
                <p class="mb-2">{{ date.format(event.date.startDate.toDate().toDateString(), 'fullDate') }}
                  {{ (event.date.endDate.toDate() - event.date.startDate.toDate()) / (1000 * 60 * 60 * 24) < 1 ? '' : `-
                  ${date.format(event.date.endDate.toDate().toDateString(), 'fullDate' ) }` }} </p>
                  <b>Daily Pooja Timing</b> <div class=' text-center text-caption' v-html="event.date.dailyPoojaTiming"></div>
              </v-card-text>

              <!-- Add to Calendar Button & Toggle Content Button -->
              <v-card-actions class="justify-center">
                <v-btn
  @click="addToCalendar(event)"
  style="
    color: #2D2D2D;
    background: linear-gradient(145deg, #E57A68, #CC5D59);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    border: 1px solid #B84C4A;
    font-weight: bold;
  "
>
<span style="font-size: 10px;">{{$t('event_btn_1') }}</span>
  <v-icon right style="color: #2D2D2D;">mdi-calendar-plus</v-icon>
</v-btn>

<v-btn
  elevated
  @click="toggleContent(index)"
  :append-icon="isSummary[index] ? 'mdi-chevron-down' : 'mdi-chevron-up'"
  style="
    color: #2D2D2D;
    background: linear-gradient(145deg, #F27E7A, #D16967);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    border: 1px solid #C5605F;
    font-weight: bold;
  "
>
  <template v-slot:append>
    <v-icon :icon="isSummary[index] ? 'mdi-chevron-down' : 'mdi-chevron-up'" style="font-size: 24px;"></v-icon>
  </template>
  <span style="font-size: 10px;">{{ isSummary[index] ?   $t('event_btn_2_1')  :  $t('event_btn_2_2') }}</span>
</v-btn>

              </v-card-actions>
            </v-card>

            <!-- Event Details Section -->
            <v-expand-transition>
              <section v-if="!isSummary[index]" class="ma-3">
                <!-- Event Highlights -->
                <v-card elevation="4" class="mb-3 gradient-blue">
                  <v-card-title class="text-h5 font-weight-bold text-center">
                    Event Highlights
                  </v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item v-for="(highlight, hIndex) in event.highlights" :key="hIndex">
                        <v-list-item-title class="font-weight-bold text-center">{{ highlight.event }}</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ highlight.date }}, {{ highlight.time }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>

                <!-- How to Participate -->
                <v-card elevation="3" class="mb-4 mt-4 gradient-blue">
                  <v-card-title class="text-h5 font-weight-bold text-center">
                    How to Participate
                  </v-card-title>
                  <v-card-text class="text-center">
                    <div class=' text-start' v-html="event.participation"></div>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn color="primary" :href="event.contact.website" target="_blank">
                      Book Now
                      <v-icon right>mdi-calendar-check</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <!-- Special Note -->
                <v-card elevation="2" class="mb-4 gradient-blue">
                  <v-card-title class="text-h5 font-weight-bold text-center">
                    Special Information
                  </v-card-title>
                  <v-alert type="info" class="mb-2" style="background: rgba(255, 255, 255, 0.7)">
                    <div class='d-inline' v-html="event.specialnote"></div>
                  </v-alert>
                </v-card>

                <!-- Contact Information -->
                <v-card elevation="2" class="gradient-blue">
                  <v-card-title class="text-h5 font-weight-bold text-center">
                    Contact Information
                  </v-card-title>
                  <v-card-text class="text-center">
                    <p><strong>Contact:</strong> {{ event.contact.name }} </p>
                    <p><strong>Call:</strong> {{ event.contact.phone }} | <strong>WhatsApp:</strong> {{ event.contact.whatsapp }}</p>
                    <p><strong>Website:</strong> <a :href="event.contact.website" target="_blank">{{ event.contact.website }}</a></p>
                  </v-card-text>
                </v-card>
              </section>
            </v-expand-transition>
          </div>
        </v-col>
      </v-row>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth',
// });
import { defineProps } from 'vue';
const props = defineProps({
  eventid : {type: String}   
})
import { ref, onMounted, watchEffect } from 'vue';
import { useDisplay } from 'vuetify';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useDate } from 'vuetify'
import { useRuntimeConfig } from '#app'


const config = useRuntimeConfig()
const db = useFirestore();
const date = useDate()
const { $i18n } = useNuxtApp();

// Responsive breakpoint display
const display = useDisplay();

// Event Data
const events = ref([]);
const isSummary = ref([]);

// Function to fetch data from Firestore
const today = Timestamp.fromDate(new Date()); // Convert JavaScript Date to Firestore Timestamp

const fetchData = async () => {
try {
 const eventsCollection = collection(db, `events_${ $i18n.locale.value}`);
 const q = query(eventsCollection, where('eventID', '===', eventid));
 const querySnapshot = await getDocs(q);
 let data = [];
 querySnapshot.forEach((doc) => {
   data.push({ id: doc.id, ...doc.data() });
 });
 events.value = data;
 // Set all events to summary view initially
 isSummary.value = Array(data.length).fill(true);
} catch (e) {
 console.error('Error fetching documents: ', e);
}
};

const switchLanguage = (locale) => {  
     $i18n.setLocale(locale);
};

const rootpage =() => {
navigateTo('/', { redirectCode: 301 })
}
// Lifecycle hook to fetch data when component is mounted
onMounted(() => {
fetchData();
});

// Summary State Toggle
const toggleContent = (index) => {
isSummary.value[index] = !isSummary.value[index];
};

// Function to add the event to the mobile device's calendar
const addToCalendar = (event) => {
const title = event.title;
const location = `${event.location.name}, ${event.location.city}`;
const startDate = '20241001T060000'; // Event start date formatted
const endDate = '20241010T210000'; // Event end date formatted
const description = `Daily Pooja Timing: ${event.date.dailyPoojaTiming}`;

const intentUrl = `intent://details#Intent;action=com.android.calendar;S.title=${title};S.location=${location};S.description=${description};S.beginTime=${startDate};S.endTime=${endDate};end`;

window.location.href = intentUrl; // Trigger the intent for Android device
};
</script>

<style scoped>
.v-card-title {
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.v-list-item-title {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.v-list-item-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.v-btn {
  color: #fff;
}

.v-card-actions {
  justify-content: center;
}

.v-alert {
  border-left: 5px solid #3A6EA5;
}

.center-card {
  left: 50%;
  transform: translate(-50%, -50%);
}

.custom-col {
  max-width: 650px;
}

.gradient-red {
  background: linear-gradient(120deg, #FF6B35, #9032B3, #FF6B35);
}

.gradient-blue {
  background: linear-gradient(120deg, #3A6EA5, #6B7280, #3A6EA5);
}

.v-card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
