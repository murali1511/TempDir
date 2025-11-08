<template>
  <v-row class="mb-3" align="center">
    <v-col cols="12" md="8">
      <div class="d-flex flex-column flex-md-row align-center gap-3">
        <!-- only show spacer on md+ to push toggle to the right -->
        <v-spacer class="d-none d-md-flex" />

        <!-- Toggle container -->
        <div class="d-flex justify-center w-100 w-md-auto mt-3 mt-md-0">
          <v-btn-toggle
            v-model="filterLocal"
            density="compact"
            border
            divided
            rounded
            class="d-flex justify-center"
          >
            <v-btn width="80" size="x-small" value="all" class="font-weight-bold">
              All <span v-if="counts.all !== null"> ({{ counts.all }})</span>
            </v-btn>
            <v-btn width="80" size="x-small" value="image" class="font-weight-bold">
              Images
              <span v-if="counts.image !== null"> ({{ counts.image }})</span>
            </v-btn>
            <v-btn width="80" size="x-small" value="video" class="font-weight-bold">
              Videos
              <span v-if="counts.video !== null"> ({{ counts.video }})</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="4" class="d-flex justify-center">
      <v-text-field
        v-model="search"
        placeholder="Search title or caption"
        dense
        hide-details
        clearable
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        max-width="350"
        class="bg-white text-subtitle-2 w-100 w-md-auto"
        size="x-small"
      />
    </v-col>
  </v-row>

  <v-row>
    <template v-if="loading">
      <v-col cols="12"><v-progress-linear indeterminate /></v-col>
    </template>

    <template v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" dense>{{ error }}</v-alert>
      </v-col>
    </template>

    <template v-else>
      <v-col v-for="item in pagedItems" :key="itemKey(item)" :cols="colSpan">
        <v-card class="ma-1" elevation="2" rounded="lg" transparent>
          <v-img
            :src="safeSrc(item)"
            :alt="item.title || 'media'"
            :height="imgHeight + 'px'"
            class="cursor-pointer media-img"
            @click="openLightbox(itemIndex(item))"
            :lazy-src="item.thumbnail || placeholderDataUrl"
            width="100%"
            @error="onImgError"
            :eager="false"
            cover
          >
            <template #placeholder>
              <v-skeleton-loader type="image" />
            </template>

            <div style="position: absolute; top: 6px; right: 6px" class="mt-n3">
              <v-icon x-small v-if="item.type === 'video'"
                >mdi-play-circle-outline</v-icon
              >
            </div>
          </v-img>

          <v-card-actions class="ps-2">
            <div class="text-body-2 text-truncate" style="flex: 1">
              <v-icon small class="mr-1">{{ `mdi-${item.type}` }}</v-icon>
              <span :class="textClass">{{ item.caption || item.title || "" }}</span>
            </div>
            <v-menu>
              <template #activator="{ props }">
                <v-btn size="x-small" icon v-bind="props"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list density="compact">
                <v-list-item @click="download(item)">
                  <v-list-item-title>Download</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openLightbox(itemIndex(item))">
                  <v-list-item-title>Open</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>

      <template v-if="visibleItems.length === 0">
        <v-col cols="12">
          <v-alert type="info" dense>No media found.</v-alert>
        </v-col>
      </template>
    </template>
  </v-row>

  <!-- Pagination controls -->
  <v-row class="mt-4" align="center" justify="center" v-if="totalPages > 1">
    <v-col cols="12" class="d-flex justify-center align-center gap-3">
      <v-pagination
        v-model="page"
        :length="totalPages"
        circle
        size="small"
        :total-visible="7"
        density="compact"
        first-icon="mdi-chevron-double-left"
        last-icon="mdi-chevron-double-right"
        show-first-last-page
      />
    </v-col>
    <v-col class="d-flex justify-center align-center">
      <div class="text-caption mt-n4">
        Page <span class="font-weight-bold">{{ page }}</span> of
        <span class="font-weight-bold">{{ totalPages }}</span>
      </div>
    </v-col>
  </v-row>

  <!-- Lightbox dialog -->
  <v-dialog v-model="lightbox.open" :width="isMobile ? '100%' : '75%'" persistent>
    <v-card :class="isMobile ? 'pa-2' : 'pa-4'" max-width="1200">
      <v-card-title class="d-flex align-center">
        <div>
          <div class="" :class="textClass">{{ current?.title }}</div>
          <div class="text-subtitle-2">{{ current?.date }} • {{ current?.type }}</div>
        </div>
        <v-spacer />
        <v-btn icon @click="prev" size="small"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-btn icon @click="next" size="small"><v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn icon @click="download(current)" size="small"
          ><v-icon>mdi-download</v-icon></v-btn
        >
        <v-btn icon @click="lightbox.open = false" size="small"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>

      <v-divider />

      <v-card-text
        class="d-flex justify-center"
        :class="isMobile ? 'pa-2' : 'pa-6'"
        style="width: 100%"
      >
        <div
          class="lightbox-media"
          :style="isMobile ? { width: '100%' } : { maxWidth: '100%' }"
        >
          <template v-if="current?.type === 'image'">
            <v-img
              :src="current.url"
              class="lightbox-img"
              :aspect-ratio="16 / 9"
              :contain="true"
              width="100%"
            />
          </template>
          <template v-else-if="current?.type === 'video'">
            <video
              :src="current.url"
              controls
              class="lightbox-video"
              style="
                width: 100%;
                height: auto;
                max-height: 70vh;
                object-fit: contain;
                border-radius: 8px;
              "
            ></video>
          </template>
        </div>
      </v-card-text>

      <v-card-actions>
        <div
          class="text-body-2 mt-n10"
          :class="textClass"
          style="flex: 1; text-align: left"
        >
          {{ current?.caption }}
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/* TempleMediaGallery.vue
   - Robust watch for filterLocal
   - Debounced search (simple timer)
   - Title + caption search
   - Sort by date (newest first)
   - Safe call of filtered.applyFilter if present
   - Normalizes/unwraps filteredWrapper shapes, flattens nested arrays, and dedupes by id
*/

