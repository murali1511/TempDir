<template>
  <v-app>
    <v-app-bar class="gradiant" density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <template v-slot:append>
        <v-btn
          size="small"
          v-if="$i18n.locale.value == 'en'"
          @click="switchLanguage('ml')"
          variant="outlined"
          prepend-icon="mdi-account-circle"
          class="mr-1"
          ><span class="text-caption">മലയാളം</span></v-btn
        >
        <v-btn
          size="small"
          v-if="$i18n.locale.value == 'ml'"
          @click="switchLanguage('en')"
          variant="outlined"
          prepend-icon="mdi-account-circle"
          class="mr-1"
          ><span class="text-caption">ENGLISH</span></v-btn
        >

        <v-btn class="" icon v-if="auth.currentUser">
          <v-avatar image="/logo-9-tr.png" size="x-small" />

          <v-menu activator="parent" origin="top">
            <v-list class="pa-0" density="compact">
              <v-list-subheader>{{ auth.currentUser.displayName }}</v-list-subheader>
              <v-list-item link title="Update profile" prepend-icon="mdi-account-edit" />

              <v-list-item
                link
                title="Sign out"
                @click="logout"
                prepend-icon="mdi-logout"
              />
              <v-list-item link><role_change></role_change> </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <v-app-bar-title
        class="ont-weight-bold"
        @click="home"
        :class="$vuetify.display.smAndUp ? 'text-body-1' : 'text-caption'"
      >
        HPRC Project
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid class="bg-surface-variant">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { dbStore } from "@/composables/dbStore";
const { role, set_role } = dbStore();
import { useLocalStore } from "@/stores/localStore.js";

const localStore = useLocalStore();

// const sharedData = useState("sh/aredData");
// // const TempleName =  $i18n.locale.value == "en"?sharedData.en:sharedData.ml

// console.log("sharedData", sharedData || "test");
const auth = ref(useFirebaseAuth());
const drawer = ref(false);
const { $i18n } = useNuxtApp();

const switchLanguage = (locale) => {
  $i18n.setLocale(locale);
  localStore.setLocale(locale);
};

const logout = async () => {
  try {
    await signOut(auth.value);
    console.log("User signed out successfully");
    // Redirect to the login page after logout
    await navigateTo("/signin", { replace: true });
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>
<style scoped>
.gradiant {
  background: linear-gradient(90deg, #f2dfa7, #a64833, #f2dfa7) !important;
}
</style>
