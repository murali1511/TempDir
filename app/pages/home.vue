<template>
  <v-app>
    <v-container>
      <!-- Header -->
      <v-app-bar app flat color="red">
        <v-toolbar-title class="text-h5 text-red">Temple Trust</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="text-white" to="#about">About</v-btn>
        <v-btn text class="text-white" to="#mission">Mission</v-btn>
        <v-btn text class="text-white" to="#initiatives">Initiatives</v-btn>
        <v-btn text class="text-white" to="#contact">Contact</v-btn>
      </v-app-bar>

      <!-- Hero Section -->
      <v-container fluid class="hero-section d-flex align-center justify-center">
        <v-img src="/hero-evening.jpg" cover class="hero-image"></v-img>
        <div class="hero-content text-center text-white">
          <h1 class="display-1 font-weight-bold">
            Reviving Heritage, Connecting Generations
          </h1>
          <h3 class="mt-4">
            Preserving temples and fostering cultural identity for future generations.
          </h3>
          <v-btn class="mt-6" color="secondary" large rounded>Learn More</v-btn>
        </div>
      </v-container>

      <!-- Mission Section -->
      <v-container id="mission" class="text-center py-12">
        <h2 class="text-primary mb-6">Our Mission</h2>
        <p class="mx-auto text-muted" style="max-width: 700px; font-size: 1.2rem">
          We aim to preserve and restore temples, revitalize cultural practices, and
          promote a deeper connection to our spiritual heritage through infrastructure
          development and digital outreach.
        </p>
      </v-container>

      <!-- Initiatives Section -->
      <v-container id="initiatives" class="py-12">
        <h2 class="text-center text-primary mb-6">Our Initiatives</h2>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" md="3" class="mb-6">
            <v-card outlined color="surface">
              <v-img src="/heritage.jpg" height="150"></v-img>
              <v-card-title class="text-primary">Heritage Conservation</v-card-title>
              <v-card-text class="text-muted"
                >Preserving ancient temples and their glory.</v-card-text
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="3" class="mb-6">
            <v-card outlined color="surface">
              <v-img src="/culture.jpg" height="150"></v-img>
              <v-card-title class="text-primary">Cultural Revival</v-card-title>
              <v-card-text class="text-muted"
                >Workshops and festivals to promote traditions.</v-card-text
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="3" class="mb-6">
            <v-card outlined color="surface">
              <v-img src="/infrastructure.jpg" height="150"></v-img>
              <v-card-title class="text-primary">Infrastructure Development</v-card-title>
              <v-card-text class="text-muted"
                >Enhancing temple facilities and accessibility.</v-card-text
              >
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer -->
      <v-footer app class="py-6" color="background">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center text-white">
              <p class="mb-2">Contact us: info@templetrust.org | +91-9876543210</p>
              <p>&copy; 2025 Temple Trust. All rights reserved.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-container>
  </v-app>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 80vh;
  background: url("/hero-evening.jpg") no-repeat center center;
  background-size: cover;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-content {
  position: absolute;
  z-index: 1;
}
.hero-image {
  opacity: 0.5;
}
.text-primary {
  color: #ffb703;
}
.text-muted {
  color: #d3d3d3;
}
</style>
<script setup>
definePageMeta({
  layout: "",
});
</script>
