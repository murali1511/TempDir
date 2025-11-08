<script setup>
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
localStore.fetchData(); // Fetch data on component mount
const changeID = () => {
  localStore.setTempleID("T0001");
  //   localStore.fetchData();
};
</script>

<template>
  <div>
    <h1>Temple Name: {{ localStore.name.ml }}</h1>
    <h1>Temple ID: {{ localStore.templeID }}</h1>
    <v-btn @click="changeID">Change</v-btn>
  </div>
</template>
