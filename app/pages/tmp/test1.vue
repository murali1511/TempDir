<template>
  <v-container class="pa-4">
    <v-card elevation="3" class="pa-4">
      <v-card-title>Check “{{ collection_name }}” Collection (via VueFire)</v-card-title>

      <v-card-text>
        <div class="mb-2">
          <strong>Status:</strong>
          <v-chip :color="statusColor">{{ statusMessage }}</v-chip>
        </div>

        <v-row class="mt-3" dense>
          <v-col cols="12" md="4">
            <v-btn color="primary" @click="checkEvents()" :loading="loading" block>
              Check Collection
            </v-btn>
          </v-col>
        </v-row>

        <v-alert v-if="error" type="error" class="mt-4" dense>
          {{ error }}
        </v-alert>

        <v-divider class="my-4" />

        <div v-if="docs.length">
          <strong>First {{ docs.length }} document(s):</strong>
          <pre style="max-height: 300px; overflow: auto">{{ docsJson }}</pre>
        </div>

        <div v-else-if="!loading && statusChecked">
          <div>No documents found in <code>events</code> collection.</div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { checkCollectionExists } from "@/composables/upload/useDBWrite.js"; // adjust path if needed

const loading = ref(false);
const docs = ref([]);
const error = ref(null);
const statusChecked = ref(false);
const statusMessage = ref("Not checked yet");
const collection_name = ref("events_en");

// computed color for chip
const statusColor = computed(() => {
  if (loading.value) return "info";
  if (error.value) return "error";
  if (docs.value.length > 0) return "success";
  if (statusChecked.value) return "warning";
  return "grey";
});

// prettified JSON for display
const docsJson = computed(() => {
  try {
    return JSON.stringify(docs.value, null, 2);
  } catch (e) {
    return "(error serializing docs)";
  }
});

/**
 * Check events collection (limitCount optional)
 */
async function checkEvents(limitCount = 3) {
  loading.value = true;
  error.value = null;
  docs.value = [];
  statusChecked.value = false;
  statusMessage.value = "Checking...";

  try {
    const res = await checkCollectionExists(collection_name.value, { limit: limitCount });
    if (res.error) {
      error.value = res.error;
      statusMessage.value = "Error checking collection";
    } else {
      if (res.exists) {
        docs.value = res.docs || [];
        statusMessage.value = `Collection ${collection_name.value} found with ${res.count} document(s).`;
      } else {
        docs.value = [];
        statusMessage.value = `Collection ${collection_name.value} does NOT exist`;
      }
    }
  } catch (e) {
    error.value = e?.message || String(e);
    statusMessage.value = "Unexpected error";
  } finally {
    loading.value = false;
    statusChecked.value = true;
  }
}

// run once on mount (optional)
onMounted(() => {
  // checkEvents(3);
});
</script>

<style scoped>
pre {
  background: #fafafa;
  padding: 8px;
  border-radius: 6px;
  white-space: pre-wrap;
}
</style>
