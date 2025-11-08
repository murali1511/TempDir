<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              class="mx-auto rounded-lg g_border"
              :color="isHovering ? colorScheme[0] : colorScheme[1]"
              v-bind="props"
            >
              <v-card-title
                class="d-flex justify-space-between align-center text-subtitle-1"
                :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                @click="displaytoggle"
              >
                {{ $t("gallery_h1") }}

                <v-btn
                  :color="btn_color(isHovering)"
                  icon
                  @click=""
                  size="small"
                  class="mt-1 ml-6"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                  aria-label="Toggle Display"
                >
                  <v-icon>
                    {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-title>

              <!-- Loading Placeholder -->
              <div v-if="!images.length" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>Loading images...</p>
              </div>

              <!-- Image Carousel -->
              <section
                v-else-if="Detailed_display"
                class="pl-2 pr-2"
                :style="`background:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
              >
                <v-card
                  class="mb-2"
                  :color="isHovering ? colorScheme[1] : colorScheme[0]"
                >
                  <v-slide-group
                    v-model="model"
                    class="pa-4"
                    selected-class="bg-primary"
                    mandatory
                    show-arrows
                  >
                    <v-slide-group-item
                      v-for="(image, index) in images"
                      :key="index"
                      v-slot="{ isSelected, toggle, selectedClass }"
                    >
                      <v-card
                        :class="['ma-4', selectedClass]"
                        color="grey-lighten-1"
                        height="100"
                        width="150"
                        @click="openImage(index)"
                      >
                        <v-img
                          :src="image.download_url"
                          :alt="`Image ${index}`"
                          class="image-item"
                          @mouseover="setHoveredImage(index)"
                          @mouseleave="clearHoveredImage"
                        >
                          <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                              <v-progress-circular
                                color="grey-lighten-4"
                                indeterminate
                              ></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                      </v-card>
                    </v-slide-group-item>
                  </v-slide-group>
                </v-card>

                <!-- Dialog for Large Image Preview -->
                <v-dialog v-model="dialog" persistent max-width="600">
                  <v-card>
                    <v-card-title>{{ images[currentImageIndex]?.author }} </v-card-title>
                    <v-card-text>
                      <v-img
                        :src="
                          images[currentImageIndex]?.download_url || '/fallback-image.jpg'
                        "
                        class="rounded"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text icon="mdi-arrow-left" @click="prevImage">Prev</v-btn>
                      <v-btn text icon="mdi-arrow-right" @click="nextImage">Next</v-btn>
                      <v-spacer />
                      <v-btn text @click="dialog = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </section>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>
<script setup>
import { ref } from "vue";
import { dbStore } from "~/composables/dbStore";

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

// Reactive States
const model = ref(null);
const Detailed_display = ref(false);
const dialog = ref(false);
const currentImageIndex = ref(0);
const hoveredImageIndex = ref(null);

// Image Data
const images = ref([
  {
    id: "0",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/yC-Yzbqy7PY",
    download_url: "https://picsum.photos/id/0/5000/3333",
  },
  {
    id: "1",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/LNRyGwIJr5c",
    download_url: "https://picsum.photos/id/1/5000/3333",
  },
  {
    id: "2",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/N7XodRrbzS0",
    download_url: "https://picsum.photos/id/2/5000/3333",
  },
  {
    id: "3",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/Dl6jeyfihLk",
    download_url: "https://picsum.photos/id/3/5000/3333",
  },
  {
    id: "4",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/y83Je1OC6Wc",
    download_url: "https://picsum.photos/id/4/5000/3333",
  },
  {
    id: "5",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3334,
    url: "https://unsplash.com/photos/LF8gK8-HGSg",
    download_url: "https://picsum.photos/id/5/5000/3334",
  },
  {
    id: "6",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/tAKXap853rY",
    download_url: "https://picsum.photos/id/6/5000/3333",
  },
  {
    id: "7",
    author: "Alejandro Escamilla",
    width: 4728,
    height: 3168,
    url: "https://unsplash.com/photos/BbQLHCpVUqA",
    download_url: "https://picsum.photos/id/7/4728/3168",
  },
  {
    id: "8",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/xII7efH1G6o",
    download_url: "https://picsum.photos/id/8/5000/3333",
  },
  {
    id: "9",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3269,
    url: "https://unsplash.com/photos/ABDTiLqDhJA",
    download_url: "https://picsum.photos/id/9/5000/3269",
  },
  {
    id: "10",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/6J--NXulQCs",
    download_url: "https://picsum.photos/id/10/2500/1667",
  },
  {
    id: "11",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Cm7oKel-X2Q",
    download_url: "https://picsum.photos/id/11/2500/1667",
  },
  {
    id: "12",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/I_9ILwtsl_k",
    download_url: "https://picsum.photos/id/12/2500/1667",
  },
  {
    id: "13",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/3MtiSMdnoCo",
    download_url: "https://picsum.photos/id/13/2500/1667",
  },
  {
    id: "14",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/IQ1kOQTJrOQ",
    download_url: "https://picsum.photos/id/14/2500/1667",
  },
  {
    id: "15",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/NYDo21ssGao",
    download_url: "https://picsum.photos/id/15/2500/1667",
  },
  {
    id: "16",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/gkT4FfgHO5o",
    download_url: "https://picsum.photos/id/16/2500/1667",
  },
  {
    id: "17",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Ven2CV8IJ5A",
    download_url: "https://picsum.photos/id/17/2500/1667",
  },
  {
    id: "18",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Ps2n0rShqaM",
    download_url: "https://picsum.photos/id/18/2500/1667",
  },
  {
    id: "19",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/P7Lh0usGcuk",
    download_url: "https://picsum.photos/id/19/2500/1667",
  },
  {
    id: "20",
    author: "Aleks Dorohovich",
    width: 3670,
    height: 2462,
    url: "https://unsplash.com/photos/nJdwUHmaY8A",
    download_url: "https://picsum.photos/id/20/3670/2462",
  },
  {
    id: "21",
    author: "Alejandro Escamilla",
    width: 3008,
    height: 2008,
    url: "https://unsplash.com/photos/jVb0mSn0LbE",
    download_url: "https://picsum.photos/id/21/3008/2008",
  },
  {
    id: "22",
    author: "Alejandro Escamilla",
    width: 4434,
    height: 3729,
    url: "https://unsplash.com/photos/du_OrQAA4r0",
    download_url: "https://picsum.photos/id/22/4434/3729",
  },
  {
    id: "23",
    author: "Alejandro Escamilla",
    width: 3887,
    height: 4899,
    url: "https://unsplash.com/photos/8yqds_91OLw",
    download_url: "https://picsum.photos/id/23/3887/4899",
  },
  {
    id: "24",
    author: "Alejandro Escamilla",
    width: 4855,
    height: 1803,
    url: "https://unsplash.com/photos/cZhUxIQjILg",
    download_url: "https://picsum.photos/id/24/4855/1803",
  },
  {
    id: "25",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/Iuq0EL4EINY",
    download_url: "https://picsum.photos/id/25/5000/3333",
  },
  {
    id: "26",
    author: "Vadim Sherbakov",
    width: 4209,
    height: 2769,
    url: "https://unsplash.com/photos/tCICLJ5ktBE",
    download_url: "https://picsum.photos/id/26/4209/2769",
  },
  {
    id: "27",
    author: "Yoni Kaplan-Nadel",
    width: 3264,
    height: 1836,
    url: "https://unsplash.com/photos/iJnZwLBOB1I",
    download_url: "https://picsum.photos/id/27/3264/1836",
  },
  {
    id: "28",
    author: "Jerry Adney",
    width: 4928,
    height: 3264,
    url: "https://unsplash.com/photos/_WiFMBRT7Aw",
    download_url: "https://picsum.photos/id/28/4928/3264",
  },
  {
    id: "29",
    author: "Go Wild",
    width: 4000,
    height: 2670,
    url: "https://unsplash.com/photos/V0yAek6BgGk",
    download_url: "https://picsum.photos/id/29/4000/2670",
  },
]);

// Toggle Display
const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

// Button Color
const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

// Open Image
const openImage = (index) => {
  currentImageIndex.value = index;
  dialog.value = true;
};

// Navigate Images
const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

// Hover Handlers
const setHoveredImage = (index) => {
  hoveredImageIndex.value = index;
};

const clearHoveredImage = () => {
  hoveredImageIndex.value = null;
};

// Dynamic Styles
const getStyle = (index) => {
  if (activeImageIndex.value === index) {
    return {
      transform: "scale(1.2)",
      filter: "brightness(1.4)",
      transition: "filter 0.3s",
    };
  } else if (activeImageIndex.value !== null) {
    return {
      opacity: 0.5,
      transition: "opacity 0.3s",
    };
  }
  return {};
};
</script>
<style scoped>
.text-container {
  position: relative;
}

.clickable {
  cursor: pointer;
}

.v-dialog__container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-item {
  transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out, opacity 0.3s;
  opacity: 0.75;
}

.image-item:hover {
  transform: scale(1.2);
  filter: brightness(1.4);
  opacity: 1.5;
}
</style>
