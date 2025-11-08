export const useCounterStore = defineStore('counter', () => {
    const count = ref(10);
    const name = ref('Eduardo');
    const doubleCount = computed(() => count.value * 2);
  
    function increment() {
      count.value++;
    }
  
    return { count, name, doubleCount, increment };
  }, {
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
  