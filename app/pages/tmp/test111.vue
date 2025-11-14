<template>
  <v-container class="pa-2">
    <v-card elevation="3" class="pa-2" color="yellow">
      <v-row class="align-center">
        <!-- Temple Autocomplete + Submit -->
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-autocomplete
            v-model="selectedTempleId"
            :items="temples"
            item-title="name"
            item-value="TID"
            placeholder="Search or select a temple..."
            clearable
            rounded
            variant="solo"
            density="compact"
            class="text-caption"
          >
            <!-- Custom selected item -->
            <template #selection="{ item }">
              <span
                :class="
                  !isMobile
                    ? 'text-subtitle-2 font-weight-bold'
                    : 'text-caption font-weight-bold'
                "
              >
                {{ item.title }}
              </span>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" md="4" class="d-flex justify-end align-center">
          <v-btn
            :disabled="!selectedTemple"
            color="primary"
            prepend-icon="mdi-plus"
            @click="openAddEventDialog"
            size="small"
          >
            Add Event
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="selectedTemple" class="ma-4 mt-n2 align-center">
        <v-col cols="12">
          <h6
            class="text-indigo-darken-4 font-weight-bold"
            :class="isMobile ? 'text-body-1 ml-n3 mt-n10' : 'text-h6 '"
          >
            <v-icon icon="mdi-temple-hindu-outline" class="mr-1" size="small" />
            {{
              isMobile
                ? "Temple Events"
                : `Temple Events - ${selectedTemple.name || selectedTemple.TID}`
            }}
          </h6>
        </v-col>
        <v-divider class="my-2" />
      </v-row>

      <div v-if="!selectedTemple" class="text-center pa-6">
        <span class="text-subtitle-1">Please choose a temple to view its events.</span>
      </div>

      <!-- Desktop / Tablet: Data table -->
      <v-sheet v-else-if="!isMobile" class="pa-0">
        <v-data-table
          :headers="eventHeaders"
          :items="allevents"
          item-key="eventID"
          class="elevation-1 events-table"
          density="comfortable"
          hover
        >
          <template v-slot:header.eventTitle="{ column }">
            <span class="font-weight-bold">Event Summary</span>
          </template>
          <template #header.actions="{ column }">
            <span class="font-weight-bold text-center d-block"> Actions </span>
          </template>
          <template #header.eventID="{ column }">
            <span class="font-weight-bold text-left d-block"> #ID </span>
          </template>

          <template #item.eventTitle="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.eventTitle }}</div>
              <div
                v-if="item.eventDescription"
                class="text-caption truncated"
                v-html="item.eventDescription"
              ></div>
            </div>
          </template>

          <template #item.eventID="{ item }">
            <div
              class="text-caption font-weight-bold"
              :class="item.enabled ? 'text-green' : 'text-red'"
            >
              {{ item.eventID }}
            </div>
          </template>

          <template #item.date="{ item }">
            <div class="date-cell">
              <div>
                <strong>Start:</strong>
                <span class="text-caption ml-1">{{
                  prettyDate(item.date?.startDate)
                }}</span>
              </div>
              <div>
                <strong>End:</strong>
                <span class="text-caption ml-1">{{
                  prettyDate(item.date?.endDate)
                }}</span>
              </div>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="actions-cell d-flex align-center">
              <v-btn
                icon
                size="small"
                title="Edit"
                @click="openEditEventDialog(item)"
                aria-label="Edit"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                title="Delete"
                @click="deleteEvent(item)"
                aria-label="Delete"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <template #no-data>
            <div class="pa-6 text-center">No events for this temple.</div>
          </template>
        </v-data-table>
      </v-sheet>

      <!-- Mobile: stacked list/cards -->
      <div v-else class="mobile-list">
        <v-row class="gap-3">
          <v-col cols="12" v-for="item in allevents" :key="item.eventID">
            <v-card elevation="1" class="pa-3 mobile-event-card">
              <div class="d-flex justify-space-between align-start">
                <div class="event-main">
                  <div class="event-title">{{ item.eventTitle }}</div>

                  <div v-if="item.eventCategory" class="event-category text-caption">
                    <span class="font-weight-bold mr-1">Event ID:</span>
                    <span :class="item.enabled ? 'text-green' : 'text-red'">{{
                      item.eventID
                    }}</span>
                  </div>
                  <div v-if="item.eventCategory" class="event-category text-caption">
                    <span class="font-weight-bold">Category:</span>
                    {{ item.eventCategory }}
                  </div>
                  <div class="event-dates text-caption">
                    <div>
                      <strong>Start:</strong>
                      {{ prettyDate(item.date?.startDate) }}
                    </div>
                    <div><strong>End:</strong> {{ prettyDate(item.date?.endDate) }}</div>
                  </div>

                  <div v-if="item.poojaTiming" class="text-caption">
                    <span class="font-weight-bold">Pooja:</span>
                    {{ item.poojaTiming }}
                  </div>

                  <div
                    v-if="item.eventDescription"
                    class="text-caption mt-2"
                    v-html="item.eventDescription"
                  ></div>

                  <div class="justify-center mt-2">
                    <v-btn
                      icon
                      size="small"
                      title="Edit"
                      @click="openEditEventDialog(item)"
                      aria-label="Edit"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      size="small"
                      title="Delete"
                      @click="deleteEvent(item)"
                      aria-label="Delete"
                      class="ml-3"
                    >
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" v-if="allevents.length === 0">
            <v-card class="pa-4 text-center">No events for this temple.</v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Add / Edit Dialog (full fields) -->
    <v-dialog v-model="dialog" max-width="720px" persistent>
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 ml-3">
              {{ isEdit ? "Edit Event" : "Add Event" }}
            </span>

            <span class="text-subtitle-1 mr-3">
              <v-checkbox label="Enable" v-model="form.enabled"></v-checkbox>
            </span>
          </div>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="formValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.eventID"
                  label="Event ID"
                  variant="outlined"
                  density="compact"
                  required
                  readonly="true"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.eventTitle"
                  label="Event Title"
                  variant="outlined"
                  density="compact"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.eventCategory"
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

              <v-col cols="12">
                <v-textarea
                  v-model="form.eventDescription"
                  label="Description (HTML supported)"
                  rows="2"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <!-- Start + End datetime-local inputs -->
              <v-row class="mx-0">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="startDateInput"
                    label="Start (date & time)"
                    type="datetime-local"
                    variant="outlined"
                    density="compact"
                    :error="isEndBeforeStart(form)"
                    :error-messages="
                      isEndBeforeStart(form) ? ['End is before start'] : []
                    "
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="endDateInput"
                    label="End (date & time)"
                    type="datetime-local"
                    variant="outlined"
                    density="compact"
                    :error="isEndBeforeStart(form)"
                    :error-messages="
                      isEndBeforeStart(form) ? ['End is before start'] : []
                    "
                  />
                </v-col>
              </v-row>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.poojaTiming"
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
                        @click="form.highlights.push('')"
                        class="me-2"
                        >+ Add</v-btn
                      >
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearHighlights(form)"
                        >Clear</v-btn
                      >
                    </div>
                  </div>

                  <div
                    v-for="(h, hIndex) in form.highlights"
                    :key="hIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="form.highlights[hIndex]"
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
                      @click="removeHighlight(form, hIndex)"
                      :title="'Remove highlight ' + (hIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!form.highlights || form.highlights.length === 0"
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
                        @click="form.participation.push('')"
                        class="me-2"
                        >+ Add</v-btn
                      >
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearParticipation(form)"
                        >Clear</v-btn
                      >
                    </div>
                  </div>

                  <div
                    v-for="(p, pIndex) in form.participation"
                    :key="pIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="form.participation[pIndex]"
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
                      @click="removeParticipation(form, pIndex)"
                      :title="'Remove participation ' + (pIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!form.participation || form.participation.length === 0"
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
                        @click="form.specialNote.push('')"
                        class="me-2"
                        >+ Add</v-btn
                      >
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearSpecialNotes(form)"
                        >Clear</v-btn
                      >
                    </div>
                  </div>

                  <div
                    v-for="(n, nIndex) in form.specialNote"
                    :key="nIndex"
                    class="d-flex align-center mb-2 gap-2"
                  >
                    <v-text-field
                      v-model="form.specialNote[nIndex]"
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
                      @click="removeSpecialNote(form, nIndex)"
                      :title="'Remove note ' + (nIndex + 1)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-if="!form.specialNote || form.specialNote.length === 0"
                    class="text-caption"
                  >
                    No special notes yet.
                  </div>
                </v-card>
              </v-col>

              <!-- Contact -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Contact</strong>
                    <v-btn size="small" variant="text" @click="ensureContact(form)"
                      >Ensure</v-btn
                    >
                  </div>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="form.contact.email"
                        label="Email"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="form.contact.phone"
                        label="Phone"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="form.contact.whatsapp"
                        label="WhatsApp"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.contact.website"
                        label="Website"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn
            :disabled="!formValid || !form.eventTitle"
            color="primary"
            @click="saveEvent"
          >
            {{ isEdit ? "Update" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useDisplay, useDate } from "vuetify";
import { useFirebaseCRUD } from "@/composables/upload/useDB_CRUD.js";
import { useFirebaseDate } from "@/composables/useFirebaseDate";

const {
  prettyDate,
  toJSDate,
  dateToFirebaseTimestamp,
  parsePrettyDateString,
} = useFirebaseDate();

const { Read, Create, Update, Delete, getNextEventID, updateEvent } = useFirebaseCRUD();

const { format, parseISO } = useDate(); // kept if needed later

// ---------- Demo temples (you can replace with live list) ----------
const temples_en = ref([
  { TID: "T0001", name: "Lokanarkavu Temple" },
  { TID: "T0002", name: "Palayad Theru Ganapathi Temple" },
  { TID: "T0003", name: "Guruvayoor" },
  { TID: "T0004", name: "Udayapuram Temple" },
]);
const temples_ml = ref([
  { TID: "T0001", name: "ലോകനാർകാവ് ക്ഷേത്രം" },
  { TID: "T0002", name: "പാലയാട് തെരു ഗണപതി ക്ഷേത്രം" },
  { TID: "T0003", name: "ഗുരുവായൂർ ക്ഷേത്രം" },
  { TID: "T0004", name: "ഉദയപുരം ക്ഷേത്രം, പുറമേരി" },
]);

const { $i18n } = useNuxtApp();

// ---------- State ----------
const allevents = ref([]); // normalized array of { id, TID, name, events: [] , ... }
const selectedTempleId = ref("");
const isMobile = ref(false);
const eventID = ref("");
const EventCounter = ref(0);
const locale = ref($i18n.locale.value);
const EventCollection = ref(`events_${locale.value}`);
const temples = ref(temples_en.value);
// ---------- Normalize Firestore docs into plain temple objects ----------
const FetchDB = async (tid) => {
  const tidValue = tid && tid.value ? tid.value : tid || undefined;
  try {
    const result = await Read(EventCollection.value, { tid: tidValue, limit: 50 });
    console.log("FetchDB raw result:", result);

    if (result.error) {
      console.error("Error checking collection:", result.error);
      allevents.value = [];
      return;
    }

    if (result.exists && Array.isArray(result.docs)) {
      allevents.value = result.docs.map((d) => {
        const data = d?.data || {};
        // make sure events is always an array
        const events = Array.isArray(data.events)
          ? data.events
          : data.events
          ? Object.values(data.events)
          : [];
        return {
          id: d.id ?? data.TID ?? Math.random().toString(36).slice(2),
          TID: data.TID ?? data.tid ?? d.id,
          name:
            data.name ?? data.templeName ?? (data.TID ? `Temple ${data.TID}` : "Unnamed"),
          // keep other original fields too
          ...data,
          events,
        };
      });
      console.log("allevents (normalized):", allevents.value);
    } else {
      allevents.value = [];
      console.log("No documents found in 'events_en' for TID:", tidValue);
    }
  } catch (err) {
    console.error("FetchDB failed:", err);
    allevents.value = [];
  }
};

const RefreshEvent = () => {
  FetchDB(selectedTempleId.value);
};

// ---------- selectedTemple computed: returns the actual object in allevents (NOT a copy) ----------
const selectedTemple = computed(() => {
  if (!selectedTempleId.value) return null;
  const t = temples.value.find((x) => {
    if (!x) return false;
    return (
      String(x?.TID) === String(selectedTempleId.value) ||
      String(x?.id) === String(selectedTempleId.value)
    );
  });
  // ensure events array exists on the returned object
  if (t && !Array.isArray(t.events)) t.events = [];
  return t || null;
});

// ---------- Responsive ----------
function updateIsMobile() {
  isMobile.value = window.innerWidth <= 640;
}
onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
  temples.value = locale.value === "en" ? temples_en.value : temples_ml.value;
  // initial fetch (optional) - comment out if you only fetch on Submit
  // FetchDB();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
});