import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useTempleMedia } from "@/composables/useTempleMedia.js";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
const { $i18n } = useNuxtApp();

const route = useRoute();
const templeID = route.params.id || "T0001";
const display = useDisplay();
const isMobile = computed(() => display.smAndDown); // true on xs / sm

const { loading, error, data, load, filter, filtered: filteredWrapper } = useTempleMedia(
  templeID
);

// placeholder SVG
const placeholderDataUrl =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="20">No image</text></svg>';

const templeName = computed(() =>
  data.value && data.value.templeName ? data.value.templeName : `Temple ${templeID}`
);

const templeDate = computed(() => {
  if (!data.value || !data.value.media || !data.value.media.length) return null;
  const dates = data.value.media.map((m) => m.date).filter(Boolean);
  return dates.length ? dates.slice().sort().reverse()[0] : null;
});

// load on mounted
onMounted(async () => {
  await load();
});

// search + debounce
const search = ref("");
let _searchTimer = null;
const debouncedSearch = ref("");
const page = ref(1);

watch(search, (nv) => {
  if (_searchTimer) clearTimeout(_searchTimer);
  _searchTimer = setTimeout(() => {
    debouncedSearch.value = (nv || "").trim().toLowerCase();
    page.value = 1;
  }, 250);
});

// filter toggle
const filterLocal = ref("all"); // 'all' | 'image' | 'video'

// keep composable's filter in sync (safe)
watch(
  filterLocal,
  async (v) => {
    try {
      if (filter && typeof filter === "object" && "value" in filter) {
        filter.value = v;
      } else if (typeof filter === "function") {
        filter(v);
      } else {
        console.warn("Unexpected composable filter shape", filter);
      }
    } catch (e) {
      console.error("Failed to set composable filter", e);
    }

    page.value = 1;

    try {
      if (filteredWrapper && typeof filteredWrapper.applyFilter === "function") {
        await filteredWrapper.applyFilter();
      } else {
        await nextTick();
      }
    } catch (e) {
      console.error("filtered.applyFilter threw", e);
    }
  },
  { immediate: true }
);

/* ---------- helpers: normalize, flatten, dedupe ---------- */
// normalized unwrap: works whether filteredWrapper is a ref, a computed, or a plain array
function unwrapArray(maybeArr) {
  const v = maybeArr?.value ?? maybeArr ?? [];
  return Array.isArray(v) ? v : [];
}

// dedupe by id and preserve first-seen order
function dedupeById(list = []) {
  const out = [];
  const seen = new Set();
  for (const it of list) {
    // if item has no id, fallback to a stable string - JSON stringify as last resort
    const key = it?.id ?? (typeof it === "object" ? JSON.stringify(it) : String(it));
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

// safe item key for v-for
function itemKey(item) {
  return item?.id ?? JSON.stringify(item);
}

/* ---------- baseList (normalized + deduped + sorted newest-first) ---------- */
const baseList = computed(() => {
  const raw = unwrapArray(filteredWrapper);

  // Flatten one level if nested arrays present (defensive)
  const flattened = raw.reduce((acc, v) => {
    if (Array.isArray(v)) return acc.concat(v);
    acc.push(v);
    return acc;
  }, []);

  const unique = dedupeById(flattened);

  return unique.slice().sort((a, b) => {
    const A = a && a.date ? new Date(a.date).getTime() : 0;
    const B = b && b.date ? new Date(b.date).getTime() : 0;
    return B - A;
  });
});

/* ---------- visibleItems (search filter on top of baseList) ---------- */
const visibleItems = computed(() => {
  const s = (debouncedSearch.value || "").trim().toLowerCase();
  const base = baseList.value || [];

  if (!s) return base;

  return base.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const caption = (m.caption || "").toLowerCase();
    return title.includes(s) || caption.includes(s);
  });
});

