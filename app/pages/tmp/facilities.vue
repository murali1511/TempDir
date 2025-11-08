<template>
  <v-card class="mx-auto" max-width="450">
    <v-toolbar color="cyan-lighten-1">
      <v-btn icon="mdi-menu" variant="text"></v-btn>

      <v-toolbar-title>Inbox</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-magnify" variant="text"></v-btn>
    </v-toolbar>
    <v-list :items="facilities_en" lines="twenty" item-props>
      <template v-slot:item="{ props }">
        <v-list-item v-bind="props">
          <v-avatar color="red">
            <v-icon :icon="props.icon"></v-icon>
          </v-avatar>
          {{ props.name }}

          <!-- <template v-slot:subtitle="{ subtitle }">
            <div v-html="subtitle"></div>
          </template>
          <div v-for="(option, i) in props.options" v-html="option"></div> -->
        </v-list-item>
      </template>

      <!-- <template v-slot:prepend>
        <v-icon color="red">mdi-folder</v-icon>
      </template>
      <template v-slot:subtitle="{ subtitle }">
        <div v-html="subtitle"></div>
      </template>
      <template #item="{ icon }">
        <v-list-item> {{ icon }} test</v-list-item>
      </template> -->
    </v-list>
  </v-card>
</template>
<script setup>
const items = ref([
  {
    name: "Accomodations",
    icon: "mdi-folder",
    description:
      "Multiple options are available for devotees nearby the temple and within 5 km distance.",
    options: [
      "Lokanarkavu Devaswom Guest House: Provides dormitories and private rooms at reasonable rates, catering to devotees and pilgrims.",
      "PWD Guest House, Vadakara: Located in Vadakara town, offering budget-friendly rooms for visitors.",
      "Local Lodges and Hotels: Several budget and mid-range hotels are available in Vadakara town, such as: Malabar Residency (5 km), Sea Queen Hotel (6 km), Hotel Blue Nile (7 km)",
    ],
  },
  { type: "divider", inset: true },
  {
    name: "Summer BBQ",
    icon: "mdi-account-circle",
  },

  { type: "divider", inset: true },
  {
    name: "Birthday gift",
    icon: "mdi-folder",
  },
]);
const facilities_en = ref([
  {
    name: "Accommodation",
    icon: "mdi-folder",
    description:
      "Multiple options are available for devotees nearby the temple and within 5 km distance.",
    options: [
      "Lokanarkavu Devaswom Guest House: Provides dormitories and private rooms at reasonable rates, catering to devotees and pilgrims.",
      "PWD Guest House, Vadakara: Located in Vadakara town, offering budget-friendly rooms for visitors.",
      "Local Lodges and Hotels: Several budget and mid-range hotels are available in Vadakara town, such as: Malabar Residency (5 km), Sea Queen Hotel (6 km), Hotel Blue Nile (7 km)",
    ],
  },
  { type: "divider", inset: true },
  {
    name: "Dining Options",
    icon: "mdi-account-circle",
    description:
      "Numerous restaurants and eateries near the temple serve a variety of cuisines, including Kerala’s traditional delicacies.",
    options: [
      "Temple Road Eateries: Small restaurants offering budget meals near the temple.",
      "Vadakara Town Dining: Vegetarian and Non-vegetarian restaurants are available.",
    ],
  },
  { type: "divider", inset: true },
  {
    name: "Healthcare Facilities",
    icon: "mdi-account-circle",
    description:
      "In case of medical emergencies, several hospitals and clinics are located nearby.",
    options: [
      "Co-operative Hospital, Vadakara (5 km): A multi-specialty hospital offering 24/7 emergency care.",
      "Government Hospital, Vadakara (6 km): Provides general medical services and emergency care.",
      "Parco Hospital, Vadakara (6 km): A multi-specialty hospital offering 24/7 emergency care.",
      "Private Clinics and Pharmacies: Easily accessible within 5 km distance.",
    ],
  },
  { type: "divider", inset: true },
  {
    name: "Fuel Stations and Other Services",
    icon: "mdi-folder",
    description:
      "For travelers arriving by car, multiple gas stations and other essential services are available.",
    options: [
      "Fuel Stations: Indian Oil Petrol Pump (4 km), Bharat Petroleum Pump (5.5 km)",
      "ATM and Banking Services: Multiple banks and ATMs are available within 4 km distance for financial needs.",
    ],
  },
]);
</script>
