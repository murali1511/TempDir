<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              class="mx-auto rounded-lg g_border"
              max-width="600"
              :color="isHovering ? colorScheme[0] : colorScheme[1]"
              v-bind="props"
            >
              <v-card-title
                class="d-flex justify-space-between align-center text-subtitle-1"
                :style="`color:
                ${isHovering ? colorScheme[1] : colorScheme[0]}`"
                @click="displaytoggle"
              >
                {{ $t("architecture_h1") }}

                <v-btn
                  :color="btn_color(isHovering)"
                  icon
                  @click=""
                  size="small"
                  class="mt-1 ml-6"
                  :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                >
                  <v-icon>
                    {{ Detailed_display ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-title>

              <section v-if="Detailed_display" class="pl-2 pr-2 bg-color-gold">
                <v-card
                  class="mb-2"
                  elevation="4"
                  max-width="800px"
                  outlined
                  :color="isHovering ? colorScheme[1] : colorScheme[0]"
                >
                  <v-card-title
                    class="text-subtitle-1 font-weight-bold text-center"
                    :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                  >
                    {{ $t("architecture_h1") }}
                  </v-card-title>
                  <v-divider></v-divider>

                  <v-card-text class="py-2 px-4">
                    <div class="text-container">
                      <!-- Image -->
                      <v-img
                        :src="`/${localStore.temple_logo}.png`"
                        height="140"
                        width="140"
                        class="rounded float-left mr-3 mb-1 mt-1"
                        alt="Health and Safety"
                      ></v-img>

                      <!-- Text -->
                      <div
                        class="description-text"
                        :class="
                          $i18n.locale.value === 'en'
                            ? 'text-body-2   text-justify'
                            : 'text-caption '
                        "
                        :style="`color:
                ${isHovering ? colorScheme[0] : colorScheme[1]}`"
                        v-html="localStore.architectures.description"
                      />
                    </div>
                  </v-card-text>

                  <v-card-actions class="justify-center">
                    <v-btn
                      class="text-red font-weight-bold ml-2"
                      color="black"
                      rounded="0"
                      variant="outlined"
                      small
                    >
                      Book Pooja
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </section>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { ref } from "vue";
import { dbStore } from "~/composables/dbStore";
const { $i18n } = useNuxtApp();
import { useLocalStore } from "/stores/localStore.js";

const localStore = useLocalStore();
// localStore.setTempleID("T0002");

const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const displaytoggle = () => {
  Detailed_display.value =
    localStore.architectures == "Not Found"
      ? Detailed_display.value
      : !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};

const sortedAttractions = (attractions) => {
  return attractions.slice().sort((a, b) => a.distance - b.distance);
};

onMounted(() => {
  // $i18n.setLocale(localStore.locale);
  localStore.Fetch_Architecture(localStore.locale);
  // fetchData();
  // console.log("Shared data", sharedData);
});
const history = ref({
  summary_en:
    "The Lokanarkavu Temple exemplifies traditional Kerala temple architecture, harmonizing spirituality with artistic excellence. Its design adheres to a single-story, rectangular Sreekovil, following the distinctive Kerala architectural style. Locally sourced materials, including laterite stone, limestone powder, and tiles, were used in constructing the temple complex, ensuring durability and cultural authenticity. <br><br>At the heart of the temple lies the sanctum sanctorum, or Sreekovil, which houses the idol of Goddess Bhagavathi. This sacred inner sanctum exudes an ambiance of devotion and tranquility. Surrounding the Sreekovil are concentric enclosures, known as Prakaaras, symbolizing spiritual progression and guiding devotees closer to the divine essence as they move inward through the temple complex. <br><br>Other notable architectural features include the Namaskara Mandapam, a central hall adorned with intricate carvings, serving as a venue for rituals and community gatherings. The temple’s walls are decorated with elaborate murals depicting mythological stories, celestial beings, and spiritual motifs, which not only enhance its aesthetic appeal but also narrate profound spiritual narratives. <br><br>The temple complex includes three ponds, integral to its spiritual practices. One pond is designated for devotees' bathing, while the others are used for purification rituals, reflecting the harmonious relationship between nature and spirituality that is central to Kerala’s temple traditions.",
  summary_ml:
    "ലോകനാർകാവ് ക്ഷേത്രം കേരളത്തിന്റെ പരമ്പരാഗത ക്ഷേത്ര ശില്പകലയുടെ ഒരു മനോഹര ഉദാഹരണമാണ്, ആത്മീയതയും കലാപ്രതിഭയും സമന്വയിപ്പിക്കുന്നതായി. ഇതിന്റെ ആകൃതിയും ശില്പശൈലിയുമൊക്കെ ഏകനിലയുള്ള, ചതുരശ്ര ആകൃതിയിലുള്ള ശ്രീകോവിലിനെ ആശ്രയിച്ചാണ്, കേരളത്തിന്റെ സവിശേഷ ശില്പശൈലിയിൽ നിർമ്മാണം നടത്തിയത്. പ്രാദേശികമായി ലഭ്യമായ ചെങ്കല്ല്, നുറുകിയ കല്ലുപൊടി, അടിപ്പന്തലുകൾ എന്നിവ ഉപയോഗിച്ച് സമുച്ചയത്തിന്റെ നിർമ്മാണം നടന്നു, ദീർഘകാലാശയത്തോടെയും സാംസ്കാരിക വിശ്വാസ്യമായും.<br><br>ക്ഷേത്രത്തിന്റെ ഹൃദയഭാഗമായ ശ്രീകോവിൽ ദേവി ഭഗവതിയുടെ വിഗ്രഹത്തെ സദാ ഹൗസിംങ് ചെയ്യുന്നു. ഈ ആരാധനാലയത്തിന്റെ പരിശുദ്ധ അന്തരീക്ഷം ഭക്തിയുടെ സാന്നിധ്യവും മനസ്സുതറ്റി ആധ്യാത്മികതയുടെ വാതാവരണം സൃഷ്ടിക്കുന്നു. ശ്രീകോവിലിനെ ചുറ്റിപറ്റി കുളങ്ങളിൽ പ്രകാരങ്ങളായ പ്രാകാരങ്ങൾ ഭക്തരെ ദൈവത്തിന്റെ ദിവ്യ പരിപോഷണത്തിലേക്ക് എത്തിക്കുന്നു. <br><br>ശില്പകലയുടെയും തനതായ കാർവിംഗിന്റെയും തെളിവായ നമസ്കാര മണ്ടപം ചടങ്ങുകൾക്കും, സമൂഹീയ കൂടിച്ചേരലുകൾക്കുമുള്ള കേന്ദ്രമായി നിലകൊള്ളുന്നു. ക്ഷേത്രത്തിന്റെ ചുമരുകളിൽ ഹിന്ദു പുരാണകഥകളെയും ദിവ്യ മൃഗങ്ങളെയും ആത്മീയ പ്രമേയങ്ങളെയും അവതരിപ്പിക്കുന്ന മനോഹര ചിത്രകലയുണ്ട്, അതു വിസ്മയകരമായ ദൃശ്യഭംഗിയും ആത്മീയ കഥാവിഷ്കാരവും പകരുന്നു. <br><br>ക്ഷേത്ര സമുച്ചയത്തിലെ മൂന്ന് കുളങ്ങൾ ആത്മീയ ആചാരങ്ങൾക്കാവശ്യമായ പ്രധാന ഘടകങ്ങളാണ്. ഭക്തർ കുളിക്കുന്നതിന് ഒരു കുളം ഉണ്ട്, ബാക്കി രണ്ടും ശുദ്ധീകരണ ചടങ്ങുകൾക്കായി ഉപയോഗിക്കുന്നു. കേരളത്തിലെ ആചാരപരമായ വിശ്വാസങ്ങൾ പ്രകൃതിയുമായുള്ള ആത്മീയ ബന്ധത്തെ വിളിച്ചോതുന്ന ഇവയുടെ പ്രാധാന്യമാണ്.",

  details_en: {
    para: "Lokanarkavu Temple, established around ",
  },
  details_ml: {
    para: "14-ആം നൂറ്റാണ്ടിൽ സ്ഥാപിതമായ ലോകനാർകാവ് ക്ഷേത്രം ",
  },
});
</script>

<style scoped>
.text-container {
  position: relative;
}

.float-left {
  float: left; /* Float the image to the left */
}

.text-justify {
  text-align: justify; /* Ensures the text is justified */
}
.description-text {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
</style>
