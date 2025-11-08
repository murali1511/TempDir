<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" variant="flat" class="ml-n3">
        <v-icon>mdi-account-convert</v-icon>
        <div class="ml-8 text-capitalize">{{ `Role (${role})` }}</div>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="rounded-lg">
        <v-card-title class="text-body-1 text-center bg-red lighten-2">
          Change Role
        </v-card-title>
        <v-card-text>
          <div v-html="message"></div>
        </v-card-text>
        <div>
          <v-radio-group v-model="active_role" inline class="align-center">
            <v-radio label="Devotee" value="devotee"></v-radio>
            <v-radio label="Researcher" value="research"></v-radio>
            <v-radio label="Art Lover" value="art"></v-radio>
          </v-radio-group>
        </div>

        <v-card-actions>
          <v-btn
            text="Change"
            @click="
              {
                update_role();
                isActive.value = false;
              }
            "
            class="bg-indigo lighten-6 rounded-xl"
            size="small"
          ></v-btn>
          <v-btn
            text="Return"
            @click="isActive.value = false"
            class="bg-indigo lighten-6 rounded-xl"
            size="small"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { defineProps } from "vue";
import { dbStore } from "~/composables/dbStore";
const { role, set_role } = dbStore();
const active_role = ref(role.value);
const props = defineProps({
  message: { type: String },
});
const update_role = () => {
  set_role(active_role.value);
};
</script>
