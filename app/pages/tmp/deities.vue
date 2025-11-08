<template>
  <v-container>
    <!-- Prime Deity Section -->
    <v-card class="mb-6" elevation="4" max-width="800px" outlined>
      <v-row class="align-center">
        <v-col cols="12" md="4" class="text-center">
          <!-- Large Round Button for Prime Deity -->
          <v-btn
            icon
            class="prime-deity-button"
            size="x-large"
            :style="{ backgroundImage: `url(${primeDeity.image})` }"
          ></v-btn>
        </v-col>
        <v-col cols="12" md="8">
          <!-- Prime Deity Description -->
          <div class="text-h5 font-weight-bold text-center">{{ primeDeity.name }}</div>
          <p class="text-body-2 text-justify pa-2 ">
            {{ primeDeity.description }}
          </p>
        </v-col>
      </v-row>
    </v-card>

    <!-- Sub Deities Section -->
    <v-card class="ma-6" elevation="2" max-width="800px" outlined>
      <v-card-title class="text-h6 font-weight-bold text-center">
        Sub Deities
      </v-card-title>
      <v-divider></v-divider>

      <v-row class="pa-4" justify="center" align="center">
        <v-col
          v-for="(deity, index) in subDeities"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          class="text-center"
        >
          <!-- Small Round Button for Sub Deity -->
          <v-btn
            icon
            class="sub-deity-button mb-3"
            :style="{ backgroundImage: `url(${deity.image})` }"
          ></v-btn>
          <!-- Sub Deity Description -->
          <div class="font-weight-bold">{{ deity.name }}</div>
          <p class="text-caption text-justify">{{ deity.description }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Prime Deity Data
const primeDeity = ref({
  name: "Goddess Bhagavathi",
  image: "/bhagavathi.webp", // Replace with actual image URL
  description:
    "Goddess Bhagavathi is the presiding deity of the temple, representing power, wisdom, and devotion. Devotees visit this temple to seek her divine blessings.",
});

// Sub Deities Data
const subDeities = ref([
  {
    name: "Lord Ganapathi",
    image: "/ganapathi.webp", // Replace with actual image URL
    description: "Lord Ganapathi, the remover of obstacles, is revered as the God of Beginnings. With an elephant head, he symbolizes wisdom, intellect, and prosperity. Modak, his favorite sweet, and his vehicle, the mouse, are his attributes. Devotees seek his blessings for success and harmony",
  },
  {
    name: "Lord Shiva",
    image: "/shiva.webp", // Replace with actual image URL
    description: "Lord Shiva is the Supreme Hindu deity, known as the Destroyer in the Trimurti. Symbolizing transformation, he embodies asceticism, meditation, and cosmic balance. Devotees revere him for his compassionate, yet powerful natures",
  },
  {
    name: "Lord Ayyappa",
    image: "/ayyappa.webp", // Replace with actual image URL
    description: "Devotees worship Ayyappa to seek his blessings for spiritual enlightenment, discipline, and the removal of obstacles.",

  },
]);
</script>

<style scoped>
/* Prime Deity Button - Large Round */
.prime-deity-button {
  height: 150px;
  width: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

/* Sub Deities Button - Small Round */
.sub-deity-button {
  height: 100px;
  width: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.v-card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
