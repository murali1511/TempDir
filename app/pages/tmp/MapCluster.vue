<template>
  <v-toolbar class="px-2 card_radiant">
          <v-text-field
            v-model="search"
            density="compact"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 400px"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>

          <v-text-field
            class="ml-2 number-input"
            v-model="geo_distance"
            prepend-inner-icon="mdi-road"
            density="compact"
            style="max-width: 140px"
            type="number"
            variant="solo"
            hide-details
            single-line
             prefix="km"
             step="0.5"
      min="0"
      

          </v-text-field>
 <v-btn 
       color="primary"
       text="Clear"
        class="ml-2"
        rounded="lg"
        variant="elevated"
        @click="clear_filter"
       ></v-btn>

          <template v-slot:prepend-inner>
    <span class="text-grey-darken-1">km</span>
  </template> 
        </v-toolbar>

  <div id="map" class="map-container"></div>

    <!-- Hidden popup content -->
  <div ref="popupContent" class="popup-content"   :style="{display: showPopup}">
  <v-card
    class="mx-auto"
    max-width="400"
  >
      <v-card-title class="text-caption text-center"> {{temple?temple.properties.name:""}}</v-card-title>

    <v-img
      class="align-end text-white"
      height="200"
      :src="`/images/${temple?temple.properties.home_pic:'KL13-1'}.jpg`"
      cover
    >
    </v-img>

    <v-card-subtitle class="pt-4 text-center text-caption">
Distance: {{ distance_from_center.toFixed(1) }} km
    </v-card-subtitle>

    <v-card-text class="text-center text-caption">
      <div>   {{temple?temple.properties.address:""}}</div>

    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn color="orange" text="More" @click="navigate_home(temple.properties.TID)"></v-btn>
    </v-card-actions>
  </v-card>

    <!-- {{temple.properties.name}} -->
  </div>
</template>

<script setup>
definePageMeta({
  layout: "group",
  middleware: "auth",
});

import { onMounted, ref  } from 'vue';
import maplibregl from 'maplibre-gl';
import features from "/stores/stores_geojson.js"
import * as turf from "@turf/turf";
import { useLocalStore } from "/stores/localStore.js";
import { dbStore } from "~/composables/dbStore";

const localStore = useLocalStore();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
// import img0 from '/assets/diety_img/ganapathi_mini.png';
const zoom_level = ref(0)
const popupContent = ref(null); // Define a reference for the popup
const temple = ref(null)
const search = ref("");
const geo_distance = ref((parseFloat(0).toFixed(1)));
const map = ref(null)
const showPopup = ref("none"); // ✅ Reactive state for popup visibility
const filteredFeatures = ref(features)
const center = ref( [75.635355, 11.668879])
const distance_from_center =  ref(0);
const popup = ref(null)

