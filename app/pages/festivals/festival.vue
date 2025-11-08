<template>
  <v-container fluid>
    <v-row class="pa-4" justify="center">
      <!-- Festival Card -->
      <v-col cols="12" md="8">
        <v-card class="elevation-10 rounded-lg ">
          <v-card-title class="text-center bg-orange">
            <v-icon large class="mr-3 text-primary">mdi-crown</v-icon>
            <span class=" font-weight-bold">{{ festivalInfo.festivalName }}</span>
          </v-card-title>

          <v-card-subtitle class="text-start grey--text">
            <div>
              <strong>Start Date:</strong> {{ festivalInfo.date.startDate }}<br />
              <strong>End Date:</strong> {{ festivalInfo.date.endDate }}<br />
              <strong>Duration:</strong> {{ festivalInfo.date.duration }}
            </div>
          </v-card-subtitle>

          <!-- Timings Section -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Timings</v-card-title>
          <v-list>
            <v-list-item v-for="(timing, index) in festivalInfo.timings" :key="index" >

              <v-list-item-title >: {{ timing.event }}</v-list-item-title>
              <template v-slot:prepend>
                <span class="font-weight-bold">{{ timing.time }}</span>
              </template>
            </v-list-item>
          </v-list>

          <!-- Significance Section -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Significance</v-card-title>
          <v-card-text class="pa-4 grey--text text--darken-1">{{ festivalInfo.significance }}</v-card-text>

          <!-- Special Rituals Section -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Special Rituals and Events</v-card-title>
          <v-list dense>
            <v-list-item v-for="(ritual, index) in festivalInfo.specialRituals" :key="index">

              <v-list-item-title>{{ ritual }}</v-list-item-title>

            </v-list-item>
          </v-list>

          <!-- Prasad and Dress Code Section -->
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Prasad Offering</v-card-title>
              <v-card-text>{{ festivalInfo.prasadOffering }}</v-card-text>
            </v-col>
            <v-col>
              <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Dress Code</v-card-title>
              <v-card-text>
                <strong>Men:</strong> {{ festivalInfo.dressCode.men }}<br />
                <strong>Women:</strong> {{ festivalInfo.dressCode.women }}
              </v-card-text>
            </v-col>
          </v-row>

          <!-- Facilities Section -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4 pa-2">Facilities Available</v-card-title>
             
              <!-- <v-card-text class="grey--text text--darken-1">{{ item.head }}</v-card-text> -->
            <v-card-text class="grey--text text--darken-1 pa-1 text-justify" v-for="item in festivalInfo.facilities" :key="item">{{ `- ${item.content }`}}
            </v-card-text>

          <!-- Contact Information -->
          <v-divider></v-divider>
          <v-card-title class="font-weight-bold text-h6 bg-orange-lighten-4">Contact Information</v-card-title>
          <v-list lines="one" dense>
            <v-list-item v-for="item in festivalInfo.contactInfo" :key="item" :title="`: ${item.content}`">
              <template v-slot:prepend>
                <span class="font-weight-bold">{{ item.head }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Example of the data structure in a ref
import { festivalInfo } from '~/composables/festivalinfo';
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.v-card-subtitle {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.wrap-text {
  word-wrap: break-word;
}
</style>