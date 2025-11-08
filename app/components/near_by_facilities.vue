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
              {{ $t("near_facilities_h1") }}

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

            <section v-if="Detailed_display" class="px-2">
              <v-card
                class="mb-2"
                elevation="4"
                max-width="800px"
                outlined
                :color="isHovering ? colorScheme[1] : colorScheme[0]"
              >
                <v-list
                  lines="full"
                  :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                >
                  <v-list-item
                    v-for="(facility, index) in localStore.near_facilities.facilities"
                    :key="index"
                    :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                    x
                  >
                    <v-btn color="red" density="compact" class="mr-2" icon size="small">{{
                      index + 1
                    }}</v-btn>
                    <v-list-item-title
                      class="font-weight-bold d-inline"
                      :class="
                        $i18n.locale.value === 'en'
                          ? 'text-body-1 text-justify '
                          : 'text-body-2 '
                      "
                    >
                      {{ `${facility.title}` }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="text-body-2 o ml-7 description-text"
                      :class="
                        $i18n.locale.value === 'en'
                          ? 'text-body-1 text-justify'
                          : 'text-caption'
                      "
                      :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                    >
                      {{ facility.description }}
                    </v-list-item-subtitle>
                    <div
                      v-for="(option, index) in facility.options"
                      class="text-caption ml-10 mt-2 text-justify opacity-80"
                    >
                      {{ option }}
                    </div>
                    <v-divider
                      :color="isHovering ? colorScheme[0] : colorScheme[1]"
                      opacity=".2"
                      class="mt-1"
                    />
                  </v-list-item>
                </v-list>
              </v-card>
            </section>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value =
    localStore.near_facilities == "Not Found"
      ? Detailed_display.value
      : !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  // localStore.Fetch_Specialpooja(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});
</script>

<style scoped>
.temple-theme {
  background-color: #fff6e0;
}

.temple-header {
  background-image: url("/images/temple-background.jpg");
  background-size: cover;
  background-blend-mode: multiply;
}

.mantra-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.script-text {
  color: #d32f2f;
  font-weight: bold;
}

.v-card-title,
.v-card-subtitle {
  color: white;
}

.v-list-item-content {
  color: black;
}

.dynamic-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  text-align: center;
  font-weight: bold;
}

.icon-align {
  margin-top: 0;
}

.blessing-content {
  margin-top: 2px;
}

.blessing-text {
  margin-left: 25px;
  display: block;
  text-align: left;
}
.prime-deity-button {
  height: 125px;
  width: 125px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

/* Sub Deities Button - Small Round */
.sub-deity-button {
  height: 80px;
  width: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}
.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
.red-background {
  background-color: #f2dfa7;
  /* color:  white; Adjust text color if needed */
}
</style>