// Ensure this runs only on the client side
onMounted(() => {
  localStore.setpageType="map"
  map.value = new maplibregl.Map({
    container: 'map', // ID of the div element
    // style: 'https://demotiles.maplibre.org/style.json', // Free demo style from MapLibre
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=hU04pPUrkhtGjP8cQtD8', // Replace with your key
    center: center.value, // Initial center [lng, lat]
    zoom: 1, // Initial zoom level
  });

  // Add navigation controls (zoom and rotation)
  map.value.addControl(new maplibregl.NavigationControl());

map.value.on('load', async () => {
   zoom_level.value = map.value.getZoom()

// // Load_Icon_Image(map)
//   // Load a custom icon image
const icons = ['ganapathi', 'shiva', 'krishna', 'ayyappan', 'durga','murugan','muttappan','nagaraja','narasimha','vishnu','bhagavathi','kuttichattan'];
await Promise.all(
  icons.map(async (icon) => {
    try {
      const image = await map.value.loadImage(`/diety_img/${icon}_mini.png`);
      map.value.addImage(icon, image.data); // No need for `.data`
    } catch (error) {
      console.error(`Error loading image ${icon}:`, error);
    }
  })
);

 // Load multiple deity icons before adding sources
    



    map.value.addSource('heritageSites', {
      type: 'geojson',
      data: filteredFeatures.value,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.value.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'heritageSites',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      },
    });

    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'heritageSites',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    // Unclustered points with custom icon
    map.value.addLayer({
      id: 'unclustered-point',
      type: 'symbol',
      source: 'heritageSites',
      filter: ['!', ['has', 'point_count']],
      layout: {
                    "icon-image": ['get', 'main', ['get', 'diety']],
     'icon-size': [
    'interpolate',
    ['linear'], ['zoom'],
    4, 0.1,   // Small at zoom level 4
    5, 0.125,   // Small at zoom level 4
    6, 0.15,   // Slightly bigger at zoom level 8
    7, 0.175,   // Slightly bigger at zoom level 8
    8, 0.2,   // Slightly bigger at zoom level 8
    9, 0.225,   // Slightly bigger at zoom level 8
    10, 0.25,   // Slightly bigger at zoom level 8
    11, 0.275,   // Slightly bigger at zoom level 8
    12, 0.3,   // Slightly bigger at zoom level 8
    13, 0.325,   // Slightly bigger at zoom level 8
    14, 0.35,  // Medium size at zoom level 12
    15, 0.375,   // Slightly bigger at zoom level 8
    16, 0.4,  // Standard size at zoom level 16
    17, 0.425,   // Slightly bigger at zoom level 8
    18, 0.45,  // Standard size at zoom level 16
    19, 0.475,   // Slightly bigger at zoom level 8
    20, 0.5 ,  // Largest at zoom level 20
    21, 0.55,   // Slightly bigger at zoom level 8
    22, 0.6   // Largest at zoom level 20
  ],
        'icon-allow-overlap': true, // Prevent icons from hiding when close
      },
    });

    map.value.on('click', 'clusters', (e) => {
      const features = map.value.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.value.getSource('heritageSites').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.value.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
    });

    map.value.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const name = e.features[0].properties.name;
      temple.value = e.features[0]
      distance_from_center.value = turf.distance(center.value, e.features[0].geometry.coordinates, { units: "kilometers" });

      console.log("e.features[0]", e.features[0]);
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
      showPopup.value = "block"; // ✅ Show popup when a marker is clicked

      popup.value = new maplibregl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popupContent.value) // ✅ Use Vue ref correctly

        .addTo(map.value);
       
    });


    map.value.on('mouseenter', 'clusters', () => { map.value.getCanvas().style.cursor = 'pointer'; });
    map.value.on('mouseleave', 'clusters', () => { map.value.getCanvas().style.cursor = ''; });
    map.value.on('mouseenter', 'unclustered-point', () => { map.value.getCanvas().style.cursor = 'pointer'; });
    map.value.on('mouseleave', 'unclustered-point', () => { map.value.getCanvas().style.cursor = ''; });
  });

  map.value.on('error', (e) => {
    console.error('Map error:', e);
  });
  
  map.value.on('zoom', () => {
     zoom_level.value = map.value.getZoom()
  })
});

const clear_filter =() => {
  search.value = "";
 geo_distance.value = 0;
}



const navigate_home = (selected) => {
  if (selected !=="") {
     localStore.setTempleID(selected);
     localStore.setTemplesSource('/tmp/MapCluster')
     navigateTo("/tmp/home4");
  } else {
     alert("No Details Available for the selected temple")
  }
};

// **Reactive Filtering for Search & Distance**

  watch([search, geo_distance], () => {
  if (!map.value || !map.value.getSource("heritageSites") || !features.features) return;

  let filtered = features.features;

  // ✅ Filter by search query
  // If search is empty, reset it to an empty string
  search.value = search.value?.trim() || "";

  if (search.value) {
    const query = search.value.toLowerCase();
    filtered = filtered.filter((f) => f.properties.name.toLowerCase().includes(query));
  }

  // ✅ Filter by geo-distance (if > 0)
  if (geo_distance.value > 0) {
    filtered = filtered.filter((f) => {
      const distance = turf.distance(center.value, f.geometry.coordinates, { units: "kilometers" });
      return distance <= geo_distance.value;
    });
  }

//popup close if opened
if (popup.value) {
    popup.value.remove(); // ✅ Close the popup
    popup.value = null;  // Reset the reference
  }

  // ✅ Update Map Source
  map.value.getSource("heritageSites").setData({
    type: "FeatureCollection",
    features: filtered,
  });
});



</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh; /* Full viewport height */
  margin: 0;
  padding: 0;
}

.card_radiant {
background: linear-gradient(to right,  #735943,v-bind(colorScheme[1]),v-bind(colorScheme[0]),v-bind(colorScheme[1]),#735943)
}
</style>