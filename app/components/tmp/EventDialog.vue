<template>
  <v-card color="yellow-lighten-4" min-width="350px" flat>
    <v-toolbar :color="selectedEvent.eventColor" dark class="mt-n3">
      <v-btn icon>
        <v-icon> {{ selectedEvent.eventIcon }}</v-icon>
      </v-btn>

      <v-toolbar-title class="font-weigth-bold text-subtitle-1">
        {{ selectedEvent.eventTitle }}</v-toolbar-title
      >

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="ml-n3 mr-n3">
      <!-- Event Header -->
      <v-card-text class="text-center">
        <!-- <p class="text-subtitle-2 font-weight-bold mb-2 mt-n4">
          {{ selectedEvent.eventTitle }}
        </p> -->
        <p class="font-weight-bold text-black mt-n6">
          {{ c }}

          {{
            (new Date(selectedEvent.date.endDate) -
              new Date(selectedEvent.date.startDate)) /
              (1000 * 60 * 60 * 24) <
            1
              ? ""
              : `-
                    ${format(selectedEvent.date.endDate, "fullDate")}`
          }}
        </p>
        <!-- <b class="text-black font-weight-bold text-caption">{{
          $t("event_popup_msg_1")
        }}</b> -->
        <span class="text-center text-caption font-weight-bold">{{
          selectedEvent.poojaTiming
        }}</span>
      </v-card-text>

      <!-- short description -->
      <div v-if="selectedEvent.eventDescription" class="mb-3">
        <div v-html="selectedEvent.eventDescription"></div>
      </div>

      <!-- participation -->
      <div v-if="selectedEvent.participation?.length" class="mb-3">
        <div class="font-weight-bold mb-1 mt-2">Participation</div>
        <v-list dense class>
          <v-list-item
            v-for="(p, i) in selectedEvent.participation"
            :key="i"
            class="mt-n2"
          >
            <v-list-item-icon
              ><v-icon size="15" :color="selectedEvent.eventColor"
                >mdi-account-group</v-icon
              ></v-list-item-icon
            >
            <v-list-item-content class="ml-2 mt-n2 text-caption">{{
              p
            }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <!-- notes -->
      <div v-if="selectedEvent.specialNote?.length" class="mb-3">
        <div class="font-weight-medium mb-1">Notes</div>
        <ul class="ml-4">
          <li v-for="(n, i) in selectedEvent.specialNote" :key="i">
            <span v-html="n"></span>
          </li>
        </ul>
      </div>

      <!-- contact & location -->
      <v-divider class="my-2" />
      <div class="d-flex flex-column gap-2">
        <div v-if="selectedEvent.contact?.email" class="mb-1">
          <v-icon left size="16" class="mr-2 text-caption">mdi-email</v-icon>
          <a :href="`mailto:${selectedEvent.contact.email}`" class="text-caption">{{
            selectedEvent.contact.email
          }}</a>
        </div>

        <div v-if="selectedEvent.contact?.phone" class="mb-1 mt-n2">
          <v-icon left size="16" class="ml-n2 mr-2">mdi-phone</v-icon>
          <a :href="`tel:${selectedEvent.contact.phone}`" class="text-caption">{{
            selectedEvent.contact.phone
          }}</a>
        </div>

        <div v-if="selectedEvent.contact?.website" class="mb-1 mt-n2">
          <v-icon left size="14" class="ml-n2 mr-2">mdi-web</v-icon>
          <a
            :href="selectedEvent.contact.website"
            target="_blank"
            rel="noreferrer"
            class="text-caption"
            >Visit website</a
          >
        </div>

        <div
          v-if="
            selectedEvent.location?.name ||
            (selectedEvent.location?.lat && selectedEvent.location?.lng)
          "
        >
          <v-icon left size="16">mdi-map-marker</v-icon>
          <span>{{
            selectedEvent.location?.name ||
            selectedEvent.location.lat + "," + selectedEvent.location.lng
          }}</span>
        </div>
      </div>
    </v-card-text>
    <!-- actions -->
    <v-card-actions>
      <v-btn text small @click="onShare(selectedEvent)">Share</v-btn>
      <v-spacer />
      <v-btn text small @click="openInMaps(selectedEvent)">Open in Maps</v-btn>
      <v-btn color="secondary" variant="elevated" @click="UpdateDialog" size="small"
        >Close</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useDisplay, useDate } from "vuetify";
const { format, parseIso, diff, date } = useDate();

const props = defineProps({
  selectedEvent: {
    type: Object,
  },
});

const selectedEvent = props.selectedEvent;
console.log(selectedEvent);
const emit = defineEmits(["update:dialog"]);
function UpdateDialog() {
  // tell parent about the updated value
  emit("update:dialog", false);
}
function parseDate(dateStr) {
  if (!dateStr) return null;
  const str = dateStr.replace(" ", "T"); // make "YYYY-MM-DD HH:MM" valid ISO
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
}
</script>
