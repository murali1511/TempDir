<template>
  <v-theme-provider class="pa-10" theme="dark" with-background>
    <v-container fluid class="fill-height">
      <v-row no-gutters align="center" justify="center" class="fill-height">
        <v-col cols="12" md="6" lg="5" sm="6">
          <v-row no-gutters align="center" justify="center">
            <v-col cols="12" md="6">
              <h1>Reset password</h1>
              <p class="text-medium-emphasis">
                Submit your email to get instructions for password reset
              </p>

              <v-form @submit.prevent="submit" @click="auth" class="mt-7">
                <div class="mt-1">
                  <label class="label text-grey-darken-2" for="email">Email</label>

                  <v-text-field
                    variant="outlined"
                    density="compact"
                    color="blue"
                    :rules="[ruleRequired, ruleEmail]"
                    v-model="email"
                    prepend-inner-icon="mdi-email-variant"
                    id="email"
                    name="email"
                    type="email"
                  />
                </div>

                <div class="mt-5">
                  <v-btn type="submit" block min-height="44" class="gradient-red"
                    >Reset</v-btn
                  >
                </div>
                <!-- <v-btn>
  Button
</v-btn> -->
              </v-form>

              <p class="text-body-2 mt-10">
                <span
                  >Don't have an account?
                  <NuxtLink to="/signup" class="font-weight-bold text-primary"
                    >Sign Up</NuxtLink
                  >
                </span>
              </p>
              <p class="text-body-2 mt-4">
                <span
                  >Do you have an account?
                  <NuxtLink to="/" class="font-weight-bold text-primary"
                    >Sign In</NuxtLink
                  >
                </span>
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="hidden-sm-and-down fill-height" md="6" lg="7">
          <!-- <img src="~/assets/temple1.jpg" alt="Discover Nuxt 3"   class="h-100 rounded-xl d-flex align-center justify-center"> -->

          <v-sheet max-width="550px">
            <v-img
              src="/logo-7-tr.png"
              height="400px"
              width="400px"
              cover
              class="text-end d-flex float-right"
            >
            </v-img>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <!-- <div class="d-flex align-center flex-column">
    <v-icon>mdi-home</v-icon>
    <v-card width="400" color="blue">
      <v-card-title>This is a title</v-card-title>
      <v-card-subtitle>This is a subtitle</v-card-subtitle>
      <v-card-text> This is content </v-card-text>
    </v-card>
    <v-btn class="mt-10" color="red">Hello Sass Changes</v-btn>
  </div> -->
  </v-theme-provider>
</template>

<script setup>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const message = ref("");

// Assuming these are custom validation rules you have created
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();

// Firebase Auth instance
const auth = getAuth();

const submit = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    message.value = "Password reset email sent successfully.";
    alert(message.value);
    router.push("/");
  } catch (err) {
    message.value = `Error: ${err.message}`;
  }
  console.log(message.value);
};
</script>

<style scoped>
.gradient-red {
  background: linear-gradient(46deg, #f96103, #858282);
}
</style>
