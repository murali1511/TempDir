<template>
  <v-app>
    <v-app-bar class="gradiant" density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <template v-slot:append>
        <v-btn class="text-capitalize mr-2" prepend-icon="mdi-map-marker">
          <template v-slot:prepend>
            <v-icon color="success" class="mr-n2"></v-icon>
          </template>
          {{ mapStore.CurrentlocationDetail?.address?.village }}
        </v-btn>

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

              <v-list-item title="Sign out" @click="logout" prepend-icon="mdi-logout" />
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
        HPRC
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          @click="SuperHome()"
          prepend-icon="mdi-home"
          title="HPRC Home"
        ></v-list-item>
        <v-list-item
          @click="Temples()"
          prepend-icon="mdi-calendar"
          title="Temples"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="bg-surface-variant">
        <slot />
      </v-container>
    </v-main>

    <v-footer app color="#282828" class="text-center d-flex flex-column py-0">
      <div>
        <v-btn variant="text" class="mr-1" icon="mdi-facebook" size="small"></v-btn>
        <v-btn variant="text" class="mr-1" icon="mdi-twitter" size="small"></v-btn>
        <v-btn variant="text" class="mr-1" icon="mdi-instagram" size="small"></v-btn>
      </div>
      <div class="text-caption">
        © {{ new Date().getFullYear() }} HPRC Project. All rights reserved.
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { dbStore } from "~/composables/dbStore";
const { role, set_role } = dbStore();
import { useLocalStore } from "/stores/localStore.js";
import { useMapStore } from "/stores/mapStore.js";

const localStore = useLocalStore();
const mapStore = useMapStore();

const updateLocation = async () => {
  try {
    const locDetail = await mapStore.set_Currentlocation();
    console.log("Location fetched:", locDetail);
    console.log("Updated Coordinates:", mapStore.Currentlocation);
  } catch (err) {
    console.error(err);
  }
};

// localStore.setTempleID("T0001");

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

const SuperHome = async () => {
  // await localStore.setTempleID(localStore.templeID);
  await navigateTo("/");
};
const Temples = async () => {
  // await localStore.setTempleID(localStore.templeID);
  await navigateTo("/tmp/card_temples");
};

// const TempleName = () => {
//   $i18n.locale.value == "en"
//     ? sharedData
//       ? sharedData.value.en
//       : ""
//     : sharedData
//     ? sharedData.value.ml
//     : "";
// };
// Function to log out the user
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
const home = () => {
  navigateTo("/", { redirectCode: 301 });
};

onMounted(() => {
  updateLocation();
});
</script>
<style scoped>
.v-btn::before {
  background-color: green;
}
.v-btn i:hover {
  transform: scale(1.55);
}
.v-footer-padding {
  padding: 2px;
}
.v-list-item__prepend > .v-icon ~ .v-list-item__spacer {
  width: 4px !important; /* Adjust this value to reduce the space */
}
.bg-color {
  background-color: "red";
}
.gold-background {
  background-color: #f2dfa7;
  color: black;
  /* color:  white; Adjust text color if needed */
}
.custom-pointer {
  cursor: grab;
}
.smallFont {
  font-size: 10px;
}
.gradiant {
  background: linear-gradient(90deg, #f2dfa7, #a64833, #f2dfa7);
}
</style>
