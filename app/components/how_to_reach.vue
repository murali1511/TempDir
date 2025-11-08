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
              {{ $t("how_to_reach_h1") }}

              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click=""
                size="small"
                class="mt-1 ml-6"
              >
                <v-icon>
                  {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-card-title>

            <!-- Dhyna Mantra Display start -->
            <section v-if="Detailed_display" class="pl-2 pr-2 pb-1">
              <v-card
                elevation="2"
                class="mb-1"
                max-width="600px"
                :color="isHovering ? colorScheme[1] : colorScheme[0]"
              >
                <v-card-text>
                  <!-- Google Map -->
                  <div
                    class="mb-4"
                    style="border: 2px solid #ccc; border-radius: 8px; overflow: hidden"
                  >
                    <iframe
                      width="100%"
                      height="300"
                      :src="googleMapUrl"
                      frameborder="0"
                      allowfullscreen
                      class="rounded-frame mb-n2"
                    ></iframe>
                  </div>

                  <!-- Transportation Details -->
                  <v-divider :thickness="2" class="border-opacity-25" color="white" />
                  <v-card>
                    <v-list
                      class="mb-n1"
                      :style="`background:
                ${isHovering ? colorScheme[0] : colorScheme[1]}; color: ${
                        isHovering ? colorScheme[1] : colorScheme[0]
                      }`"
                    >
                      <div v-for="(entry, index) in localStore.how_to_reach.commute">
                        <v-list-item class="mt-1">
                          <v-icon color="orange" size="large" class="mr-2">{{
                            `mdi-${icons[entry.mode]}`
                          }}</v-icon>
                          <v-list-item-subtitle
                            class="d-inline opacity-90 description-text"
                            :class="
                              $i18n.locale.value === 'en'
                                ? 'text-justify text-body-1'
                                : 'text-caption multi-line'
                            "
                            :style="`color: ${
                              isHovering ? colorScheme[1] : colorScheme[0]
                            }`"
                          >
                            {{ entry.description }}
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-divider
                          :thickness="2"
                          class="border-opacity-25"
                          color="white"
                        />
                      </div>
                    </v-list>
                  </v-card>
                </v-card-text>

                <!-- Contact Details -->
                <v-card max-width="600px" class="ma-4 mt-n1 rounded-lg">
                  <v-card-title
                    class="text-h5 font-weight-bold text-subtitle-2 text-center bg-orange"
                  >
                    Contact Information
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="mb-n8">
                    <v-list
                      class="mt-n4 ml-n4 mr-n4"
                      :style="`background:
                ${isHovering ? colorScheme[0] : colorScheme[1]}; color: ${
                        isHovering ? colorScheme[1] : colorScheme[0]
                      }`"
                    >
                      <div v-for="(entry, index) in localStore.how_to_reach.contact">
                        <v-list-item class="">
                          <v-icon color="orange" size="large" class="mr-2">{{
                            `mdi-${icons[entry.mode]}`
                          }}</v-icon>
                          <v-list-item-subtitle
                            class="d-inline opacity-90 description-text"
                            :class="
                              $i18n.locale.value === 'en'
                                ? 'text-justify text-body-1'
                                : 'text-caption multi-line'
                            "
                            :style="`color: ${
                              isHovering ? colorScheme[1] : colorScheme[0]
                            }`"
                          >
                            {{ entry.description }}
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-divider
                          :thickness="2"
                          class="border-opacity-25"
                          color="white"
                        />
                      </div>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-card>
            </section>
            <!-- Dhyna Mantra Display end -->
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);
const { $i18n } = useNuxtApp();

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const font_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
const bg_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const icons = {
  road: "car",
  rail: "train",
  air: "airplane",
  phone: "phone",
  email: "email",
  whatsapp: "whatsapp",
};
const localStore = useLocalStore();

onMounted(async () => {
  try {
    await localStore.Fetch_How_to_reach($i18n.locale.value);
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
});

// const how_to_reach_list = ref(localStore.how_to_reach);

// Props or dynamic data
// Google Maps URL
const googleMapUrl = computed(() => {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.4699936296594!2d${
    localStore.how_to_reach.coordinates.lng
  }!3d${
    localStore.how_to_reach.coordinates.lat
  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba43f1173ee45b7%3A0x7f223dcb7bce02f2!2s${encodeURIComponent(
    localStore.name
  )}!5e0!3m2!1sen!2sin!4v1695654567890!5m2!1sen!2sin&zoom=16`;
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
.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
.gold-background {
  background-color: #f2dfa7;
  color: black;
  /* color:  white; Adjust text color if needed */
}
.black-background {
  background-color: black;
  color: #f2dfa7;
  /* color:  white; Adjust text color if needed */
}

.rounded-frame {
  border-radius: 12px; /* Adjust the value for desired roundness */
  overflow: hidden; /* Ensures content inside respects the border-radius */
}
</style>
