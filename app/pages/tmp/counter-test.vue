<template>
  <h1 class="mt-10">PINIa Child</h1>
  <p>Counter: {{ store.count }}</p>
  <v-btn @click="increment">increment</v-btn>
  <v-btn @click="backpage">Back Page</v-btn>
</template>
<script setup>
import { useCounterStore } from "@/stores/count";
const store = useCounterStore();
// const count = computed(() => store.count);
// const { count } = storeToRefs(store);
const increment = store.increment;
const backpage = () => {
  navigateTo("/pinia-index", { redirectCode: 301 });
};
</script>
