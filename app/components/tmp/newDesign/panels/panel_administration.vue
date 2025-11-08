<template>
  <v-container fluid class="pa-0">
    <div class="ma-2">
      <!-- Header Card -->
      <v-card>
        <v-card-title class="d-flex align-center bg-orange">
          <div class="text-h5 font-weight-bold text-subtitle-1">
            <v-icon class="mr-2">mdi-temple-hindu</v-icon>
            {{ $t("governance_h1") }}
          </div>
        </v-card-title>
      </v-card>
      <v-card class="mx-auto rounded-lg g_border mt-3">
        <v-card-title class="text-subtitle-1 text-md-h6 text-lg-h5">
          {{ temple_admin.administration.classification }}
        </v-card-title>
        <v-card-text> {{ temple_admin.administration.description }}</v-card-text>
      </v-card>
      <!-- Administration Card -->
      <v-card class="mx-auto rounded-lg g_border mt-3">
        <v-card-title class="text-subtitle-2 text-md-subtitle-1 text-lg-h6">
          <v-icon class="text-subtitle-2 text-md-subtitle-1 text-lg-h6"
            >mdi-domain</v-icon
          >
          Administration
        </v-card-title>

        <!-- Management details -->
        <v-list dense class="management-list">
          <v-list-item>
            <v-list-item-content>
              <v-icon class="text-subtitle-1 d-inline mr-1">mdi-crown</v-icon>
              <v-list-item-title class="text-subtitle-2 font-weight-bold d-inline">{{
                $t("Authority")
              }}</v-list-item-title>
              <v-list-item-subtitle class="two-lines mb-2 mt-1">
                {{ temple_admin.administration.authority }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset />

          <v-list-item>
            <v-list-item-content>
              <v-icon class="text-subtitle-1 d-inline mr-1"
                >mdi-account-supervisor</v-icon
              >
              <v-list-item-title class="text-subtitle-2 font-weight-bold d-inline">
                {{ $t("Leadership") }}</v-list-item-title
              >
              <v-list-item-subtitle>
                <!-- render leadership object keys neatly -->
                <div
                  v-for="(value, key, i) in temple_admin.administration.leadership"
                  :key="key"
                  class="mb-2 mt-1"
                >
                  <strong class="capitalize">{{ formatLeadershipKey(key) }}:</strong>
                  <span v-if="isObject(value)">{{
                    value.role ?? JSON.stringify(value)
                  }}</span>
                  <span v-else>{{ value }}</span>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset />

          <v-list-item>
            <v-list-item-content>
              <v-icon class="text-subtitle-1 d-inline mr-1">mdi-chat</v-icon>
              <v-list-item-title class="text-subtitle-2 font-weight-bold d-inline">{{
                $t("Contact_person")
              }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ temple_admin.administration.contact_person.name }} —
                {{ temple_admin.administration.contact_person.role }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset />

          <v-list-item>
            <v-list-item-content>
              <v-icon class="text-subtitle-1 d-inline mr-1">mdi-account-badge</v-icon>
              <v-list-item-title class="text-subtitle-2 font-weight-bold d-inline">{{
                $t("Communication")
              }}</v-list-item-title>
              <!-- <v-list-item-subtitle class="two-lines"> -->
              <div class="d-flex align-center mb-2 mt-1">
                <v-icon size="14" class="mr-2">mdi-email</v-icon>
                <span>{{ temple_admin.administration.communication.email }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="14" class="mr-2">mdi-phone</v-icon>
                <span>{{ temple_admin.administration.communication.phone }}</span>
              </div>
              <div class="d-flex align-center mb-2 mt-1">
                <v-icon size="14" class="mr-2">mdi-whatsapp</v-icon>
                <span>{{ temple_admin.administration.communication.phone }}</span>
              </div>

              <div>
                <small class="text--secondary mb-2">{{
                  temple_admin.administration.communication.purpose
                }}</small>
              </div>
              <!-- </v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering = false) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const chipStyle = computed(() => ({
  background: colorScheme.value ? colorScheme.value[1] : "#ffffff",
  color: colorScheme.value ? colorScheme.value[0] : "#000000",
}));

// Sample data (kept from your original payload)
const Temple_Admin = [
  {
    name: "Lokanarkavu Temple",
    TID: "T0001",
    administration: {
      type: "Devaswom Board-Managed",
      classification: "Malabar Devaswom Board",
      description:
        "Administered by the Malabar Devaswom Board under the Travancore-Cochin Hindu Religious Institutions Act, 1950. Zamorin of Calicut serves as managing trustee, blending royal tradition with modern governance.",
      authority: "Malabar Devaswom Board",
      leadership: {
        managing_trustee: "Zamorin of Calicut",
        role: "Oversight of traditions and festivals.",
      },
      contact_person: {
        name: "Ms. Leela Menon",
        role: "Handles inquiries, events, and donations.",
      },
      communication: {
        email: "admin@lokanarkavutemple.com",
        phone: "+91-9876543210",
        purpose: "Inquiries, bookings, and support.",
      },
    },
    health_and_safety: {
      overview:
        "Hygiene protocols, emergency preparedness, and accessible facilities per Kerala standards.",
    },
  },
  {
    name: "Palayad Theru Sri Ganapathi Temple",
    TID: "T0002",
    administration: {
      type: "Independent Trust",
      classification: "Local Committee / Independent Trust",
      description:
        "Managed by an independent trust, the Temple Committee, focused on community-led governance, preservation, and operations. Distinct from Devaswom Boards or family trusts.",
      authority: "Temple Committee",
      leadership: {
        secretary: "Mr. Rakesh",
        role: "Oversight of governance, rituals, festivals, and resources.",
      },
      contact_person: {
        name: "Mr. Damodhran",
        role: "Handles inquiries, events, and donations.",
      },
      communication: {
        email: "admin@palayadtheru.com",
        phone: "+91-9876543210",
        purpose: "Inquiries, bookings, and support.",
      },
    },
    health_and_safety: {
      overview:
        "Hygiene protocols, emergency preparedness, and accessible facilities per Kerala standards.",
    },
  },
];

// const temple_admin = Temple_Admin[0];
const temple_admin = Temple_Admin.find((t) => t.TID === localStore.templeID);
onMounted(() => {
  // If you want to prepare data or call nearest temples, do it here:
  // sortedAttractions.value = get_NearestTemples(...);
});

// Helpers
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
const formatLeadershipKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Open Google Maps centered on lat/lng; name is optional
const openGoogleMaps = (lat, lng, name = "") => {
  const encodedName = encodeURIComponent(name || "Temple");
  const url = `https://www.google.com/maps/search/${encodedName}+@${lat},${lng}`;
  window.open(url, "_blank");
};
</script>

<style scoped>
.temple-theme {
  background-color: #fffaf0;
}

/* Header background: subtle decorative stripe */
.temple-header {
  background: linear-gradient(90deg, rgba(255, 235, 205, 0.6), rgba(255, 244, 229, 0.6));
  align-items: center;
}

/* two-lines clamp for addresses/descriptions */
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

/* management list tweaks */
.management-list .v-list-item {
  align-items: flex-start;
}

/* small map button alignment */
.map-btn {
  display: flex;
  align-items: center;
}

/* divider inset appearance */
.v-divider[inset] {
  margin-left: 16px;
}

/* minor caps */
.capitalize {
  text-transform: capitalize;
}
</style>
