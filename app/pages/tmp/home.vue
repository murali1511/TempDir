<template>
  <v-app>
    <v-container>
      <!-- Header -->
      <v-app-bar app color="black">
        <v-toolbar-title>
          <img src="/assets/images/shiva_temple.jpg" alt="Logo" height="40" />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="mr-2" to="#about-us">About Us</v-btn>
        <v-btn text class="mr-2" to="#mission">Our Mission</v-btn>
        <v-btn text class="mr-2" to="#programs">Programs & Services</v-btn>
        <v-btn text class="mr-2" to="#beneficiaries">Beneficiaries</v-btn>
        <v-btn text class="mr-2" to="#events">Events</v-btn>
        <v-btn text class="mr-2" to="#contact">Contact Us</v-btn>
        <v-btn color="primary" rounded>Donate Now</v-btn>
      </v-app-bar>

      <!-- Hero Section -->
      <v-container fluid class="hero-section py-4">
        <div class="rouded-lg mt-8">
          <v-img
            src="/hero-image.jpg"
            class="rouded-lg"
            gradient="to bottom, rgba(0,0,0,0.7), hsla(0, 76.60%, 45.30%, 0.30)"
          >
            <v-container class="text-center text-white">
              <h1 class="display-1 mb-3">HPRC</h1>
              <h2 class="display-1">Reviving Heritage, Connecting Generations</h2>
              <h3>
                Preserving temples, fostering cultural identity, and revitalizing
                traditions for future generations.
              </h3>
              <v-btn color="primary" size="small" class="mx-1s">Learn More</v-btn>
              <v-btn color="secondary" size="small" class="mx-1">Donate Now</v-btn>
            </v-container>
          </v-img>
        </div>
      </v-container>

      <!-- Mission Statement -->
      <v-container class="my-4">
        <h2 id="mission">Our Mission</h2>
        <p class="mb-2">
          We are dedicated to preserving our cultural heritage through conservation,
          revitalization, and innovative outreach.
        </p>
        <v-row>
          <v-col cols="12" md="3">
            <v-icon color="primary">mdi-temple-hindu</v-icon>
            <p>Heritage Conservation</p>
          </v-col>
          <v-col cols="12" md="3">
            <v-icon color="primary">mdi-hand-heart</v-icon>
            <p>Cultural Revitalization</p>
          </v-col>
          <v-col cols="12" md="3">
            <v-icon color="primary">mdi-road</v-icon>
            <p>Infrastructure Development</p>
          </v-col>
          <v-col cols="12" md="3">
            <v-icon color="primary">mdi-web</v-icon>
            <p>Digital Outreach</p>
          </v-col>
        </v-row>
      </v-container>

      <!-- Programs & Services -->
      <v-container id="programs" class="my-4">
        <h2>Our Initiatives</h2>
        <v-row>
          <v-col cols="12" md="3" class="mb-18">
            <v-card class="ma-2 justify-center" variant="elevated">
              <v-img src="/logo-9-tr.png" height="40" width="40"></v-img>
              <v-card-title>Heritage Conservation</v-card-title>
              <v-card-text>Preserving our temples and monuments.</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" class="my-4">
            <v-card>
              <v-img src="/culture.jpg"></v-img>
              <v-card-title>Cultural Revival</v-card-title>
              <v-card-text>Organizing workshops and festivals.</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" class="my-4">
            <v-card>
              <v-img src="/infrastructure.jpg"></v-img>
              <v-card-title>Infrastructure Development</v-card-title>
              <v-card-text>Enhancing facilities and connectivity.</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" class="my-4">
            <v-card>
              <v-img src="/digital.jpg"></v-img>
              <v-card-title>Digital Outreach</v-card-title>
              <v-card-text>Interactive platforms for engagement.</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer -->
      <v-footer app>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="">
              <h3>Quick Links</h3>
              <v-btn size="x-small" to="#about-us" class="mr-2">About Us</v-btn>
              <v-btn size="x-small" to="#mission">Our Mission</v-btn>
            </v-col>
            <v-col cols="12" md="4">
              <h3>Contact Us</h3>
              <p>Email: info@heritage.org</p>
              <p>Phone: +91-9876543210</p>
            </v-col>
            <v-col cols="12" md="4">
              <h3>Subscribe</h3>
              <v-text-field label="Email Address"></v-text-field>
              <v-btn color="primary" size="small">Subscribe</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-container>
  </v-app>
</template>

<style scoped>
.hero-section {
  background: url("/bg-1.png") no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
}
</style>
<script setup>
definePageMeta({
  layout: "",
});

import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
</script>
