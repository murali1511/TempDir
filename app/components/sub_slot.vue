<template>
  <div>
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card-title
          class="text-h5 font-weight-bold text-center"
          :style="`color:${
            isHovering ? color_scheme.text_color : color_scheme.text_reverse
          }`"
          :color="isHovering ? color_scheme.text_color : color_scheme.text_reverse"
        >
          Slot
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="py-2 px-4">
          <div class="text-container">
            <!-- Image -->
            <v-img
              src="/logo-10-tr1.png"
              height="150"
              width="150"
              class="rounded float-left mr-1 mb-n2"
              alt="Health and Safety"
            ></v-img>

            <!-- Text -->
            <p class="text-body-2 text-justify" style="color: red">
              Lokanarkavu Temple, established around the 14th century, holds a significant
              place in Kerala’s spiritual and cultural history. Founded by the Nair
              community, renowned for their martial traditions, the temple is closely
              associated with the legendary warrior Thacholi Othenan. Its traditional
              Kerala architecture, featuring sloping tiled roofs, intricate wooden
              carvings, and murals, showcases the artistic excellence of the time.
            </p>
            <p class="text-body-2 text-justify">
              Over centuries, the temple has witnessed historical milestones, serving as a
              spiritual haven during periods of unrest and cultural shifts. Restorations
              in the 20th century ensured its preservation without compromising its
              original charm. The temple played a vital role in promoting Kalaripayattu
              and other cultural expressions, while its rituals and festivals have
              inspired art and literature.
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" class="text-white font-weight-bold" large>
            Learn More sds
          </v-btn>
          <v-btn outlined color="teal-darken-4" large> Book Pooja </v-btn>
        </v-card-actions>
      </template>
    </v-hover>
  </div>
</template>

<script setup>
// defineEmits(["update_isHovering"]);

// const handleMouseLeave = () => {
//   // Emit the event to notify the parent
//   emit("update_isHovering", false);
// };

import { computed, ref } from "vue";

const { $i18n } = useNuxtApp();

// Props or dynamic data
const templeName = ref("Lokanarkavu Temple"); // Change dynamically
// Prime Deity Data
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

.icon-align {
  margin-top: 0;
}

.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
  color: black;
}
</style>
