<!-- File: /pages/translate.vue (Nuxt 4 + Vuetify 3 page component) -->
<template>
  <v-app>
    <v-main>
      <v-container class="pa-6" max-width="900">
        <v-card elevation="3" class="pa-6">
          <v-row>
            <v-col cols="12" md="8">
              <h2>Instant AI Translation (English ⇄ മലയാളം)</h2>
              <p class="text--secondary">
                Type text in English and click the language button to translate to
                Malayalam (or vice-versa).
              </p>

              <v-textarea
                v-model="sourceText"
                label="Source text"
                rows="6"
                outlined
                clearable
              />

              <v-row class="mt-4" align="center">
                <v-col cols="12" md="6">
                  <v-btn @click="toggleDirection" block>
                    {{ fromLabel }} → {{ toLabel }}
                  </v-btn>
                </v-col>

                <v-col cols="12" md="6">
                  <v-switch
                    v-model="instant"
                    :label="`Instant translate: ${instant ? 'ON' : 'OFF'}`"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-3">
                <v-col cols="6">
                  <v-btn
                    color="primary"
                    @click="translate"
                    :loading="loading"
                    :disabled="loading || !sourceText"
                  >
                    Translate
                  </v-btn>
                </v-col>

                <v-col cols="6" class="text-right">
                  <v-btn variant="outlined" @click="swapText"
                    >Swap (source ⇄ target)</v-btn
                  >
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div v-if="translatedText">
                <h3>Translation</h3>
                <v-card class="pa-4">
                  <div style="white-space: pre-wrap">{{ translatedText }}</div>
                </v-card>
              </div>

              <div v-else-if="!translatedText && !loading" class="text--secondary mt-4">
                No translation yet.
              </div>

              <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
            </v-col>

            <v-col cols="12" md="4">
              <h4>Settings</h4>
              <v-select v-model="model" :items="models" label="Model" dense />

              <v-text-field v-model="sourceLang" label="From (lang code)" dense />
              <v-text-field v-model="targetLang" label="To (lang code)" dense />

              <p class="text--secondary mt-4">
                Tip: For English use <code>en</code>, for Malayalam use <code>ml</code>.
              </p>

              <v-divider class="my-4" />

              <h4>Agentic options</h4>
              <v-switch
                v-model="useAgent"
                :label="`Use agentic translation: ${useAgent ? 'ON' : 'OFF'}`"
              />
              <p class="text--secondary">
                When agentic mode is ON the server-side agent will attempt to: detect
                domain (e.g., legal / conversational), preserve named-entities, and ask
                follow-up clarifying questions if output seems ambiguous (basic
                heuristic).
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const sourceText = ref("");
const translatedText = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// simple language labels and codes
const sourceLang = ref("en");
const targetLang = ref("ml");
const fromLabel = computed(() =>
  sourceLang.value === "en" ? "English" : sourceLang.value
);
const toLabel = computed(() =>
  targetLang.value === "ml" ? "Malayalam" : targetLang.value
);

const instant = ref(false);
const useAgent = ref(true);
// prefer stable models your key supports
const model = ref("gpt-4o-mini");
const models = ["gpt-4o-mini", "gpt-4o"];

// const model = ref("gpt-4o-mini-translation");
// const models = ["gpt-4o-mini-translation", "gpt-4o-mini", "gpt-4o"];

// debounce timer for instant translate
let timer: number | undefined;
watch(sourceText, (val) => {
  if (!instant.value) return;
  clearTimeout(timer);
  if (!val) {
    translatedText.value = "";
    return;
  }
  timer = window.setTimeout(() => translate(), 600);
});

const swapDirection = () => {
  const s = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = s;
};

const toggleDirection = () => {
  swapDirection();
  // also swap texts
  const temp = translatedText.value;
  translatedText.value = sourceText.value;
  sourceText.value = temp;
};

const swapText = () => {
  const tmp = sourceText.value;
  sourceText.value = translatedText.value;
  translatedText.value = tmp;
};

async function translate() {
  if (!sourceText.value) return;
  loading.value = true;
  error.value = null;
  translatedText.value = "";
  try {
    const body = {
      text: sourceText.value,
      from: sourceLang.value,
      to: targetLang.value,
      model: model.value,
      agent: useAgent.value,
    };
    console.log("reached translate function");
    const res = await $fetch("/api/translate", {
      method: "POST",
      body,
    });
    console.log(res);
    translatedText.value = res.translation || "";
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "Translation failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.text--secondary {
  color: rgba(0, 0, 0, 0.6);
}
</style>
