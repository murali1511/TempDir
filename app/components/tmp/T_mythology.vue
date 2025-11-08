<template>
  <v-theme-provider theme="dark">
    <v-row>
      <v-col>
        <v-card
          :class="[
            'mx-auto rounded-lg g_border',
            $vuetify.display.smAndUp ? 'ml-12 mr-12' : '',
          ]"
          :color="colorScheme[1]"
        >
          <v-card-title
            class="d-flex justify-space-between align-center text-subtitle-1 grab"
            :style="`color: ${colorScheme[0]}`"
          >
            {{ $t("mythology_h1") }}
          </v-card-title>

          <section class="pl-2 pr-2 bg-color-gold">
            <v-card class="mb-2" elevation="4" outlined :color="colorScheme[0]">
              <v-divider></v-divider>

              <v-card-text class="py-2 px-4">
                <div class="text-container">
                  <div
                    :class="
                      $i18n.locale.value === 'en'
                        ? 'text-body-2 c description-text_en  text-justify'
                        : 'text-caption description-text_ml'
                    "
                    :style="`color:
                ${colorScheme[1]}`"
                    v-html="mythologyContent"
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
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup>
import { dbStore } from "~/composables/dbStore";
import { computed, ref } from "vue";
import { useLocalStore } from "/stores/localStore.js";

const { $i18n } = useNuxtApp();
const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
const Detailed_display = ref(false);

const localStore = useLocalStore();

const mythologyContent = ref("Loading about content..."); // Placeholder text
// Watch for changes in language or store data
watchEffect(() => {
  const locale = $i18n.locale.value;
  const mythology = localStore.mythology;

  mythologyContent.value =
    locale === "en"
      ? mythology.summary?.en || "Content not available in English."
      : mythology.summary?.ml || "Content not available in Malayalam.";
});

const displaytoggle = () => {
  Detailed_display.value = !Detailed_display.value;
};

const btn_color = (isHovering) => {
  return isHovering ? colorScheme.value[1] : colorScheme.value[0];
};
const test = () => {
  alert("You clicked Learn more!");
};
const mythology = ref({
  summary_en:
    "Steeped in legend, Lokanarkavu Temple is a sacred abode of Goddess Durga, where myths of strength and protection come alive. Legendary warrior Thacholi Othenan sought her blessings for valor and success in battles. Folklore narrates how the goddess shielded the community from harm and granted divine strength. The temple’s rich rituals, mythical tales, and cultural significance create an enchanting spiritual atmosphere, drawing devotees seeking blessings and inspiration.",
  summary_ml:
    "പുരാണകഥകളാൽ സമ്പന്നമായ ലോകനാർകാവ് ക്ഷേത്രം ദുർഗാ ദേവിയുടെ ദിവ്യസ്ഥലമാണ്, കരുത്തിന്റെയും സംരക്ഷണത്തിന്റെയും കഥകളുമായി ചേരുന്നു. തച്ചോളി ഒതേനൻ യുദ്ധ വിജയത്തിനും ധൈര്യത്തിനുമായി ദേവിയുടെ അനുഗ്രഹം തേടിയിരുന്ന ചരിത്രമാണ് പ്രശസ്തം. ദേവി ജനസമൂഹത്തെ സംരക്ഷിക്കുകയും ദിവ്യശക്തി നൽകി ശത്രുക്കളെ തോൽപ്പിക്കാനും സഹായിച്ചതായും വിശ്വാസമുണ്ട്. സമ്പന്നമായ ചടങ്ങുകളും, അതിമനോഹരമായ പുരാണങ്ങളും, സാംസ്കാരിക പ്രാധാന്യവും ക്ഷേത്രം ഭക്തരെ ആകർഷിച്ച് അനുഗ്രഹത്തിന്റെയും പ്രചോദനത്തിന്റെയും കേന്ദ്രമാക്കി മാറ്റുന്നു.",

  // details_en: [
  //       para: "Lokanarkavu Temple, established around the 14th century, holds a significant place in Kerala’s spiritual and cultural history. Founded by the Nair community, renowned for their martial traditions, the temple is closely associated with the legendary warrior Thacholi Othenan. Its traditional Kerala architecture, featuring sloping tiled roofs, intricate wooden carvings, and murals, showcases the artistic excellence of the time.",
  //       para: "Over centuries, the temple has witnessed historical milestones, serving as a spiritual haven during periods of unrest and cultural shifts. Restorations in the 20th century ensured its preservation without compromising its original charm. The temple played a vital role in promoting Kalaripayattu and other cultural expressions, while its rituals and festivals have inspired art and literature. Governed historically by the Nair community, the temple transitioned to structured committee management, ensuring the continuity of its traditions and spiritual legacy",
  //   ],
  //    details_ml: [
  //       para: "14-ആം നൂറ്റാണ്ടിൽ സ്ഥാപിതമായ ലോകനാർകാവ് ക്ഷേത്രം കേരളത്തിന്റെ ആത്മീയ സാംസ്കാരിക ചരിത്രത്തിൽ നിർണായക സ്ഥാനമെടുക്കുന്നു. യോദ്ധാവായ തച്ചോളി ഒതേനന്റെ പാരമ്പര്യത്തോടും നായർ സമുദായത്തിന്റെ സൈനിക പാരമ്പര്യത്തോടും ബന്ധം പുലർത്തുന്നു. ചെരിഞ്ഞ മേഞ്ഞിലുകളും മനോഹരമായ മരംകൊത്തുപണികളും ചുമരുകളിലെ ചിത്രങ്ങളും  കലാ നൈപുണ്യത്തെ പ്രതിഫലിപ്പിക്കുന്നു."
  //       para: "നൂറ്റാണ്ടുകളായി, ക്ഷേത്രം സാംസ്കാരിക മാറ്റങ്ങൾക്കും കലഹകാലങ്ങൾക്കും സാക്ഷ്യം വഹിച്ചു. 20-ആം നൂറ്റാണ്ടിലെ പുനർനിർമാണങ്ങൾ ഇതിന്റെ യഥാർത്ഥ സൗന്ദര്യം നഷ്ടപ്പെടുത്താതെ സംരക്ഷിച്ചു. കലരിപയറ്റുപോലുള്ള പാരമ്പര്യങ്ങളെയും കലാരൂപങ്ങളെയും പ്രോത്സാഹിപ്പിക്കുകയും, ചടങ്ങുകളും ഉത്സവങ്ങളും സാഹിത്യത്തിനും കലകൾക്കും പ്രചോദനമാകുകയും ചെയ്തു. നായർ സമുദായത്തിന്റെ മേൽനോട്ടത്തിൽ ആരംഭിച്ച ക്ഷേത്ര ഭരണ സംവിധാനം ആചാരപാരമ്പര്യം തുടർന്നുകൊണ്ടിരിക്കുകയാണ്"
  //   ]
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
.description-text_en {
  line-height: 1.5; /* Adjust the value as needed for desired spacing */
}
.description-text_ml {
  line-height: 1.8; /* Adjust the value as needed for desired spacing */
}
</style>
