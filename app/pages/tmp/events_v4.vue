<template >
     <v-app :theme='config.public.theme'><v-app-bar color="#cc5d59" density="compact">
				<template v-slot:prepend>
					<v-app-bar-nav-icon color="white" @click="rootpage">
	
					</v-app-bar-nav-icon>
				</template>
				<template v-slot:append>
					<v-btn v-if=" $i18n.locale.value =='en'" icon="" @click="switchLanguage('ml')">മ</v-btn>
					<v-btn v-if=" $i18n.locale.value =='ml'" icon="" @click="switchLanguage('en')">E</v-btn>
				</template>

				
				<!-- <template v-slot:image>
					<v-img gradient="to top right, rgba(6,6,44,.8), rgba(37,26,120,.8)"></v-img>
				</template> -->

				<v-app-bar-title><span style="color:white;font-size:16px;font-weight: normal">Login Page...</span></v-app-bar-title>
			</v-app-bar>

  <v-container fluid class="py-4">

        <v-row no-gutters align="center" justify="center">
      <v-col cols="12" class="custom-col">
        <div v-for="(event, index) in events" :key="index" class="mb-6 align-center justify-center mt-10">
          <!-- Event Card -->

          <v-card elevation="5"  class="rounded-lg pa-4 gradient-red">
            <v-card-title :class="[display.smAndDown ? 'text-h5' : 'text-h4']" class="font-weight-bold text-center">
              {{ event.title }}
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-h6 font-weight-medium mb-2">{{ event.location.name }}, {{ event.location.city }}</p>
              <p class="mb-2">{{ date.format(event.date.startDate.toDate().toDateString(), 'fullDate') }}
                {{ (event.date.endDate.toDate() - event.date.startDate.toDate()) / (1000 * 60 * 60 * 24) < 1 ? '' : `-
                  ${date.format(event.date.endDate.toDate().toDateString(), 'fullDate' ) }` }} </p>
                  <b>Daily Pooja Timing</b> <div class=' text-center text-caption' v-html="event.date.dailyPoojaTiming"></div>
            </v-card-text>

            <!-- Add to Calendar Button & Toggle Content Button -->
            <v-card-actions class="justify-center">
              <v-btn color="black" @click="addToCalendar(event)">
                Add to Calendar
                <v-icon right>mdi-calendar-plus</v-icon>
              </v-btn>
              <v-btn elevated color="white-lighten-2" @click="toggleContent(index)" :append-icon="isSummary[index] ? 'mdi-chevron-down' : 'mdi-chevron-up'" class="bg-orange-darken-1  text-button text-capitalize">
                {{ isSummary[index] ? 'More Details' : 'Summary Only' }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- Event Details Section -->
          <v-expand-transition>
            <section v-if="!isSummary[index]" class="ma-3">
              <!-- Event Highlights -->
              <v-card elevation="4" class="mb-3 gradient-blue"  >
                <v-card-title class="text-h5 font-weight-bold text-center">
                  Event Highlights
                </v-card-title>
                <v-card-text>
                  <v-list dense class="gradient-blue" >
                    <v-list-item v-for="(highlight, hIndex) in event.highlights" :key="hIndex">
                        <v-list-item-title class="font-weight-bold text-center">{{ highlight.event
                          }}</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ highlight.date }}, {{ highlight.time
                          }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- How to Participate -->
              <v-card elevation="3"  class="mb-4 mt-4 gradient-blue">
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
              <v-card elevation="2"  class="mb-4 gradient-blue">
                <v-card-title class="text-h5 font-weight-bold text-center">
                  Special Information
                </v-card-title>
                <v-alert type="info" class="mb-2 gradient-blue"  >
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
                  <p><strong>Call:</strong> {{ event.contact.phone }} | <strong>WhatsApp:</strong> {{
                    event.contact.whatsapp
                    }}</p>
                  <p><strong>Website:</strong> <a :href="event.contact.website" target="_blank">{{ event.contact.website
                      }}</a></p>
                </v-card-text>
              </v-card>
            </section>
          </v-expand-transition>
        </div>
      </v-col> 
      </v-row>
  </v-container>
</v-app>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth',
// });

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
    const q = query(eventsCollection, where('close_date', '>=', today));
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
}

.v-list-item-title {
  font-size: 1.2rem;
}

.v-list-item-subtitle {
  font-size: 1rem;
}

.v-btn {
  color: #fff;
}

.v-card-actions {
  justify-content: center;
}

.v-alert {
  border-left: 5px solid #0d92e5;
}

.center-card {
  left: 50%;
  transform: translate(-50%, -50%);
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.custom-col {
  max-width: 650px;
}
.gradient-red {
  background: linear-gradient(120deg, #f96103, #858282,#f96103);
}
.gradient-blue {
  background: linear-gradient(120deg, #0d92e5, #858282,#0d92e5);
}
</style>