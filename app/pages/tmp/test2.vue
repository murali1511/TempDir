<template>
  <v-card class="mx-auto pa-4" width="520">
    <v-menu
      v-model="menuOpen"
      :close-on-content-click="false"
      transition="fade-transition"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text">
          <div class="bg-surface-light pt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione
            debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat
            totam, magni doloremque veniam neque porro libero rerum unde voluptatem!
          </div>
        </v-btn>
      </template>

      <v-card width="400" elevation="4">
        <v-card-title>Welcome to Vuetify</v-card-title>

        <v-card-text class="bg-surface-light pt-4">
          This version behaves like a tooltip but handles internal clicks correctly.
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="teal-accent-4" variant="elevated" @click="menuOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
const menuOpen = ref(false);
</script>
