<template>
  <v-breadcrumbs
    class="mt-n5 mb-10 card_radiant rounded-lg text-caption text-sm-body-2 text-md-body-1 text-lg-subheading-2 text-xl-subheading-1 text-start text-no-wrap"
    :class="$vuetify.display.smAndUp ? 'ml-9 mr-9' : ''"
    :items="breadcrumbs"
  >
    <!-- <template v-slot:item="{ item }">
      <router-link v-if="item.to" :to="item.to" class="text-decoration-none text-grey">
        {{ item.title }}
      </router-link>
      <span v-else class="text-grey-darken-1">
        {{ item.title }}
      </span>
    </template> -->
  </v-breadcrumbs>
</template>

<script setup>
import { computed } from "vue";
import { dbStore } from "~/composables/dbStore";
import { useLocalStore } from "/stores/localStore.js";
import { useNuxtApp } from "#app";

// Ensure these reactive references exist in your parent/component context
const props = defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const { $i18n } = useNuxtApp();
const localStore = useLocalStore();

const { colorScheme } = dbStore();

console.log("breadcrumbs", props.breadcrumbs);
</script>

<style scoped>
.card_radiant {
  background: linear-gradient(
    to right,
    #735943,
    v-bind(colorScheme[1]),
    v-bind(colorScheme[0]),
    v-bind(colorScheme[1]),
    #735943
  );
}

.compact-breadcrumbs {
  padding: 4px 8px !important;
  font-size: 0.9rem !important;
  min-height: auto !important;
}
</style>
