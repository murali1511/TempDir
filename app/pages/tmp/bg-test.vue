<template>
  <v-app>
    <v-main :style="gradientStyle">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const currentHour = new Date().getHours();
const gradientStyle = computed(() => {
  return currentHour > 12 // Changed > to < for dawn in morning hours (before 12 PM)
    ? {
        background: "linear-gradient(to bottom, #FFFACD, #FFC1CC, #FF4500, #4B0082)",
      }
    : {
        background: "linear-gradient(to bottom, #FF4500, #4B0082)", // Sunset
        minHeight: "100vh", // CSS property as camelCase key-value pair
        animation: "gradientShift 10s ease infinite", // CSS property as camelCase key-value pair
      };
});
</script>

<style scoped>
v-main {
  min-height: 100vh; /* Ensure full screen coverage */
}
</style>