// ----- Responsive cols: make laptops use 6 per row -----
const cols = computed(() => {
  // Treat md and up as 6 columns per row (2 x 6 grid on laptop/desktop)
  if (display.mdAndUp.value) return 6;

  // Tablet: 4 columns
  if (display.smAndUp.value) return 4;

  // Phones: 2 columns
  return 2;
});
const rows = 2;
const pageSize = computed(() => cols.value * rows);

const totalPages = computed(() => {
  const total = visibleItems.value.length || 0;
  return Math.max(1, Math.ceil(total / pageSize.value));
});

// clamp page if needed
watch([pageSize, visibleItems], () => {
  if (page.value > totalPages.value) page.value = totalPages.value;
  if (page.value < 1) page.value = 1;
});

const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return visibleItems.value.slice(start, start + pageSize.value);
});

/* expose simple col-span for v-col (Vuetify grid uses 12 columns). */
const colSpan = computed(() => {
  const span = Math.floor(12 / cols.value) || 1;
  return span;
});

/* Lightbox state */
const lightbox = ref({ open: false, index: 0 });
const current = computed(() => {
  const arr = visibleItems.value || [];
  const idx = lightbox.value.index;
  if (!arr.length) return null;
  const safeIdx = Math.min(Math.max(0, idx), arr.length - 1);
  return arr[safeIdx] || null;
});

watch(visibleItems, (nv) => {
  if (!nv || !nv.length) {
    lightbox.value.index = 0;
    lightbox.value.open = false;
    return;
  }
  if (lightbox.value.index > nv.length - 1) {
    lightbox.value.index = nv.length - 1;
  }
});

function itemIndex(item) {
  if (!item) return -1;
  return visibleItems.value.findIndex((i) => i?.id === item?.id);
}

function openLightbox(idx) {
  const arr = visibleItems.value || [];
  if (!arr.length) return;
  if (idx < 0) idx = 0;
  if (idx >= arr.length) idx = arr.length - 1;
  lightbox.value.index = idx;
  lightbox.value.open = true;
}

function next() {
  if (lightbox.value.index < visibleItems.value.length - 1) lightbox.value.index++;
}
function prev() {
  if (lightbox.value.index > 0) lightbox.value.index--;
}

function download(item) {
  if (!item || !item.url) return;
  const a = document.createElement("a");
  a.href = item.url;
  a.download = extractFilename(item.url);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function extractFilename(url) {
  try {
    const u = new URL(url, window.location.href);
    return u.pathname.split("/").pop() || "file";
  } catch (e) {
    return (url || "").split("/").pop() || "file";
  }
}

/* image helpers */
function onImgError(e) {
  console.warn("image failed to load", e);
}
function safeSrc(item) {
  if (!item) return placeholderDataUrl;
  if (item.thumbnail && typeof item.thumbnail === "string") return item.thumbnail;
  if (item.url && typeof item.url === "string") return item.url;
  return placeholderDataUrl;
}

// responsive image height (px)
const imgHeight = computed(() => {
  if (display.xs.value) return 100;
  if (display.smAndUp.value && !display.mdAndUp.value) return 150;
  if (display.mdAndUp.value && !display.lgAndUp.value) return 180;
  if (display.lgAndUp.value && !display.xlAndUp.value) return 180;
  return 190;
});

/* ---------- safer counts (deduped counts derived from data.value.media) ---------- */
const counts = computed(() => {
  if (!data.value || !Array.isArray(data.value.media))
    return { all: null, image: null, video: null };

  const unique = dedupeById(data.value.media);

  const all = unique.length;
  const image = unique.filter((m) => m.type === "image").length;
  const video = unique.filter((m) => m.type === "video").length;
  return { all, image, video };
});

/* Font setting while changing the language EN Vs ML */
const textClass = computed(() =>
  $i18n.locale.value === "ml" ? "text-caption" : "text-caption"
);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.media-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  object-fit: cover;
}
/* v-img class - let v-img use object-fit:contain */
.lightbox-img img {
  object-fit: contain !important;
  width: 100% !important;
  height: auto !important;
}
</style>
