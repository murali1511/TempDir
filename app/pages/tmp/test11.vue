<template>
  <v-container class="pa-2">
    <v-card elevation="3" class="pa-2" color="yellow">
      <v-row class="align-center">
        <!-- Temple Autocomplete -->
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-autocomplete
            v-model="selectedTempleId"
            :items="temples"
            item-title="name"
            item-value="TID"
            label="Select Temple"
            placeholder="Search or select a temple..."
            clearable
            rounded
            variant="solo"
            density="compact"
            prepend-inner-icon="mdi-temple-hindu"
            max-width="450px"
          />
        </v-col>
        <v-row class="ma-4 mt-n5" v-if="selectedTemple">
          <v-col cols="6" md="6" class="d-flex justify-start">
            <h6 class="text-h6 text-indigo-darken-4 font-weight-bold">
              <v-icon
                icon="mdi-temple-hindu-outline"
                class="mr-1"
                color="blue-darken-5"
                size="small"
              ></v-icon>
              Temple Events
            </h6>
          </v-col>
          <v-col cols="6" md="6" class="d-flex justify-end">
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
          <v-divider class="my-1" />
        </v-row>
      </v-row>

      <div v-if="!selectedTemple" class="text-center pa-6">
        <span class="text-subtitle-1">Please choose a temple to view its events.</span>
      </div>

      <!-- Desktop / Tablet: regular table -->
      <div v-else>
        <v-sheet v-if="!isMobile" class="pa-0">
          <v-data-table
            :headers="eventHeaders"
            :items="selectedTemple.events"
            item-key="eventID"
            class="elevation-1 events-table"
            density="comfortable"
            hover
          >
            <template v-slot:header.eventTitle="{ column }">
              <span class="font-weight-bold">{{ column.title }}</span>
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

            <template #item.date="{ item }">
              <div class="date-cell">
                <div>
                  <strong>Start:</strong>
                  <span class="text-caption ml-1">{{
                    prettyDate(item.date?.startDate)
                  }}</span>
                </div>
                <div>
                  <strong>End:</strong
                  ><span class="text-caption ml-1">
                    {{ prettyDate(item.date?.endDate) }}</span
                  >
                </div>
              </div>
            </template>

            <template #item.poojaTiming="{ item }">
              <div>{{ item.poojaTiming || "-" }}</div>
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

        <!-- Mobile: stacked list/cards (no horizontal scroll) -->
        <div v-else class="mobile-list">
          <v-row class="gap-3">
            <v-col cols="12" v-for="item in selectedTemple.events" :key="item.eventID">
              <v-card elevation="1" class="pa-3 mobile-event-card">
                <div class="d-flex justify-space-between align-start">
                  <div class="event-main">
                    <div class="event-title mt-n4">{{ item.eventTitle }}</div>
                    <div v-if="item.eventCategory" class="event-category text-caption">
                      <span class="font-weight-bold">ID:</span>
                      {{ item.eventID }}
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
                      <div>
                        <strong>End:</strong>
                        {{ prettyDate(item.date?.endDate) }}
                      </div>
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
            <v-col cols="12" v-if="selectedTemple.events.length === 0">
              <v-card class="pa-4 text-center">No events for this temple.</v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="720px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEdit ? "Edit Event" : "Add Event" }}</span>
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
                  :readonly="isEdit"
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
              <v-row class="no-guttersv ml-0 mr-0">
                <!-- Add v-row wrapper with no-gutters to minimize spacing between fields on desktop -->
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
                <v-col cols="12" md="6" class="align-right">
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
              <!--Pooja Timing Optional -->
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
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearHighlights(form)"
                      >
                        Clear
                      </v-btn>
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
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearParticipation(form)"
                      >
                        Clear
                      </v-btn>
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
                      >
                        + Add
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="clearSpecialNotes(form)"
                      >
                        Clear
                      </v-btn>
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

              <!-- contact (optional quick edit) -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>Contact</strong>
                    <v-btn size="small" variant="text" @click="ensureContact(form)">
                      Ensure
                    </v-btn>
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
          <v-btn @click="form.date.startDate = '2025-11-08T13:00:00.000Z'"
            >Update Date</v-btn
          >
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
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { allevents } from "@/stores/events.js"; // adjust import path if needed
import { useDisplay, useDate } from "vuetify";
// import { enUS } from "date-fns/locale"; // Add: Import en-US locale (or enIN for India)
const { format, parseISO, diff, date } = useDate();

// Make editable copy of store data
const temples = ref(JSON.parse(JSON.stringify(allevents || [])));

// State
const selectedTempleId = ref(null);
const selectedTemple = computed(
  () => temples.value.find((t) => t.TID === selectedTempleId.value) || null
);

//Functions
const removeHighlight = (event, idx) => event?.highlights?.splice(idx, 1);
const clearHighlights = (event) => (event.highlights = []);
const removeParticipation = (event, idx) => event?.participation?.splice(idx, 1);
const clearParticipation = (event) => (event.participation = []);
const removeSpecialNote = (event, idx) => event?.specialNote?.splice(idx, 1);
const clearSpecialNotes = (event) => (event.specialNote = []);
const ensureContact = (event) => {
  if (!event.contact) event.contact = { email: "", phone: "", website: "", whatsapp: "" };
};
//End functions

