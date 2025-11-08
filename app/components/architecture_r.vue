<template>
  <v-row>
    <v-col>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            class="mx-auto rounded-lg"
            max-width="600"
            :color="isHovering ? colorScheme[0] : colorScheme[1]"
            v-bind="props"
          >
            <v-card-title
              class="d-flex justify-space-between align-center text-subtitle-1"
              :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
            >
              {{ $t("architecture_h1") }}
              <v-btn
                :color="btn_color(isHovering)"
                icon
                @click="displaytoggle"
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

            <section
              v-if="Detailed_display"
              class="pl-2 pr-2"
              :class="isHovering ? colorScheme[0] : colorScheme[1]"
            >
              <v-card
                class="mb-2"
                elevation="4"
                max-width="800px"
                outlined
                :color="isHovering ? colorScheme[1] : colorScheme[0]"
              >
                <v-card-title
                  class="text-h5 font-weight-bold text-center"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  {{ architectureDetails[0].name }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="py-2 px-4"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-img
                        src="/logo-10-tr1.png"
                        height="200"
                        class="rounded mt-n2"
                      ></v-img>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div
                        class="text-body-2 text-justify description-text"
                        v-html="architectureDetails[0].description"
                      />
                    </v-col>
                  </v-row>
                  <v-divider class="mt-2"></v-divider>

                  <!-- Loop through Details -->
                  <v-list
                    lines="full"
                    class="mx-n4 mb-n2"
                    :style="`background:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                  >
                    <v-list-item
                      v-for="(item, index) in architectureDetails[0].details"
                      :key="index"
                    >
                      <v-list-item-title
                        class="font-weight-bold"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                      >
                        {{ item.head }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        class="description-text text-justify"
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                        >{{ item.content }}</v-list-item-subtitle
                      >
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <!-- Call to Action -->
                <v-card-actions
                  class="justify-center"
                  :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                >
                  <v-btn color="primary" class="text-white font-weight-bold" large>
                    Learn More
                  </v-btn>
                  <v-btn outlined color="teal-darken-4" large> Book Pooja </v-btn>
                </v-card-actions>
              </v-card>
            </section>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from "vue";
import { dbStore } from "~/composables/dbStore";
const { colorScheme, role } = dbStore();
const Detailed_display = ref(false);

const { $i18n } = useNuxtApp();

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

// Props or dynamic data
const templeName = ref("Lokanarkavu Temple"); // Change dynamically
// Prime Deity Data
const btn_color = (isHovering) => {
  if (!Detailed_display.value && !isHovering) return "#F2DFA7";
  if (!Detailed_display.value && isHovering) return "black";
  if (Detailed_display.value && isHovering) return "black";
  if (Detailed_display.value && !isHovering) return "#F2DFA7";
};

const architectureDetails = ref([
  {
    name: "lokanarkavu Temple",
    description:
      "The Lokanarkavu Temple is an exquisite example of traditional Kerala temple architecture, seamlessly blending spirituality and artistry.",
    details: [
      {
        head: "Design style: ",
        content:
          "Single story, rectangular shaped sreekovil followed Kerala local architecture  style.",
      },
      {
        head: "Structural Techniques: ",
        content:
          "used locally available materials such as laterite stone, lime stone powder  and tiles for the construction of the complex.",
      },

      {
        head: "Sreekovil: ",
        content:
          "At the heart of the temple lies the sanctum sanctorum, or Sreekovil, housing the idol of Goddess Bhagavathi. The sacred ambiance within this inner sanctum creates an atmosphere of devotion and tranquillity.",
      },
      {
        head: "Prakaaras: ",
        content:
          "Surrounding the Sreekovil are concentric enclosures called Prakaaras. These symbolize spiritual progression, guiding devotees closer to the divine as they move inward through the temple complex.",
      },
      {
        head: "Mandapams: ",
        content:
          "The Namaskara Mandapam, a central hall, serves as the venue for rituals and gatherings. Adorned with traditional carvings, this structure exemplifies the architectural excellence of the temple.",
      },
      {
        head: "Murals: ",
        content:
          "The temple’s walls feature intricate murals depicting mythological stories, celestial beings, and spiritual motifs. These artworks are not only aesthetically pleasing but also serve as a medium to convey spiritual narratives.",
      },
      {
        head: "Temple Pond: ",
        content:
          "There are three ponds alongside of temple complex, one of them use bathing for devotees and other two are Integral to the temple’s rituals, the pond is used for purification before entering the sacred spaces. It reflects the harmonious relationship between nature and spirituality in Kerala’s temple traditions.",
      },
    ],
  },
]);
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

.v-card-title,
.v-card-subtitle {
  color: white;
}

.v-list-item-content {
  color: black;
}

.icon-align {
  margin-top: 0;
}

.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
</style>
