<template>
  <v-row>
    <v-col>
      <v-hover v-slot:default="{ isHovering, props }">
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
            <!-- <v-combobox
              class="text-caption pt-2 pl-8 pr-8"
              :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                isHovering ? colorScheme[0] : colorScheme[1]
              }`"
              v-model="subdiety_pooja"
              :items="deities_list"
              item-text="title"
              item-value="value"
              variant="outlined"
              density="compact"
            ></v-combobox> -->

            <!-- <v-select
              v-model="subdiety_pooja"
              :items="deities_list"
              label="Deity"
              persistent-hint
              return-object
              single-line
            ></v-select> -->

            <v-radio-group
              v-model="subdiety_pooja"
              inline
              class="text-caption d-flex justify-center align-center rounded-lg"
              :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                isHovering ? colorScheme[0] : colorScheme[1]
              }`"
            >
              <v-radio
                v-for="option in deities_list"
                :key="option.value"
                :label="option.value"
                :value="option.value"
              ></v-radio>
            </v-radio-group>
            <v-data-table
              :headers="headers"
              :items="offers[subdiety_pooja]"
              density="compact"
              class="pl-8 mt-1 rounded-lg"
              :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}; color: ${
                isHovering ? colorScheme[0] : colorScheme[1]
              }`"
            >
              <template v-slot:item.name="{ item }">
                <span class="text-body-2 font-weight-bold pl--6">{{ item.name }}</span>
                <temple-offer-info
                  v-if="item.additionalInfo"
                  :message="item.additionalInfo"
                ></temple-offer-info>
              </template>
              <template v-slot:item.cost="{ item }">
                <span class="text-body-2 font-weight-bold pl--16">{{ item.cost }}</span>
              </template>
            </v-data-table>
          </section>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, computed } from "vue";
import { useOffers_ml, useOffers_en, useDeities } from "@/composables/stores.js";
import { dbStore } from "~/composables/dbStore";
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

import { useI18n } from "#imports";
const { $i18n } = useNuxtApp();
const { t, locale } = useI18n(); // Destructure t and locale
let deities_list = ref([]);

const deities = useDeities();

deities_list = computed(() => deities.value[`data_${$i18n.locale.value}`]);

const offers = $i18n.locale.value === "en" ? useOffers_en() : useOffers_ml();
// const offers =  useOffers_en()
const subdiety_pooja = ref(deities_list.value[0]);

onMounted(() => {
  if (deities_list.value.length > 0) {
    subdiety_pooja.value = deities_list.value[0].value;
  }
});

const offers_display = ref(false);
const headers = [
  { title: "Offering", key: "name", align: "start" },
  { title: "Amt (INR)", key: "cost", align: "center" },
  // { title: 'Additional Info', key: 'additionalInfo', align: 'start' },
];
const handleMouse = () => {
  console.log("Mouse Triggerd");
};
</script>
<style scoped>
.mt-2-negative {
  margin-top: -1.5rem;
  /* Negative equivalent of mt-2 */
}

.compact-table .v-data-table__wrapper td,
.compact-table .v-data-table__wrapper th {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  padding-left: 8px !important;
  padding-right: 8px !important;
}

/* Adjust row height */
.compact-table .v-data-table__wrapper tr {
  height: auto !important;
}

/* Optional: Adjust font size to make the table even more compact */
.compact-table .v-data-table__wrapper td {
  font-size: 14px !important;
}

.compact-table .v-data-table-header th {
  padding: 4px 8px !important;
}

.negative-spacing {
  padding-left: -10px;
  /* Apply negative padding */
}
.red-background {
  background-color: #f2dfa7;
  /* color:  white; Adjust text color if needed */
}
</style>
