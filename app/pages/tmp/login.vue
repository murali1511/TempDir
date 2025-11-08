<template>
  <v-container fluid class="d-flex align-center justify-center fill-height login-container">
    <!-- Transparent Card -->
    <v-card max-width="400" elevation="0" class="rounded-xl login-card">
      <!-- Header with Icon -->
      <div class="login-header text-center">
        <v-icon size="64" color="gold">mdi-flower</v-icon>
      </div>

      <!-- Transparent Form -->

    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const submitLogin = () => {
  if (username.value && password.value) {
    alert("Login successful!");
  } else {
    alert("Please fill in both fields.");
  }
};
</script>

<style scoped>
/* Full-Page Background Styling */
.login-container {
  background-image: url("/bg-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Transparent Form Card Styling */
.login-card {
  background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent white */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); /* Soft shadow */
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px); /* Adds a frosted glass effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle border */
}

/* Icon in the Header */
.login-header {
  margin-bottom: 20px;
}

.login-header .v-icon {
  font-size: 64px;
}

/* Input Fields Styling */
.v-text-field {
  background-color: rgba(255, 255, 255, 0.8); /* Light transparency for inputs */
  border-radius: 8px;
}

.v-text-field input {
  color: black; /* Ensures text is visible */
}

.v-text-field .v-label {
  color: black !important; /* Label text visibility */
}

.v-text-field .v-input__control {
  color: black !important; /* Input text visibility */
}

/* Login Button */
.v-btn {
  width: 100%;
  margin-top: 20px;
  font-size: 18px;
  letter-spacing: 1px;
  background-color: rgba(255, 193, 7, 0.9); /* Slight opacity */
  text-transform: uppercase; /* Matches design aesthetic */
}

/* Font Styling */
body {
  font-family: "Poppins", sans-serif;
}
</style>
