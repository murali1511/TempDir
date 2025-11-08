<template>
  <v-theme-provider class="pa-10" theme="dark" with-background>
    <v-container fluid class="fill-height">
      <v-row no-gutters align="center" justify="center" class="fill-height">
        <v-col cols="12" md="6" lg="5" sm="6">
          <v-row no-gutters align="center" justify="center">
            <v-col cols="12" md="6">
              <h1>Sign Up</h1>
              <p class="text-medium-emphasis">Enter your details to get registered</p>

              <v-form @submit.prevent="submit" class="mt-7">
                <div>
                  <label class="label text-grey-darken-2" for="name">Name</label>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    color="blue"
                    :rules="[ruleRequired]"
                    v-model="name"
                    prepend-inner-icon="mdi-account"
                    id="name"
                    name="name"
                  />
                </div>
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
                <div class="mt-1">
                  <label class="label text-grey-darken-2" for="password">Password</label>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="20"
                    color="blue"
                    :rules="[ruleRequired, rulePassLen]"
                    v-model="password"
                    prepend-inner-icon="mdi-form-textbox-password"
                    id="password"
                    name="password"
                    type="password"
                  />
                </div>
                <div class="mt-5">
                  <v-btn type="submit" block min-height="44" class="gradient-red"
                    >Create Account</v-btn
                  >
                </div>
              </v-form>

              <p class="text-body-2 mt-4">
                <span
                  >Do you have an account?
                  <NuxtLink to="/signin" class="font-weight-bold text-primary"
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
              <div class="text-center w-50 text-white mx-auto">
                <h2 class="mb-4"></h2>
                test
              </div>
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
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";
// Assuming these are custom validation rules you have created
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();

// Reactive variables for form data and error message
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

// Firebase Auth instance
const auth = getAuth();

// Router instance
const router = useRouter();

// Submit function to handle signup
const submit = async () => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Update user's display name
    await updateProfile(user, { displayName: name.value });

    // Navigate to dashboard on successful signup
    alert("Your account successfully created");
    router.push("/signin");
  } catch (err) {
    // Set the error message if an error occurs
    error.value = err.message;
    console.error(error.value);
  }
};
</script>

<style scoped>
.gradient-red {
  background: linear-gradient(46deg, #f96103, #858282);
}
</style>
