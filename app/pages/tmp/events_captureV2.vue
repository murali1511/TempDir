<template>
  <v-card elevation="3" class="pa-2 rounded-xl" color="yellow">
    <v-card-title
      class="d-flex text-xs-subtitle-2 text-md-h5 font-weight-bold mb-4 justify-center"
    >
      Temple Event Data Capture
    </v-card-title>

    <!-- Temple Info -->
    <v-row>
      <v-col cols="12" md="6">
        <!-- Autocomplete with type-ahead / debounced filtering -->
        <v-autocomplete
          v-model="selectedFeatureId"
          :items="filteredOptions"
          item-title="label"
          item-value="value"
          prepend-inner-icon="mdi-magnify"
          :search-input.sync="search"
          :loading="loading"
          :label="templeSelectLabel"
          clearable
          rounded
          variant="solo"
          density="compact"
          class="text-caption"
          hide-selected
          :menu-props="{ maxHeight: '360' }"
          @update:model-value="onTempleSelect"
        >
          <template #item="{ item, props: itemProps }">
            <v-list-item v-bind="itemProps" class="text-body-1">
              <v-list-item-content>
                <v-list-item-title
                  v-html="highlightMatch(item.label, search)"
                ></v-list-item-title>
                <v-list-item-subtitle v-if="item.props?.district">
                  {{ item.props.district }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template #append-item>
            <div
              v-if="!loading && search && filteredOptions.length === 0"
              class="px-4 py-2 text-caption"
            >
              No temples found
            </div>
            <div
              v-if="!loading && search && filteredOptions.length >= resultLimit"
              class="px-4 py-2 text-caption"
            >
              Showing first {{ resultLimit }} results — refine your search.
            </div>
          </template>
        </v-autocomplete>
      </v-col>

      <!-- <v-col cols="12" md="6">
        <v-text-field v-model="temple.TID" label="Temple ID" outlined density="compact" />
      </v-col> -->
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Event Section -->
    <div v-if="temple.TID">
      <div class="d-flex justify-space-between align-center mb-3">
        <h6 class="text-h6 text-indigo-darken-4 font-weight-bold">
          <v-icon
            icon="mdi-temple-hindu-outline"
            class="mr-1"
            color="blue-darken-5"
            size="small"
          ></v-icon>
          Temple Events
        </h6>
        <v-btn color="primary" @click="addEvent" prepend-icon="mdi-plus">
          Add Event
        </v-btn>
      </div>

      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(event, index) in temple.events" :key="index">
          <v-expansion-panel-title>
            {{ event.eventTitle || `Event ${index + 1}` }}
            <span v-if="durationLabel(event)" class="mx-3 text-caption">
              — {{ durationLabel(event) }}
            </span>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="event.eventID"
                  label="Event ID"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="event.eventTitle"
                  label="Event Title"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="event.eventDescription"
                  label="Description"
                  rows="2"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <!-- Start + End datetime-local inputs -->
              <v-col cols="12" md="6" class="d-flex gap-3">
                <v-text-field
                  v-model="event.date.startDate"
                  label="Start (date & time)"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  :error="isEndBeforeStart(event)"
                  :error-messages="isEndBeforeStart(event) ? ['End is before start'] : []"
                  class="no-gap"
                />
                <v-text-field
                  v-model="event.date.endDate"
                  label="End (date & time)"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  :error="isEndBeforeStart(event)"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="event.eventCategory"
                  :items="[
                    'Auspicious Day',
                    'Cultural Event',
                    'Religious Event',
                    'Annual Festival',
                  ]"
                  label="Event Category"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="event.poojaTiming"
                  label="Pooja Timing (optional display string)"
                  variant="outlined"
                  density="compact"
                  hint="eg. 5:00 AM - 9:00 PM (human friendly)"
                />
              </v-col>

              <!-- Highlights -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Highlights</strong>
                    <div>
                      <v-btn
                        size="small"
                        variant="text"
                        @click="event.highlights.push('')"
                        class="me-2"
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearHighlights(event)"
                      >
                        Clear
                      </v-btn>
                    </div>
                  </div>

                  <div
                    v-for="(h, hIndex) in event.highlights"
                    :key="hIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="event.highlights[hIndex]"
                      label="Highlight"
                      variant="outlined"
                      density="compact"
                      class="flex-grow-1"
                      hide-details
                    />
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="removeHighlight(event, hIndex)"
                      :title="'Remove highlight ' + (hIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!event.highlights || event.highlights.length === 0"
                    class="text-caption"
                  >
                    No highlights yet.
                  </div>
                </v-card>
              </v-col>

              <!-- Participation -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Participation</strong>
                    <div>
                      <v-btn
                        size="small"
                        variant="text"
                        @click="event.participation.push('')"
                        class="me-2"
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearParticipation(event)"
                      >
                        Clear
                      </v-btn>
                    </div>
                  </div>

                  <div
                    v-for="(p, pIndex) in event.participation"
                    :key="pIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="event.participation[pIndex]"
                      label="Participation Info"
                      variant="outlined"
                      density="compact"
                      class="flex-grow-1"
                      hide-details
                    />
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="removeParticipation(event, pIndex)"
                      :title="'Remove participation ' + (pIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!event.participation || event.participation.length === 0"
                    class="text-caption"
                  >
                    No participation info yet.
                  </div>
                </v-card>
              </v-col>

              <!-- Special Notes -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Special Notes</strong>
                    <div>
                      <v-btn
                        size="small"
                        variant="text"
                        @click="event.specialNote.push('')"
                        class="me-2"
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearSpecialNotes(event)"
                      >
                        Clear
                      </v-btn>
                    </div>
                  </div>

                  <div
                    v-for="(n, nIndex) in event.specialNote"
                    :key="nIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="event.specialNote[nIndex]"
                      label="Note"
                      variant="outlined"
                      density="compact"
                      class="flex-grow-1"
                      hide-details
                    />
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="removeSpecialNote(event, nIndex)"
                      :title="'Remove note ' + (nIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!event.specialNote || event.specialNote.length === 0"
                    class="text-caption"
                  >
                    No special notes yet.
                  </div>
                </v-card>
              </v-col>

              <!-- contact (optional quick edit) -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Contact</strong>
                    <v-btn size="small" variant="text" @click="ensureContact(event)">
                      Ensure
                    </v-btn>
                  </div>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="event.contact.email"
                        label="Email"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="event.contact.phone"
                        label="Phone"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="event.contact.whatsapp"
                        label="WhatsApp"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="event.contact.website"
                        label="Website"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Remove Event -->
              <v-col cols="12" class="text-end">
                <v-btn
                  color="error"
                  variant="outlined"
                  size="small"
                  @click="removeEvent(index)"
                >
                  Remove Event
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else class="text-subtitle-1 text-red font-weight-bold">
      <v-icon icon="mdi-calendar-alert" class="mr-2 ml-3" color="red"></v-icon>
      No Temple Records
    </div>

    <v-divider class="my-6"></v-divider>

    <v-card-actions class="justify-end">
      <v-btn color="success" @click="saveTemple">Save Temple Data</v-btn>
    </v-card-actions>
  </v-card>

  <!-- JSON Output Preview -->
  <v-card class="mt-8 pa-4" variant="tonal">
    <v-card-title class="text-subtitle-1 font-weight-bold"> JSON Preview </v-card-title>
    <v-card-text>
      <pre class="text-body-2">{{ JSON.stringify(temple, null, 2) }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
// Adjust this import path to where your file actually is.
import stores from "@/stores/stores_geojson.js";

/* -------------------------
   Reactive data and helpers
   ------------------------- */
const temple = ref({
  TID: "",
  name: "",
  events: [],
});

const defaultEvent = () => ({
  eventID: "",
  eventTitle: "",
  eventDescription: "",
  eventCategory: "",
  date: { startDate: "", endDate: "" },
  poojaTiming: "",
  highlights: [],
  participation: [],
  specialNote: [],
  contact: { email: "", phone: "", website: "", whatsapp: "" },
});

const addEvent = () => temple.value.events.push(defaultEvent());
addEvent();

const removeEvent = (index) => temple.value.events.splice(index, 1);

const ensureContact = (event) => {
  if (!event.contact) event.contact = { email: "", phone: "", website: "", whatsapp: "" };
};
const removeHighlight = (event, idx) => event?.highlights?.splice(idx, 1);
const clearHighlights = (event) => (event.highlights = []);
const removeParticipation = (event, idx) => event?.participation?.splice(idx, 1);
const clearParticipation = (event) => (event.participation = []);
const removeSpecialNote = (event, idx) => event?.specialNote?.splice(idx, 1);
const clearSpecialNotes = (event) => (event.specialNote = []);

/* Duration & validation */
const durationLabel = (event) => {
  try {
    const s = event?.date?.startDate;
    const e = event?.date?.endDate;
    if (!s || !e) return "";
    const sd = new Date(s);
    const ed = new Date(e);
    if (isNaN(sd) || isNaN(ed)) return "";
    const diffMs = ed - sd;
    if (diffMs <= 0) return "";
    const mins = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${remMins}m`;
  } catch {
    return "";
  }
};
const isEndBeforeStart = (event) => {
  const s = event?.date?.startDate;
  const e = event?.date?.endDate;
  if (!s || !e) return false;
  const sd = new Date(s);
  const ed = new Date(e);
  if (isNaN(sd) || isNaN(ed)) return false;
  return ed < sd;
};

/* Save */
const saveTemple = () => {
  if (!temple.value.TID || !temple.value.name) {
    alert("Temple ID and Name required.");
    return;
  }
  const bad = temple.value.events.find(isEndBeforeStart);
  if (bad) {
    alert("One or more events have End before Start. Fix timestamps first.");
    return;
  }
  console.log("Temple Data Saved:", JSON.stringify(temple.value, null, 2));
  alert("Temple data captured! Check console log for JSON output.");
};

/* -------------------------
   Template: temple list integration + type-ahead
   ------------------------- */
const features = (stores && stores.features) || [];

/* Build full options list from features */
const templeOptions = computed(() =>
  features.map((f, idx) => {
    const props = f.properties || {};
    const label = props.name || `Temple ${idx + 1}`;
    // value: prefer TID, else fallback to a stable index token
    // const value = props.TID ? `${props.TID}` : `__idx_${idx}`;
    const value = idx;
    // include original props and index for lookup
    return { label, value, props, featureIndex: idx };
  })
);

const resultLimit = 200; // tune this (how many items dropdown will show max)
const search = ref("");
const loading = ref(false);
const filteredOptions = ref([]);
const selectedFeatureId = ref(null);
const templeSelectLabel = ref("Temple (pick from list)");

/* Debounce utility */
let debounceTimer = null;
function debounce(fn, wait = 220) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, wait);
}

/* Filtering logic: case-insensitive substring match on label + district + other fields */
function runFilter() {
  loading.value = true;
  const q = String(search.value ?? "")
    .trim()
    .toLowerCase();

  // If empty search, show the first N items sorted by label (so dropdown isn't huge)
  if (!q) {
    filteredOptions.value = templeOptions.value
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, resultLimit);
    loading.value = false;
    return;
  }

  const matches = [];
  const max = resultLimit;
  for (const item of templeOptions.value) {
    const hay = (
      item.label +
      " " +
      (item.props?.district || "") +
      " " +
      (item.props?.taluk || "")
    ).toLowerCase();
    if (hay.indexOf(q) !== -1) {
      matches.push(item);
      if (matches.length >= max) break;
    }
  }
  filteredOptions.value = matches;
  loading.value = false;
}

/* watch search with debounce */
watch(
  () => search.value,
  () => {
    loading.value = true;
    debounce(() => {
      runFilter();
    }, 180);
  }
);

/* initialize */
onMounted(() => runFilter());

/* selection handler: populate temple.TID and temple.name; clearing preserves events */
function onTempleSelect(val) {
  // clearing selection
  if (val == null || val === "") {
    temple.value.TID = "";
    temple.value.name = "";
    return;
  } else {
    temple.value.TID = templeOptions.value[val].props.TID;
    temple.value.name = templeOptions.value[val].props.name;
  }
}

/* Helper to highlight match in label */
function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function escapeRegExp(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlightMatch(label = "", q = "") {
  if (!label) return "";
  const s = String(q ?? "").trim();
  if (!s) return escapeHtml(label);
  const re = new RegExp("(" + escapeRegExp(s) + ")", "ig");
  return escapeHtml(label).replace(re, "<strong>$1</strong>");
}
</script>

<style scoped>
pre {
  background-color: #1e1e1e;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 40vh;
}
.no-gap :deep(input) {
  padding-right: 0 !important; /* reduces spacing between text and icon */
}
.no-gap :deep(.v-field__append-inner) {
  margin-left: 2px !important; /* brings icon closer */
}
</style>
