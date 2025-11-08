<template>
  

<v-dialog max-width="500">

    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="indigo"
        text="?"
        variant="flat"
        icon
        size=" small"
        class="ml-2 ttext-h6 rounded-xl"
    
      ></v-btn>
    </template>
  
    <template v-slot:default="{ isActive }">
      <v-card  class="rounded-lg">
        <v-card-title class="text-body-1 text-center bg-red lighten-2" >
          Instructions for Devotees
        </v-card-title>
        <v-card-text>
          <div v-html="message"></div>
        </v-card-text>
  
        <v-card-actions>
          <v-btn
            text="Close"
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
import { defineProps } from 'vue';
const props = defineProps({
  message : {type: String}   
})
</script>