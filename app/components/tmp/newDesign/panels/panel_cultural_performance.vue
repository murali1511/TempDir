<template>
  <!-- Loop categories (currently using performance[0]) -->
  <v-container fluid class="pa-0">
    <div class="mb-4 ma-2">
      <v-card>
        <v-card-title class="d-flex align-center bg-orange">
          <div class="text-h5 font-weight-bold text-subtitle-2">
            <v-icon class="mr-2">mdi-dance</v-icon>
            Cultural Performance
          </div>

          <v-spacer />

          <!-- Category-level toggle: expands/collapses all panels in this category -->
          <v-btn density="compact" color="black" icon @click="toggleAll">
            <v-icon>
              {{ isAllOpen ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>

      <!-- Expansion panels for this category -->
      <!-- v-model binds to openPanels (array of open indexes) -->
      <v-expansion-panels v-model="openPanels" multiple class="rounded-xl mt-2">
        <v-expansion-panel
          v-for="(s, i) in performance[0].cultural_performances || []"
          :key="i"
          color="#f2dfa7"
        >
          <v-expansion-panel-title class="d-flex align-center">
            <div class="d-flex align-center" style="flex: 1">
              <v-icon class="mr-2">{{ s.icon }}</v-icon>
              <span>{{ s.name }}</span>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text class="text-body-2">
            <div class="mb-2">{{ s.description }}</div>

            <div class="font-weight-bold">
              <div class="mb-2">
                <v-icon class="mb-2" small>mdi-circle-medium</v-icon>
                <span>{{ s.occasion }}</span>
              </div>

              <div class="mb-2">
                <v-icon small>mdi-circle-medium</v-icon>
                <span>{{ s.details.accompaniment }}</span>
              </div>

              <div class="mb-2">
                <v-icon small>mdi-circle-medium</v-icon>

                <span>{{ s.details.duration }}</span>
              </div>

              <div class="mb-2">
                <v-icon small>mdi-circle-medium</v-icon>
                <span>{{ s.details.cultural_significance }}</span>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { performance } from "@/stores/cultural_performance.js";

// v-expansion-panels with `multiple` expects an array of open indices
const openPanels = ref([]);

// helper: check if a given panel index is open
function isPanelOpen(i) {
  return openPanels.value.includes(i);
}

// toggle a single panel open/close
function togglePanel(i) {
  const idx = openPanels.value.indexOf(i);
  if (idx === -1) {
    openPanels.value.push(i);
  } else {
    openPanels.value.splice(idx, 1);
  }
}

// computed: true if all panels in this category are open
const isAllOpen = computed(() => {
  const options = performance[0]?.cultural_performances || [];
  return options.length > 0 && openPanels.value.length === options.length;
});

// toggle all panels for the category
function toggleAll() {
  const options = performance[0]?.cultural_performances || [];
  if (isAllOpen.value) {
    openPanels.value = [];
  } else {
    openPanels.value = options.map((_, i) => i);
  }
}
</script>

<style scoped>
.bg-orange {
  background: #f2b84b; /* replace with your theme color or class */
}
</style>
