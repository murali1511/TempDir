<template>
  <v-container fluid class="py-2">
    <!-- Page Title -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card color="teal-darken-4" class="rounded-lg" elevation="5">
          <v-card-title class="text-center text-h6 text-white font-weight-bold">
            Temple Information Summary
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card outlined class="mb-2">
          
          <!-- Temple Age Section -->
          <v-card-title class="font-weight-bold text-primary"
            >Temple Age</v-card-title
          >
          <v-card-text class="text-body-1">
            {{ data.templeAge }}
          </v-card-text>

          <!-- Terrain Section -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-primary"
            >Temple Terrain</v-card-title
          >
          <v-card-text>
            <v-chip-group column>
              <v-chip
                v-for="terrain in data.terrain"
                :key="terrain"
                color="teal lighten-3"
                dark
                >{{ terrain }}</v-chip
              >
            </v-chip-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-primary"
            >Temple Construction Style</v-card-title
          >

          <v-card-text>
            <v-chip-group column>
              <v-chip
                v-for="style in data.templeStyles"
                :key="style"
                color="teal lighten-1"
                dark
                >{{ style }}</v-chip
              >
            </v-chip-group>
          </v-card-text>
 <v-divider></v-divider>
      <!-- Sreekovil Details Section -->
          <v-card-title class="font-weight-bold text-primary"
            >Sreekovil Details</v-card-title
          >
         
          <v-card-text>
            <p>{{ data.sreekovilType }}, {{ data.sreekovilFloors.join(", ") }}
            </p>
          </v-card-text>
        </v-card>

        <!-- Deity Features Section -->
        <v-card outlined class="mb-6">
          <v-card-title class="font-weight-bold text-primary"
            >Deity Features</v-card-title
          >
          <v-divider></v-divider>
          <!-- Temple Style Section -->

          <v-card-text>
            <v-list dense>
              <v-list-item v-for="feature in data.deityFeatures" :key="feature">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ feature }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

       

      
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";

// Example data object from questionnaire
const data = reactive({
  poojaTimings: [
    "usha-pooja",
    "ethrthth-pooja",
    "pantheerati-pooja",
    "uccha-paoja",
    "aththaazha-pooja",
  ],
  templeAge: "Very ancient - Prior to two thousand years",
  terrain: ["Hill", "Forest"],
  deityFeatures: ["Shaiee (stone)", "Lohi (Metal)", "Manomayee (Sand)"],
  templeStyles: ["Nagara", "Dravida", "Kerala"],
  sreekovilType: "Square (sama-chathura)",
  sreekovilFloors: ["Eka-thala", "Dwi-thala"],
});
</script>

<style scoped>
.v-card-title {
  color: #004d40; /* Primary dark green */
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-chip {
  margin: 5px;
}

.v-list-item {
  padding: 8px 0;
}

p {
  margin: 10px 0;
  font-size: 16px;
  color: #333;
}
</style>
