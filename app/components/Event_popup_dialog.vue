<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="indigo"
        variant="text"
        icon
        size=" small"
        class="ml-2 text-subtitle-1 rounded-xl font-weight-bold"
      >
        {{ event.name }}
        <v-icon color="primary" size="small" class="ml-2"
          >mdi-file-document-outline</v-icon
        ></v-btn
      >
    </template>

    <template v-slot:default="{ isActive }">
      <v-row no-gutters align="center" justify="center">
        <v-col cols="12" class="custom-col">
          <div class="mb-6 align-center justify-center mt-2">
            <!-- Event Card -->
            <v-card elevation="5" class="rounded-lg pa-4 gradient-red">
              <v-card-title
                :class="[display.smAndDown ? 'text-subtitle-1' : 'text-h4']"
                class="font-weight-bold text-center text-black"
              >
                {{ event.title }}
              </v-card-title>
              <v-card-text class="text-center">
                <p class="text-subtitle-2 font-weight-bold mb-2">
                  {{ event.location.name }}, {{ event.location.city }}
                </p>
                <p class="mb-2 font-weight-bold text-white">
                  {{
                    date.format(event.date.startDate.toDate().toDateString(), "fullDate")
                  }}
                  {{
                    (event.date.endDate.toDate() - event.date.startDate.toDate()) /
                      (1000 * 60 * 60 * 24) <
                    1
                      ? ""
                      : `-
                    ${date.format(
                      event.date.endDate.toDate().toDateString(),
                      "fullDate"
                    )}`
                  }}
                </p>
                <b class="text-black font-weight-bold">{{ $t("event_popup_msg_1") }}</b>
                <div
                  class="text-center text-caption font-weight-bold text-white"
                  v-html="event.date.dailyPoojaTiming"
                ></div>
              </v-card-text>

              <v-card-text
                class="text-center font-weight-bold text-black"
                :class="
                  $i18n.locale.value === 'en' ? 'text-subtitle-1' : 'text-subtitle-2'
                "
              >
                {{ $t("event_popup_msg_2") }}
                <div v-for="(highlight, hIndex) in event.highlights" :key="hIndex">
                  <p
                    class="font-weight-bold text-center text-white mt-2"
                    :class="get_font_style()"
                  >
                    {{ formatDate(highlight.date) }}, {{ highlight.time }} ,
                    {{ highlight.event }}
                  </p>
                </div>
              </v-card-text>
              <v-card-text
                class="text-center font-weight-bold text-black"
                :class="
                  $i18n.locale.value === 'en' ? 'text-subtitle-1' : 'text-subtitle-2'
                "
              >
                {{ $t("event_popup_msg_3") }}
                <div
                  class="font-weight-bold text-center text-white mt-2"
                  :class="get_font_style()"
                  v-html="event.participation"
                ></div>

                <v-btn
                  color="primary"
                  :href="event.contact.website"
                  target="_blank"
                  size="x-small"
                >
                  Book Now
                  <v-icon right>mdi-calendar-check</v-icon>
                </v-btn>
              </v-card-text>
              <v-card-text
                class="text-center padding-0 mt-2 font-weight-bold text-black"
                :class="
                  $i18n.locale.value === 'en' ? 'text-subtitle-1' : 'text-subtitle-2'
                "
              >
                {{ $t("event_popup_msg_4") }}
              </v-card-text>
              <v-icon icon="mdi-information-outline" color="blue"></v-icon>
              <div
                class="font-weight-bold text-center text-white ml-1 d-inline"
                :class="get_font_style()"
                v-html="event.specialnote"
              ></div>

              <v-card-text
                class="text-center padding-0 mt-5 font-weight-bold text-black"
                :class="
                  $i18n.locale.value === 'en' ? 'text-subtitle-1' : 'text-subtitle-2'
                "
              >
                {{ $t("event_popup_msg_5") }}
              </v-card-text>
              <div class="text-center text-white" :class="get_font_style()">
                <p><strong>Contact:</strong> {{ event.contact.name }}</p>
                <p><strong>Call:</strong> {{ event.contact.phone }}</p>
                <p><strong>WhatsApp:</strong> {{ event.contact.whatsapp }}</p>
                <p>
                  <strong>Website:</strong>
                  <a :href="event.contact.website" target="_blank">{{
                    event.contact.website
                  }}</a>
                </p>
              </div>
              <!-- <v-alert type="info" class="mb-2 text-center align-center justy-center">
                <div class='d-inline' v-html="event.specialnote"></div>
              </v-alert> -->

              <!-- Add to Calendar Button & Toggle Content Button -->
              <v-card-actions class="justify-center">
                <v-btn color="primary" variant="elevated" @click="isActive.value = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Event Details Section -->
          </div>
        </v-col>
      </v-row>
    </template>
  </v-dialog>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth',
// });
import { defineProps, ref } from "vue";
import { useDisplay, useDate } from "vuetify";

const props = defineProps({
  event: {
    type: Object, // Use lowercase "type"
    required: true, // Correct "Required" to "required" (case-sensitive)
  },
});

const display = useDisplay();
const { $i18n } = useNuxtApp();
const date = useDate();

// Function to fetch data from Firestore
const switchLanguage = (locale) => {
  $i18n.setLocale(locale);
};
const rootpage = () => {
  navigateTo("/", { redirectCode: 301 });
};

// Function to add the event to the mobile device's calendar
const addToCalendar = (event) => {
  const title = event.title;
  const location = `${event.location.name}, ${event.location.city}`;
  const startDate = "20241001T060000"; // Event start date formatted
  const endDate = "20241010T210000"; // Event end date formatted
  const description = `Daily Pooja Timing: ${event.date.dailyPoojaTiming}`;

  const intentUrl = `intent://details#Intent;action=com.android.calendar;S.title=${title};S.location=${location};S.description=${description};S.beginTime=${startDate};S.endTime=${endDate};end`;

  window.location.href = intentUrl; // Trigger the intent for Android device
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const get_font_style = () => {
  return $i18n.locale.value == "ml" ? "text-caption " : "text-body-2 ";
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
  border-left: 5px solid #3a6ea5;
}

.center-card {
  left: 50%;
  transform: translate(-50%, -50%);
}

.custom-col {
  max-width: 650px;
}

.gradient-red {
  background: linear-gradient(180deg, #f2dfa7, #ff6b35, #f2dfa7);
}

.gradient-blue {
  background: linear-gradient(120deg, #3a6ea5, #6b7280, #3a6ea5);
}

.v-card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
.padding-0 {
  padding: 0px;
}
</style>
