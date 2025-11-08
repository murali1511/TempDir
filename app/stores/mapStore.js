import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore(
  "MapStore",
  () => {
    const Currentlocation = ref([10, 10]);
    const CurrentlocationDetail = ref(null);
    const searchResults = ref([]);

    // NEW: Fetch search results from MapTiler geocoding
    const search_Location = async (query) => {
      const MAPTILER_API_KEY = "hU04pPUrkhtGjP8cQtD8";
      const endpoint = `https://api.maptiler.com/geocoding/${encodeURIComponent(
        query
      )}.json?key=${MAPTILER_API_KEY}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();
        searchResults.value = data.features; // GeoJSON features array
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      }
    };

    const update_Location = (feature) => {
      Currentlocation.value = feature.geometry.coordinates;
      CurrentlocationDetail.value = feature;
    };

    const set_Currentlocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;

              Currentlocation.value = [longitude, latitude];
              console.log("Store Updated:", Currentlocation.value); // Debugging

              try {
                CurrentlocationDetail.value = await getLocationName(
                  latitude,
                  longitude
                );
                resolve(CurrentlocationDetail.value);
              } catch (error) {
                CurrentlocationDetail.value = "Unable to fetch location name";
                reject(error);
              }
            },
            () => {
              CurrentlocationDetail.value = "Geolocation access denied";
              reject(new Error("Geolocation access denied"));
            }
          );
        } else {
          CurrentlocationDetail.value = "Geolocation not supported by browser";
          reject(new Error("Geolocation not supported"));
        }
      });
    };

    const getLocationName = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Network response was not OK");
        }

        const data = await response.json();
        return data; // ✅ Return human-readable location name
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    return {
      Currentlocation,
      CurrentlocationDetail,
      set_Currentlocation,
      update_Location,
      search_Location,
      searchResults,
    };
  },
  { persist: true }
);
