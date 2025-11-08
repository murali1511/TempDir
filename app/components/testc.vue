<template>
  <div>
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <div class="text-container" v-bind="props">
          <v-card :color="Main_hovering ? colorScheme.bg_r : colorScheme.bg">
            <!-- Image -->
            <v-img
              src="/logo-10-tr1.png"
              height="150"
              width="150"
              class="rounded float-left mr-1 mb-n2"
              alt="Health and Safety"
            ></v-img>

            <!-- Text -->
            <p
              class="text-body-2 text-justify mx-2 pa-1"
              :style="`color:
                ${Main_hovering ? colorScheme.font_r : colorScheme.font}`"
            >
              Lokanarkavu Temple, established around the 14th century, holds a significant
              place in Kerala’s spiritual and cultural history. Founded by the Nair
              community, renowned for their martial traditions, the temple is closely
              associated with the legendary warrior Thacholi Othenan. Its traditional
              Kerala architecture, featuring sloping tiled roofs, intricate wooden
              carvings, and murals, showcases the artistic excellence of the time.
            </p>

            <p
              class="text-body-2 text-justify mx-2 pa-1"
              :style="`color:
                ${Main_hovering ? colorScheme.font_r : colorScheme.font}`"
            >
              Over centuries, the temple has witnessed historical milestones, serving as a
              spiritual haven during periods of unrest and cultural shifts. Restorations
              in the 20th century ensured its preservation without compromising its
              original charm. The temple played a vital role in promoting Kalaripayattu
              and other cultural expressions, while its rituals and festivals have
              inspired art and literature.
            </p>
          </v-card>
        </div>
      </template>
    </v-hover>
  </div>
</template>
<script setup>
import { ref, watch, defineAsyncComponent, defineProps } from "vue";
import { dbStore } from "~/composables/dbStore";
const { Main_hovering, update_Main_hovering, colorScheme } = dbStore();
</script>
