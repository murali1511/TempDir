<template>
<div class="expansion-panels-wrapper">
<v-expansion-panels v-model="activePanel" class="mb-6" variant="accordion" >
  <v-expansion-panel v-for="(group, index) in groupedPoojaTimes" :key="index"   >
    <v-expansion-panel-title expand-icon="mdi-menu-down"  :style="getGradientStyle(group.title.time)" class=" text-body-1">
      {{ timeString(group.title.time) }} {{group.title.event}}
    </v-expansion-panel-title>
    <v-expansion-panel-text color="red">
      <ul>
        <li v-for="item in group.items" :key="item.time" class="mt-1 text-body-1">
          {{ timeString(item.time) }} - {{ item.event }}
        </li>
      </ul>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels></div>
</template>
<script setup>
import { ref, computed } from "vue";

const { $i18n } = useNuxtApp();
const PoojaTimes_en = [
  { time: "04.00AM", event: "Opening of Sanctum(Sree Kovil)", color: "green", size: "large" },
  { time: "04.30AM", event: "Abhishekam", color: "orange", size: "small" },
  { time: "05.00AM", event: "Usha Pooja", color: "orange", size: "small" },
  { time: "05.30AM", event: "Ethruthu pooja", color: "orange", size: "small" },
  { time: "06.15AM", event: "Closing", color: "red", size: "small" },
  { time: "07.15AM", event: "Opening", color: "green", size: "small" },
  { time: "07.30AM", event: "Seeveli", color: "orange", size: "small" },
  { time: "08.00AM", event: "Closing & Pantheeradi pooja", color: "red", size: "small" },
  { time: "08.30AM", event: "Opening", color: "green", size: "small" },
  { time: "11.30AM", event: "Closing 12.00PM", color: "red", size: "large" },
  { time: "04.30PM", event: "Opening", color: "green", size: "large" },
  { time: "07.00PM", event: "Deeparadhana & Niveddyam. Athazha Pooja", color: "orange", size: "small" },
  { time: "07.45PM", event: "Athazha siveeli & Closing for the day.", color: "red", size: "large" },
  
];

const PoojaTimes_ml = [
  { time: "04.00AM", event: "ശ്രീകോവിൽ തുറക്കൽ", color: "green", size: "large" },
  { time: "04.30AM", event: "അഭിഷേകം", color: "orange", size: "small" },
  { time: "05.00AM", event: "ഉഷ പൂജ", color: "orange", size: "small" },
  { time: "05.30AM", event: "എത്രുതു പൂജ", color: "orange", size: "small" },
  { time: "06.15AM", event: "നട അടയ്ക്കൽ", color: "red", size: "small" },
  { time: "07.15AM", event: "നട തുറക്കൽ", color: "green", size: "small" },
  { time: "07.30AM", event: "ശീവേലി", color: "orange", size: "small" },
  { time: "08.00AM", event: "നട അടയ്ക്കൽ & പന്തീറടി പൂജ", color: "red", size: "small" },
  { time: "08.30AM", event: "നട തുറക്കൽ", color: "green", size: "small" },
  { time: "11.30AM", event: " നട അടയ്ക്കൽ", color: "red", size: "large" },
  { time: "04.30PM", event: "നട തുറക്കൽ", color: "green", size: "large" },
  { time: "07.00PM", event: "ദീപാരാധന & നിവേദ്യം.  അത്താഴ പൂജ", color: "orange", size: "small" },
  { time: "07.45PM", event: "ശീവേലി & നട അടയ്ക്കൽ.", color: "red", size: "large" },
];

const pooja_darsan = ref($i18n.locale.value==='en'? PoojaTimes_en:PoojaTimes_ml);

// Group PoojaTimes by green color
const groupedPoojaTimes = computed(() => {
  const groups = [];
  let currentGroup = null;

  pooja_darsan.value.forEach((poojaTime) => {
    if (poojaTime.color === "green") {
      // Start a new group
      currentGroup = { title: poojaTime, items: [] ,event: poojaTime.event};
      groups.push(currentGroup);
    } else if (currentGroup) {
      // Add to the current group
      currentGroup.items.push(poojaTime);
    }
  });

  return groups;
});

const timeString = (time) => {
  // Format the time string if needed
  return time;
};
// Active panel index
const activePanel = ref(null);


// Helper function to generate gradient styles based on time
const getGradientStyle = (time) => {
  const hour = parseInt(time.split(":")[0], 10); // Extract the hour
  if (time.includes("AM")) {
    if (hour >= 4 && hour < 7) {
      // Early Morning
      return { background: "linear-gradient(to right, gray, orange, white)" };
    } else if (hour >= 7 && hour < 12) {
      // Late Morning
      return { background: "linear-gradient(to right, white, #4287f5)" };
    }
  } else if (time.includes("PM")) {
    if (hour >= 12 && hour < 6) {
      // Afternoon
      return { background: "linear-gradient(to right, yellow, orange)" };
    } else if (hour >= 6 && hour <= 8) {
      // Evening
      return { background: "linear-gradient(to right, purple, black)" };
    }
  }
  // Default color
  return { background: "linear-gradient(to right, #4287f5, orange,grey)" };
};



</script>
<style scoped>
.expansion-panels-wrapper {
  max-width: 600px;
  margin: 0 auto; /* Center horizontally */
}
</style>