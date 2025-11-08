<template>
  <v-container fluid>
    <!-- Section Title -->
    <v-row justify="center" class="mb-2">
      <v-col cols="12" md="8">
        <v-card color="teal-darken-4" class="rounded-lg" elevation="5">
          <v-card-text class="text-center text-subtitle-1 text-white font-weight-bold bg-black">
            Temple Architecture Exploration Questionnaire
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Questionnaire Content -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Question 1 -->
        <v-card outlined class="mb-6">
           <v-card-text class="font-weight-bold text-subtitle-2">1. നിലവിലുള്ള പൂജകളുടെ എണ്ണവും, അതിന്‍റെ സമയക്രമവും</v-card-text>
          <v-divider></v-divider>
          <v-card-text> 
            <v-checkbox v-for="pooja in poojaTimings" :key="pooja" v-model="answers.poojaTimings" :label="pooja" :value="pooja" color="teal" class=" mt-n4 mb-n10"></v-checkbox>
          </v-card-text>
        </v-card>

        <!-- Question 2 -->
        <v-card outlined class="mb-6">
           <v-card-text class="font-weight-bold text-subtitle-2">2. അമ്പലത്തിന്‍റെ പഴമ</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-radio-group v-model="answers.templeAge" color="teal">
              <v-radio v-for="option in templeAgeOptions" :key="option" :label="option" :value="option" class="mb-0"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Question 3 -->
        <v-card outlined class="mb-6">
               <v-card-text class="font-weight-bold text-subtitle-2">3. അമ്പല ഭൂമിയുടെ സ്വഭാവം</v-card-text>

          <v-divider></v-divider>
          <v-card-text>
            <v-checkbox v-for="terrain in templeTerrain" :key="terrain" v-model="answers.terrain" :label="terrain" :value="terrain" color="teal" class=" mt-n4 mb-n10"></v-checkbox>
          </v-card-text>
        </v-card>

        <!-- Question 4 -->
        <v-card outlined class="mb-6">
           <v-card-text class="font-weight-bold text-subtitle-2">4. പ്രധാന പ്രതിഷ്ഠയുടെ പ്രത്യേകത</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-checkbox v-for="feature in deityFeatures" :key="feature" v-model="answers.deityFeatures" :label="feature" :value="feature" color="teal" class=" mt-n4 mb-n10"></v-checkbox>
          </v-card-text>
        </v-card>

        <!-- Question 5 -->
        <v-card outlined class="mb-6">
          <v-card-text class="font-weight-bold text-subtitle-2">5. അമ്പല നിര്‍മ്മാണം ഏതുതരം</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-checkbox v-for="style in templeStyles" :key="style" v-model="answers.templeStyles" :label="style" :value="style" color="teal" class=" mt-n4 mb-n10"></v-checkbox>
          </v-card-text>
        </v-card>

        <!-- Question 6 -->
        <v-card outlined class="mb-6">
          <v-card-text class="font-weight-bold text-subtitle-2">6. അമ്പല രൂപരേഖ - Pancha-praakaaras</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-checkbox v-for="layout in templeLayouts" :key="layout" v-model="answers.templeLayouts" :label="layout" :value="layout" color="teal" class=" mt-n4 mb-n10"></v-checkbox>
          </v-card-text>
        </v-card>

        <!-- Question 7 -->
        <v-card outlined class="mb-6">
          <v-card-text class="font-weight-bold text-subtitle-2">7. ശ്രീകോവിൽ ടൈപ്പ്</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-radio-group v-model="answers.sreekovilType" color="teal">
              <v-radio v-for="type in sreekovilTypes" :key="type" :label="type" :value="type" class=" mb-0"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Question 8 -->
        <v-card outlined class="mb-6">
          <v-card-text class="font-weight-bold text-subtitle-2">8. ശ്രീകോവിൽ നിലകൾ</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
                     <v-radio-group v-model="answers.sreekovilFloors" color="teal">
              <v-radio v-for="floor in sreekovilFloors" :key="floor" :label="floor" :value="floor"></v-radio>
            </v-radio-group>            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Questionnaire options
const poojaTimings = ["usha-pooja", "ethrthth-pooja", "pantheerati-pooja", "uccha-paoja", "aththaazha-pooja"];
const templeAgeOptions = [
  "Very ancient - Prior to two thousand years",
  "Ancient - First to ninth century A.D",
  "Tenth to Thirteenth century",
  "Fourteenth to Sixteenth century A.D",
  "Seventeenth to Nineteenth century A.D",
  "Twentieth century A.D. (till 1993 A.D.)",
  "Antiquity not reported",
];
const templeTerrain = ["Plain Land", "Hill", "Forest", "Seashore", "Cave", "Island"];
const deityFeatures = [
  "Shaiee (stone)",
  "Darumayee (wood)",
  "Lohi (Metal)",
  "Lepya (Mix of Adhesives)",
  "Lakhanu Saikathee (Etching)",
  "Manomayee (Sand)",
  "Maniyee Prathima (Imagination)",
  "Astha vidhaha smruthaha (Gemstone)",
];
const templeStyles = ["Nagara", "Dravida", "Vesara", "Kerala", "Kalinga", "Himalayan", "Gadag", "Maru Gurjara"];
const templeLayouts = ["akaththe-balivattam", "Antha-haara", "Madhya-haara", "Baahya-haara", "Maryaada"];
const sreekovilTypes = [
  "Square (sama-chathura)",
  "Rectangular (deergha-chathura)",
  "Circular (vritha)",
  "Elliptical or oval",
  "Apsidal (gaja-prshrha)",
];
const sreekovilFloors = ["Eka-thala", "Dwi-thala", "thri-thala"];

// User answers
const answers = ref({
  poojaTimings: [],
  templeAge: "",
  terrain: [],
  deityFeatures: [],
  templeStyles: [],
  templeLayouts: [],
  sreekovilType: "",
  sreekovilFloors: "",
});
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-card-title {
  color: #003366;
}

.v-checkbox,
.v-radio {
  margin: 5px 0;
}
</style>