// ---------- Debugging watcher (helps verify shapes) ----------
watch(selectedTempleId, (v) => {
  console.log("selectedTempleId ->", v);
  console.log("selectedTemple ->", selectedTemple.value);
  FetchDB(selectedTempleId.value);
});

watch(locale, (v) => {
  const locale = $i18n.locale.value;
});
// ---------- Form + Dialog state ----------
const dialog = ref(false);
const isEdit = ref(false);
const formValid = ref(false);
const formRef = ref(null);
const currentEventRef = ref(null);

const form = reactive({
  TID: "",
  name: "",
  eventID: "",
  eventTitle: "",
  eventDescription: "",
  eventCategory: "",
  eventColor: "",
  poojaTiming: "",
  date: { startDate: new Date(), endDate: new Date() },
  highlights: [],
  participation: [],
  specialNote: [],
  contact: { email: "", phone: "", website: "", whatsapp: "" },
  enabled: true,
});

watch(eventID, (v) => {
  form.eventID = v;
});

// ---------- datetime-local computed bindings (local <-> ISO) ----------
const startDateInput = computed({
  get() {
    if (!form.date.startDate) return "";
    const d = toJSDate(form.date.startDate);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },
  set(value) {
    if (!value) {
      const d = new Date();
      form.date.startDate = d.toISOString();
      // form.date.startDate = "";
      return;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    form.date.startDate = d.toISOString();
  },
});

const endDateInput = computed({
  get() {
    if (!form.date.endDate) return "";
    const d = toJSDate(form.date.endDate);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },
  set(value) {
    if (!value) {
      form.date.endDate = "";
      return;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    form.date.endDate = d.toISOString();
  },
});

// ---------- Small helpers for list fields ----------
const removeHighlight = (eventObj, idx) => eventObj?.highlights?.splice(idx, 1);
const clearHighlights = (eventObj) => (eventObj.highlights = []);
const removeParticipation = (eventObj, idx) => eventObj?.participation?.splice(idx, 1);
const clearParticipation = (eventObj) => (eventObj.participation = []);
const removeSpecialNote = (eventObj, idx) => eventObj?.specialNote?.splice(idx, 1);
const clearSpecialNotes = (eventObj) => (eventObj.specialNote = []);
const ensureContact = (eventObj) => {
  if (!eventObj.contact)
    eventObj.contact = { email: "", phone: "", website: "", whatsapp: "" };
};

// ---------- Validation ----------
const isEndBeforeStart = (ev) => {
  const s = ev?.date?.startDate;
  const e = ev?.date?.endDate;
  if (!s || !e) return false;
  const sd = new Date(s);
  const ed = new Date(e);
  if (isNaN(sd) || isNaN(ed)) return false;
  return ed < sd;
};

// ---------- Dialog controls + CRUD on local normalized data ----------
function resetForm() {
  Object.assign(form, {
    TID: "",
    name: "",
    eventID: "",
    eventTitle: "",
    eventDescription: "",
    eventCategory: "",
    eventColor: "",
    poojaTiming: "",
    date: { startDate: "", endDate: "" },
    highlights: [],
    participation: [],
    specialNote: [],
    contact: { email: "", phone: "", website: "", whatsapp: "" },
    enabled: true,
  });
  currentEventRef.value = null;
  isEdit.value = false;
}

function openAddEventDialog() {
  if (!selectedTemple.value) return;
  console.log(JSON.parse(JSON.stringify(form)));
  resetForm();
  GetEventID(selectedTemple.value.TID);
  form.TID = selectedTemple.value.TID;
  form.name = selectedTemple.value.name;
  form.eventID = eventID.value;
  isEdit.value = false;
  dialog.value = true;
}

function openEditEventDialog(ev) {
  if (!selectedTemple.value) return;
  isEdit.value = true;
  // // Keep a reference to the actual event object inside selectedTemple.events
  const foundIndex = allevents.value.findIndex((e) => e.eventID === ev.eventID);
  if (foundIndex === -1) return;
  currentEventRef.value = allevents.value[foundIndex];
  // copy into form for editing (so accidental edits won't mutate until saved)
  Object.assign(form, JSON.parse(JSON.stringify(ev)));
  dialog.value = true;
}

function saveEvent() {
  if (!allevents) return;
  if (!form.eventTitle) return;

  if (isEdit.value && currentEventRef.value) {
    // copy updated fields back to the event object in selectedTemple.events
    Object.assign(currentEventRef.value, JSON.parse(JSON.stringify(form)));
    console.log(currentEventRef.value.id);
    const result = Update(
      EventCollection.value,
      currentEventRef.value.id,
      currentEventRef.value
    );
    console.log("Update DB result:", result);
  } else {
    // generate eventID if missing
    // const newId = form.eventID || "E" + Math.floor(Math.random() * 100000);
    // const newEvent = JSON.parse(JSON.stringify({ ...form, eventID: newId }));
    const newEvent = JSON.parse(JSON.stringify(form));
    // ensure events array exists

    if (!Array.isArray(allevents.value)) allevents.value = [];
    Create("events_en", newEvent)
      .then((result) => {
        console.log("Create DB result:", result);
        if (result && result.id) {
          newEvent.id = result.id;
          allevents.value.push(JSON.parse(JSON.stringify(newEvent)));
          console.log("allevents:", JSON.parse(JSON.stringify(allevents.value)));
          SetEventID(newEvent.TID, EventCounter.value);
        } else {
          console.warn("Create returned no id:", result);
        }
      })
      .catch((err) => {
        console.error("Failed to create event:", err);
      });
  }

  // If you want to persist to Firestore, call your update function here.
  closeDialog();
}

function deleteEvent(ev) {
  if (!allevents) return;
  if (!confirm(`Delete event "${ev.eventTitle}"?`)) return;
  const result = Delete(EventCollection.value, ev.id);
  console.log("Delete document result:", result);

  allevents.value = allevents.value.filter((e) => e.eventID !== ev.eventID);

  // If you want to persist delete to Firestore, do it here.
}

function closeDialog() {
  dialog.value = false;
  setTimeout(() => resetForm(), 200);
}

const GetEventID = async (tid) => {
  try {
    const result = await getNextEventID(tid);

    eventID.value = result.eventID;
    EventCounter.value = result.counter;
  } catch (err) {
    console.error("Error:", err);
  }
};

const SetEventID = async (tid, counter) => {
  await updateEvent(tid, counter);
};

// ---------- table headers ----------
const eventHeaders = [
  { title: "Event ID", value: "eventID", align: "start" },
  { title: "Event", value: "eventTitle", align: "start" },
  { title: "Category", value: "eventCategory", sortable: true, align: "start" },
  { title: "Date", value: "date", align: "start" },
  {
    title: "Actions",
    value: "actions",
    sortable: false,
    align: "end",
    width: "140px",
  },
];
</script>

<style scoped>
/* Desktop table tweaks */
.events-table .actions-cell {
  min-width: 120px;
  justify-content: flex-end;
  gap: 8px;
  padding-right: 8px;
}

/* Truncated description for table */
.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile stacked list styling */
.mobile-list .mobile-event-card {
  display: block;
}

/* event text */
.event-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}
.event-category,
.event-dates {
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 4px;
}

/* Make buttons easier to tap on mobile */
.mobile-list .v-btn {
  min-height: 40px;
  padding: 8px 12px;
}
</style>
