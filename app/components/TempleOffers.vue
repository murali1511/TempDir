<template>
  <v-row>
    <v-col>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            class="mx-auto rounded-lg g_border"
            max-width="600"
            :color="isHovering ? colorScheme[0] : colorScheme[1]"
            v-bind="props"
          >
            <v-card-title
              class="d-flex justify-space-between align-center text-subtitle-1"
              :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
              @click="displaytoggle"
            >
              {{ $t("temple_offer") }}

              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click=""
                size="small"
                class="mt-1 ml-6"
                :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
              >
                <v-icon>
                  {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-card-title>
            <section
              v-if="Detailed_display"
              class="pl-2 pr-2 pb-2"
              :style="`background:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
            >
              <div>
                <!-- Combobox for selecting deity -->
                <!-- <v-combobox
                  class="text-caption pt-2 pl-8 pr-8"
                  :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                    isHovering ? colorScheme[0] : colorScheme[1]
                  }`"
                  v-model="selected_deity"
                  :items="deities_list"
                  label="Select Deity"
                  variant="outlined"
                  density="compact"
                ></v-combobox> -->

                <!-- Radio group for selecting deity -->
                <v-radio-group
                  v-model="selected_deity"
                  inline
                  class="text-caption d-flex justify-center align-center rounded-lg mb-2"
                  :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                    isHovering ? colorScheme[0] : colorScheme[1]
                  }`"
                >
                  <v-radio
                    v-for="option in deities_list"
                    :key="option"
                    :label="option"
                    :value="option"
                  ></v-radio>
                </v-radio-group>

                <!-- Data table to display offers for the selected deity -->
                <v-data-table
                  v-if="filtered_offers.length > 0"
                  :headers="headers"
                  :items="filtered_offers"
                  :items-per-page="8"
                  class="elevation-1 pl-8 rounded-lg"
                  density="compact"
                  :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                    isHovering ? colorScheme[0] : colorScheme[1]
                  }`"
                >
                  <template v-slot:item.name="{ item }">
                    <span class="text-body-2 font-weight-bold pl--6">{{
                      item.name
                    }}</span>
                    <temple-offer-info
                      v-if="item.additionalInfo"
                      :message="item.additionalInfo"
                    ></temple-offer-info>
                  </template>
                  <template v-slot:item.cost="{ item }">
                    <span class="text-body-2 font-weight-bold pl--16">{{
                      item.cost
                    }}</span>
                  </template>
                </v-data-table>

                <!-- Message if no offers are found -->
                <p v-else>No offers available for the selected deity.</p>
              </div>
            </section>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { dbStore } from "~/composables/dbStore";
import { useLocalStore } from "/stores/localStore.js";

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const localStore = useLocalStore();
const deities_list = ref([]); // List of deities
const selected_deity = ref(""); // Selected deity from the combobox
const subdiety_pooja = ref(""); // Selected deity from the radio group
const isHovering = ref(false); // Example hover state
const { $i18n } = useNuxtApp();

// Table headers for v-data-table
const headers = [
  { title: "Offering", key: "name", align: "start" },
  { title: "Amt (INR)", key: "cost", align: "center" },
];

// Fetch offers on component mount
onMounted(async () => {
  try {
    await localStore.Fetch_Offers($i18n.locale.value);
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
});

// Watch for changes in temple_offers and update deities_list
watch(
  () => localStore.temple_offers,
  (newOffers) => {
    if (newOffers && newOffers.length > 0 && newOffers !== "Not Found") {
      deities_list.value = newOffers.map((entry) => entry.deity);

      // Set the first entry of deities_list as the default value for the combobox and radio group
      if (deities_list.value.length > 0) {
        selected_deity.value = deities_list.value[0];
        // subdiety_pooja.value = deities_list.value[0];
      }
    } else {
      deities_list.value = []; // Fallback if offers are empty
    }
  },
  { immediate: true }
);

// Compute filtered offers based on the selected deity
const filtered_offers = computed(() => {
  if (!selected_deity.value || !localStore.temple_offers) return [];

  // Find the selected deity's offers
  const selectedDeityEntry = localStore.temple_offers.find(
    (entry) => entry.deity === selected_deity.value
  );

  return selectedDeityEntry ? selectedDeityEntry.offers : [];
});
</script>

<style scoped>
/* Your existing styles */
</style>
