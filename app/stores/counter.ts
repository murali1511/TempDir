// stores/counter.ts

import { defineStore } from "pinia";

export const useCounterStore = defineStore("c", {
  state: () => ({
    count: 20,
  }),
  actions: {
    incrementCounter() {
      this.count++;
    },
  },
  persist: {
    enabled: true, // Enable persistence for this store
    strategies: [
      {
        key: 'counter', // Custom key for localStorage
        storage: localStorage, // Use localStorage (default)
      },
    ],
  },
});
