// plugins/pinia-plugin-persistedstate.client.ts
import { defineNuxtPlugin } from '#app';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin((nuxtApp) => {
  // Ensure the Pinia instance exists in nuxtApp
  const pinia = nuxtApp.$pinia;
  pinia.use(piniaPluginPersistedstate);
});
