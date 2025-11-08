<template>
  <!-- <v-container fluid> -->
      <!-- Temple Name Section -->
      

      <!-- Temple Origins Section -->
      <section id="Temple_Origins" >
      <v-row justify="center" class="mb-6">
          <v-col cols="12" md="10">
              <v-card elevation="5" color="secondary" class="pa-2    rounded-lg">
                  <v-card-title class=" font-weight-bold d-flex justify-space-between align-center dynamic-subtitle">
                      Temple Origins
                      <v-btn variant="text" color="blue-darken-4" icon="mdi-eye-outline" @click="toggleContent(0)">
                          <v-icon size="large">{{ isSummary[0] ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
                      </v-btn>
                  </v-card-title>
                  <v-card-text>
                      <v-divider></v-divider>

                      <v-row>
                          <v-col cols="12" sm="6">
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Founding
                                  Period</v-subheader>
                              <p class="text-justify">
                                  {{
                                      isSummary[0] ? templeData.templeOrigins.foundingPeriod :
                                          templeData.templeOrigins.D_foundingPeriod
                                  }}
                              </p>
                          </v-col>
                          <v-col cols="12" sm="6">
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Dynasties or Kings
                                  Involved</v-subheader>
                              <p class="text-justify">
                                  {{
                                      isSummary[0] ? templeData.templeOrigins.dynastiesInvolved :
                                          templeData.templeOrigins.D_dynastiesInvolved
                                  }}
                              </p>
                          </v-col>
                      </v-row>
                      <v-row>
                          <v-col cols="12">
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Architectural
                                  Evolution</v-subheader>
                              <p class="text-justify">
                                  {{
                                      isSummary[0] ? templeData.templeOrigins.architecturalEvolution :
                                          templeData.templeOrigins.D_architecturalEvolution
                                  }}
                              </p>
                          </v-col>
                      </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
</section>
      <!-- Cultural and Religious Significance Section -->
      <v-row justify="center" class="mb-6">
          <v-col cols="12" md="10">
              <v-card elevation="5" color="light-green lighten-5" class="pa-0 rounded-lg">
                  <v-card-title
                      class="font-weight-bold d-flex justify-space-between align-center dynamic-subtitle">Cultural
                      and Religious Significance
                      <v-btn variant="text" color="blue-darken-4" @click="toggleContent(1)" density="default"
                          :icon="isSummary[1] ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></v-btn>

                  </v-card-title>

                  <v-card-text>
                      <v-divider></v-divider>
                      <v-row>
                          <v-col cols="12" sm="6">
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Primary Deity</v-subheader>
                              <p class="text-justify">
                                  {{
                                      isSummary[1] ? templeData.culturalSignificance.primaryDeity :
                                          templeData.culturalSignificance.D_primaryDeity
                                  }}
                              </p>
                          </v-col>
                          <v-col cols="12" sm="6" >
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Role in
                                  Festivals</v-subheader>
                              <p class=" text-justify" v-if="isSummary[1]">{{
                                  templeData.culturalSignificance.roleInFestivals }}</p>
                              <span v-else v-for="item in templeData.culturalSignificance.D_roleInFestivals">
                                  <p class="pb-2 text-justify"><span class="font-weight-bold">{{ item.para }}: </span>
                                      <span class="pb-2 text-justify">{{ item.content }}</span>
                                  </p>
                              </span>
                          </v-col>
                          <!-- </v-row>
                      <v-row> -->
                          <v-col cols="12">
                              <v-subheader class="dynamic-sub-subtitle text-grey-darken-4">Temple
                                  Rituals</v-subheader>
                              <p class="text-justify">
                                  {{
                                      isSummary[1] ? templeData.culturalSignificance.templeRituals :
                                          templeData.culturalSignificance.D_templeRituals
                                  }}
                              </p>
                          </v-col>
                      </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>

      <!-- Mythology Section -->
      <v-row justify="center" class="mb-6">
          <v-col cols="12" md="8">
              <v-card elevation="5" color="red lighten-5" class="pa-0 rounded-lg">
                  <v-card-title class=" d-flex justify-space-between align-center dynamic-title">Mythology
                      <v-btn variant="text" color="black" @click="toggleContent(2)" density="default"
                          :icon="isSummary[2] ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></v-btn>

                  </v-card-title>

                  <!-- Mythology Section -->

                  <v-card-text>
                      <p class="pb-2 text-justify"><span class="dynamic-subtitle ">Legends</span> </p>
                      <p class="pb-2 text-justify">{{
                          isSummary[2] ? templeData.culturalSignificance.mythology.legends :
                              templeData.culturalSignificance.mythology.D_legends
                      }}</p>

                      <p class="pb-2 "><span class="dynamic-subtitle ">Divine Interventions</span></p>
                      <p class="pb-2 text-justify">{{
                          isSummary[2] ? templeData.culturalSignificance.mythology.divineInterventions :
                              templeData.culturalSignificance.mythology.D_divineInterventions
                      }}</p>

                      <p class="pb-2  font-weight-bold"><span class="dynamic-subtitle">Connections to Epics</span></p>
                      <p class="pb-2 text-justify">{{
                          isSummary[2] ? templeData.culturalSignificance.mythology.connectionsToEpics :
                              templeData.culturalSignificance.mythology.D_connectionsToEpics
                      }}</p>
                  </v-card-text>

              </v-card>
          </v-col>
      </v-row>

      <!-- Architecture Section -->
      <v-row justify="center" class="mb-6">
          <v-col cols="12" md="8">
              <v-card elevation="5" color="amber lighten-5" class="pa-0 rounded-lg">
                  <v-card-title class=" d-flex justify-space-between align-center dynamic-title">Architecture and
                      Archaeology
                      <v-btn variant="text" color="black" @click="toggleContent(3)" density="default"
                          :icon="isSummary[3] ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></v-btn>

                  </v-card-title>

                  <v-card-text>

                      <p class="pb-2 text-justify"><span class="dynamic-subtitle ">Architecture</span> </p>
                      <p class="pb-2 text-justify">{{
                          isSummary[3] ? templeData.architecture.style :
                              templeData.architecture.D_style
                      }}</p>

                      <p class="pb-2 "><span class="dynamic-subtitle ">Inscriptions and Artifacts</span></p>
                      <p class="pb-2 text-justify">{{
                          isSummary[3] ? templeData.architecture.inscriptions :
                              templeData.architecture.D_inscriptions
                      }}</p>

                      <p class="pb-2  font-weight-bold"><span class="dynamic-subtitle">Restorations and
                              Renovations</span></p>
                      <p class="pb-2 text-justify">{{
                          isSummary[3] ? templeData.architecture.restorations :
                              templeData.architecture.D_restorations
                      }}</p>


                  </v-card-text>

              </v-card>
          </v-col>
      </v-row>

      <!-- Social and Historical Context Section -->
      <v-row justify="center" class="mb-6">
          <v-col cols="12" md="8">
              <v-card elevation="5" color="deep-purple lighten-5" class="pa-0 rounded-lg">
                  <v-card-title class=" d-flex justify-space-between align-center dynamic-title">Social and Historical
                      Context
                      <v-btn variant="text" color="black" @click="toggleContent(4)" density="default"
                          :icon="isSummary[4] ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></v-btn>
                  </v-card-title>

                  <v-card-text>
                      <p class="pb-2 text-justify"><span class="dynamic-subtitle ">Historical Events</span> </p>
                      <p class="pb-2 text-justify">{{
                          isSummary[4] ? templeData.socialContext.historicalEvents :
                              templeData.socialContext.D_historicalEvents
                      }}</p>

                      <p class="pb-2 "><span class="dynamic-subtitle ">Community and Cultural Impact</span></p>
                      <p class="pb-2 text-justify">{{
                          isSummary[4] ? templeData.socialContext.communityImpact :
                              templeData.socialContext.D_communityImpact
                      }}</p>

                      <p class="pb-2  font-weight-bold"><span class="dynamic-subtitle">Pilgrimage Importance</span>
                      </p>
                      <p class="pb-2 text-justify">{{
                          isSummary[4] ? templeData.socialContext.pilgrimageImportance :
                              templeData.socialContext.D_pilgrimageImportance
                      }}</p>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
  <!-- </v-container> -->
</template>

<script setup>
// Import the temple data
import { ref } from 'vue';
import { lokanarkavuTemple } from '@/composables/History_Mythology.ts';

// Store the data in a reactive variable
const templeData = ref(lokanarkavuTemple);
const isSummary = ref([true, true, true, true, true])
const toggleContent = (index) => { isSummary.value[index] = !isSummary.value[index]; }

</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.25rem;
}

.v-card-text {
  line-height: 1.6;
}

.v-card-subtitle {
  font-size: 1.1rem;
  margin-top: 20px;
}

.v-list-item-content {
  margin-bottom: 10px;
}

.dynamic-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: bold;
  /* Make the title bold */
}

.dynamic-subtitle {
  font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: normal;
  /* Make the title bold */
}

.dynamic-sub-subtitle {
  font-size: clamp(.95rem, 3.5vw, 1.3rem);
  /* Adjusts from 1.5rem to 2.5rem depending on viewport size */
  text-align: center;
  /* Center-align the title */
  font-weight: bold;
  /* Make the title bold */
}

.no-margin {
  margin: 0;
  /* Removes all margins */
}
</style>