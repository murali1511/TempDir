<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              class="mx-auto rounded-lg"
              max-width="600"
              :color="isHovering ? colorScheme.bg : colorScheme.bg_r"
              v-bind="props"
              @mouseover="updateHover(0, true)"
              @mouseleave="updateHover(0, false)"
            >
              <v-card-title
                class="d-flex justify-space-between align-center text-subtitle-1"
                :style="`color:
                ${isHovering ? color_scheme[1] : color_scheme[0]}`"
                :class="isHovering ? color_scheme.text_color : color_scheme.text_reverse"
              >
                {{ comp_name }}
                <v-btn
                  :color="btn_color(isHovering)"
                  icon
                  @click="displaytoggle"
                  size="small"
                  class="mt-1 ml-6"
                >
                  <v-icon>
                    {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-title>

              <section v-if="Detailed_display" class="pl-2 pr-2 bg-color-gold">
                <v-card
                  class="mb-2"
                  elevation="4"
                  max-width="800px"
                  outlined
                  :color="Main_hovering ? '#282828' : '#F2DFA7'"
                >
                  <!-- {{ com/p_name }} -->

                  <component :is="currentComponent" />
                  <!-- <testc></testc> -->
                </v-card>
              </section>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { ref, watch, defineAsyncComponent, defineProps } from "vue";

import { dbStore } from "~/composables/dbStore";

// Define props
const props = defineProps({
  comp_name: {
    type: String,
    required: true, // Ensure the parent passes this prop
  },
});

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();

// Function to update hover status
const updateHover = (0, isHovering) => {
  update_hovered_comp(0, isHovering);
};
// Ref to store the current component
const currentComponent = ref(null);

// Function to dynamically load a component
const loadComponent = (name) => {
  currentComponent.value = defineAsyncComponent(() =>
    import(`/_nuxt/components/${name}`)
  );
};

// Watch for changes to `comp_name` and load the component dynamically
watch(
  () => props.comp_name, // Directly access `comp_name` without `.value`
  (newName) => {
    loadComponent(newName);
  },
  { immediate: true } // Ensure the component is loaded immediately
);

const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const color_scheme = ["#f2dfa7;", "#282828", "#282828", "#f2dfa7"];

const btn_color = (isHovering) => {
  if (!Detailed_display.value && !isHovering) return "#F2DFA7";
  if (!Detailed_display.value && isHovering) return "#282828";
  if (Detailed_display.value && isHovering) return "#282828";
  if (Detailed_display.value && !isHovering) return "#F2DFA7";
};
const mythology = ref({
  summary_en:
    "Lokanarkavu Temple, established around the 14th century, is deeply rooted in Kerala's cultural traditions.",
});
</script>

<style scoped>
.text-container {
  position: relative;
}

.float-left {
  float: left; /* Float the image to the left */
}

.text-justify {
  text-align: justify; /* Ensures the text is justified */
}

bg-color-gold {
  background-color: "#F2DFA7";
}
</style>
