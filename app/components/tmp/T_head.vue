<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12 rounded-xl mt-n10"
    :color="colorScheme[1]"
    max-width="750"
    :style="`background: linear-gradient(to right,${colorScheme[0]},#735943,${colorScheme[1]},${colorScheme[1]},${colorScheme[1]},${colorScheme[1]},#735943,${colorScheme[0]})`"
  >
    <v-img
      max-height="400"
      :src="`/images/${
        $i18n.locale.value == 'en'
          ? localStore.carouselDetail.en[0].image
          : localStore.carouselDetail.ml[0].image
      }`"
      cover
    ></v-img>
    <v-card-item>
      <v-card-title
        class="text-center"
        :class="
          getStyle('text-body-2', 'text-caption', 'text-subheading-2', 'text-body-1')
        "
        >{{
          $i18n.locale.value == "en" ? localStore.name.en : localStore.name.ml
        }}</v-card-title
      >
      <p
        class="mb-3 mt-2 text-center"
        :class="$i18n.locale.value == 'en' ? 'text-body-2' : 'text-caption'"
      >
        {{ $i18n.locale.value == "en" ? localStore.Address.en : localStore.Address.ml }}
      </p>

      <div class="text-center">
        <v-card-subtitle
          class="mt-4 d-inline mr-2 text-subtitle-1"
          :style="`color:${colorScheme[0]};`"
          :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
          >{{ $t("t_head.popularity") }}</v-card-subtitle
        >
        <v-btn density="compact" size="small" color="error" icon="mdi-fire-circle">
        </v-btn>

        <v-rating
          :model-value="4.5"
          color="red"
          density="compact"
          size="small"
          class="pt-1 d-inline ml-2"
          half-increments
          readonly
        ></v-rating>
        <div class="text-grey ms-4 d-inline">4.5 (413)</div>
      </div>
    </v-card-item>

    <div class="text-center">
      <v-card-subtitle
        class="mt-4 d-inline mr-n2 text-subtitle-1"
        :style="`color:${colorScheme[0]};`"
        :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
        >{{ $t("t_head.deity") }}</v-card-subtitle
      >
      <v-btn density="compact" size="small" color="error" icon="mdi-temple-hindu">
      </v-btn>
      <span class="ml-2 text-body-2 font-weight-bold"
        >{{ localStore.deities.primedeity.name.en }},
      </span>
      <span class="text-caption"
        >{{
          localStore.deities.subdeities.map((subdeity) => subdeity.name.en).join(", ")
        }}
      </span>

      <v-card-subtitle
        class="mt-4 d-inline mr-n2 text-subtitle-1"
        :style="`color:${colorScheme[0]};`"
        :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
        >{{ $t("t_head.visit") }}</v-card-subtitle
      >
      <v-btn
        density="compact"
        size="small"
        color="error"
        icon="mdi-clock-time-eight-outline"
      >
      </v-btn>
      <span class="ml-2 text-body-2 font-weight-bold"
        >Open {{ localStore.VisitPreference.visit }},
        {{ localStore.VisitPreference.season }} season
      </span>
      <div class="mt-2">
        <v-card-subtitle
          class="mt-4 d-inline mr-n2 text-subtitle-1"
          :style="`color:${colorScheme[0]};`"
          :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
          >{{ $t("t_head.accessibility") }}</v-card-subtitle
        >
        <v-btn density="compact" size="small" color="error" icon="mdi-door-open"> </v-btn>

        {{
          localStore.VisitPreference.difficulty == "low"
            ? "Easy to reach"
            : localStore.VisitPreference.difficulty == "medium"
            ? "Need to walk"
            : "Need more walk"
        }}
      </div>
    </div>

    <v-divider class="mt-2"></v-divider>
    <v-card-subtitle
      class="mt-2 text-center text-subtitle-1"
      :style="`color:${colorScheme[0]};`"
      :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
      >{{ $t("t_head.timing") }}</v-card-subtitle
    >
    <div class="pl-4 mt-n1 d-flex justify-center text-center align-center">
      <v-chip-group selected-class="bg-deep-purple-lighten-2">
        <div v-for="(schedule, index) in localStore.open_close" :key="index">
          <v-chip size="small" variant="elevated">{{ schedule }}</v-chip>
          <!-- <v-chip size="small" variant="elevated">5:30PM - 8:30PM</v-chip> -->
        </div>
      </v-chip-group>
    </div>
    <v-card-subtitle
      class="mt-2 text-center"
      :style="`color:${colorScheme[0]};`"
      :class="getStyle('text-body-1', 'text-body-2', 'text-body-1', 'text-body-2')"
      >{{ $t("t_head.events") }}</v-card-subtitle
    >

    <div class="px-4 mb-2 text-body-2 text-center align-center">
      <p>No special Events</p>
    </div>

    <v-card-actions>
      <v-btn color="deep-purple-lighten-2" text="Reserve" block border @click=""></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useLocalStore } from "/stores/localStore.js";
import { dbStore } from "~/composables/dbStore";
import { setStyle } from "/utils/setStyle.js";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { $i18n } = useNuxtApp();
const select = ref("");
const localStore = useLocalStore();
localStore.Fetch_Temple();

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const loading = ref(false);
const selection = ref(1);

const getStyle = (style_t_en, style_t_ml, style_f_en, style_f_ml) => {
  return setStyle(
    $i18n.locale.value,
    mobile.value,
    style_t_en,
    style_t_ml,
    style_f_en,
    style_f_ml
  );
};
</script>