//Date Conversion
const startDateInput = computed({
  get() {
    if (!form.date.startDate) return "";
    try {
      const date = new Date(form.date.startDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      // Format using LOCAL time components for datetime-local display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  },
  set(value) {
    if (!value) {
      form.date.startDate = "";
      return;
    }
    // Parse as LOCAL time, store as UTC ISO
    const date = new Date(value);
    if (isNaN(date.getTime())) return;
    form.date.startDate = date.toISOString();
  },
});
const endDateInput = computed({
  get() {
    if (!form.date.endDate) return "";
    try {
      const date = new Date(form.date.endDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      // Format using LOCAL time components for datetime-local display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  },
  set(value) {
    if (!value) {
      form.date.endDate = "";
      return;
    }
    // Parse as LOCAL time, store as UTC ISO
    const date = new Date(value);
    if (isNaN(date.getTime())) return;
    form.date.endDate = date.toISOString();
  },
});

// Pretty display for {{ ... }} or placeholder (local time, no "UTC")
const prettyDate = (dt) => {
  if (!dt) return "Select start date & time"; // Assuming 'item' is reactive; adjust if 'form'
  try {
    const date = new Date(dt); // Parse ISO to Date (local-adjusted)
    if (isNaN(date.getTime())) return "Invalid date";

    // Intl: Full date + short time (e.g., "December 5, 2025, 12:00 AM")
    const formatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "short", // "December 5, 2025"
      timeStyle: "short", // "12:00 AM" (12-hour with AM/PM)
      timeZone: undefined, // Uses local (IST) – omit for your browser's default
    });
    return formatter.format(date); // "December 5, 2025, 12:00 AM"
  } catch {
    return "Invalid date";
  }
};
//END
// Detect mobile viewport (simple approach)
const isMobile = ref(false);
function updateIsMobile() {
  // you can tweak the width threshold (e.g., 640) as needed
  isMobile.value = window.innerWidth <= 640;
}
onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
});

// Headers for desktop/tablet
const eventHeaders = [
  { title: "Event ID", value: "eventID", align: "start" },
  { title: "Event", value: "eventTitle", align: "start" },
  { title: "Category", value: "eventCategory", align: "start" },
  { title: "Date", value: "date", sortable: true, align: "start" },
  { title: "Pooja Timing", value: "poojaTiming", align: "center" },
  {
    title: "Actions",
    value: "actions",
    sortable: false,
    align: "end",
    width: "140px",
  },
];

// Dialog State
const dialog = ref(false);
const isEdit = ref(false);
const formValid = ref(false);
const formRef = ref(null);
const currentEventRef = ref(null);

const form = reactive({
  eventID: "",
  eventTitle: "",
  eventDescription: "",
  eventCategory: "",
  eventColor: "",
  poojaTiming: "",
  date: { startDate: "", endDate: "" },
});

// Functions
function openAddEventDialog() {
  if (!selectedTemple.value) return;
  resetForm();
  isEdit.value = false;
  currentEventRef.value = null;
  dialog.value = true;
}

function openEditEventDialog(ev) {
  if (!selectedTemple.value) return;
  isEdit.value = true;
  const found = selectedTemple.value.events.find((e) => e.eventID === ev.eventID);
  currentEventRef.value = found;
  Object.assign(form, JSON.parse(JSON.stringify(found)));
  dialog.value = true;
  console.log(found);
}
const isEndBeforeStart = (ev) => {
  const s = ev?.date?.startDate;
  const e = ev?.date?.endDate;
  if (!s || !e) return false;
  const sd = new Date(s);
  const ed = new Date(e);
  if (isNaN(sd) || isNaN(ed)) return false;
  return ed < sd;
};

function saveEvent() {
  if (!selectedTemple.value) return;
  if (!form.eventTitle) return;

  if (isEdit.value && currentEventRef.value) {
    Object.assign(currentEventRef.value, JSON.parse(JSON.stringify(form)));
  } else {
    form.eventID = "E" + Math.floor(Math.random() * 10000);
    selectedTemple.value.events.push(JSON.parse(JSON.stringify(form)));
  }
  closeDialog();
}

function deleteEvent(ev) {
  if (!selectedTemple.value) return;
  const ok = confirm(`Delete event "${ev.eventTitle}"?`);
  if (!ok) return;
  selectedTemple.value.events = selectedTemple.value.events.filter(
    (e) => e.eventID !== ev.eventID
  );
}

function resetForm() {
  Object.assign(form, {
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
  });
}

function closeDialog() {
  dialog.value = false;
  setTimeout(() => resetForm(), 200);
}

function formatDate(d) {
  if (!d) return "-";
  return String(d).replace("T", " ");
}
</script>

<style scoped>
/* Desktop table tweaks */
.events-table .actions-cell {
  min-width: 120px;
  justify-content: flex-end;
  gap: 8px;
  padding-right: 8px;
}

.events-table .v-data-table__tbody td .actions-cell {
  /* keep it simple for desktop/tablet */
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

/* Mobile actions - stacked buttons */
.mobile-actions {
  max-width: 50px;
  margin-left: 8px;
}
.mobile-actions .v-btn {
  white-space: nowrap;
}

/* Delete button color */
.delete-btn {
  --v-btn-text-color: var(--v-error-base);
}

/* Make buttons easier to tap on mobile */
.mobile-list .v-btn {
  min-height: 40px;
  padding: 8px 12px;
}

/* Small screens: card layout stacks nicely */
@media (max-width: 420px) {
  .mobile-actions {
    min-width: 100%;
    margin-left: 0;
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }
  /* .mobile-actions .v-btn {
    flex: 1 1 auto;
  } */
}
</style>
