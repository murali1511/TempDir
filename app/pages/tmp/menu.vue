<template>
  <v-container>
    <v-combobox
      v-model="Diety"
      :items="Dieties"
      label="Diety"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(Diety)"
    ></v-combobox>

    <v-combobox
      v-model="State"
      :items="States"
      label="State"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(State)"
    ></v-combobox>

    <v-combobox
      v-model="District"
      :items="Districts"
      label="District"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(District)"
    ></v-combobox>

    <v-combobox
      v-model="Taluk"
      :items="Taluks"
      label="Taluk"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(Taluk)"
    ></v-combobox>

    <v-combobox
      v-model="Panchayath"
      :items="Panchayaths"
      label="Panchayath"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(Panchayath)"
    ></v-combobox>

    <v-combobox
      v-model="Village"
      :items="Villages"
      label="Village"
      chips
      multiple
      closable-chips
      @update:modelValue="() => onAllSelected(Village)"
    ></v-combobox>
    <v-btn variant="outlined" @click="setFilter"> Set Filter </v-btn>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import features from "/stores/stores_geojson.js";

const items = features.features;

const filters = ref("");

const Diety = ref([]);
const State = ref([]);
const District = ref([]);
const Taluk = ref([]);
const Panchayath = ref([]);
const Village = ref([]);

const States = ref(["ALL", ...new Set(items.map((i) => i.properties.state))]);

const Dieties = ref(["ALL", ...new Set(items.map((i) => i.properties.diety.main))]);

const Districts = ref([]);
const Taluks = ref([]);
const Panchayaths = ref([]);
const Villages = ref([]);

const addAllOption = (arr) => ["ALL", ...arr.filter((v, i, a) => a.indexOf(v) === i)];

const fetchDistricts = (stateList) => {
  const filtered = items
    .filter((i) => stateList.includes("ALL") || stateList.includes(i.properties.state))
    .map((i) => i.properties.district);
  Districts.value = addAllOption(filtered);
  District.value = [];
  Taluk.value = [];
  Panchayath.value = [];
  Village.value = [];
};

const fetchTaluks = (districtList) => {
  const filtered = items
    .filter(
      (i) =>
        (districtList.includes("ALL") || districtList.includes(i.properties.district)) &&
        (State.value.includes("ALL") || State.value.includes(i.properties.state))
    )
    .map((i) => i.properties.taluk);
  Taluks.value = addAllOption(filtered);
  Taluk.value = [];
  Panchayath.value = [];
  Village.value = [];
};

const fetchPanchayaths = (talukList) => {
  const filtered = items
    .filter((i) => talukList.includes("ALL") || talukList.includes(i.properties.taluk))
    .map((i) => i.properties.panchayath);
  Panchayaths.value = addAllOption(filtered);
  Panchayath.value = [];
  Village.value = [];
};

const fetchVillages = (panchayathList) => {
  const filtered = items
    .filter(
      (i) =>
        panchayathList.includes("ALL") || panchayathList.includes(i.properties.panchayath)
    )
    .map((i) => i.properties.village);
  Villages.value = addAllOption(filtered);
  Village.value = [];
};

const onAllSelected = (modelRef) => {
  if (modelRef.includes("ALL") && modelRef.length > 1) {
    modelRef.splice(0, modelRef.length, "ALL");
  }
};

watch(State, (newVal) => {
  if (newVal.length) {
    fetchDistricts(newVal);
  } else {
    Districts.value = [];
    Taluks.value = [];
    Panchayaths.value = [];
    Villages.value = [];
    District.value = [];
    Taluk.value = [];
    Panchayath.value = [];
    Village.value = [];
  }
});

watch(District, (newVal) => {
  if (newVal.length) {
    fetchTaluks(newVal);
  } else {
    Taluks.value = [];
    Panchayaths.value = [];
    Villages.value = [];
    Taluk.value = [];
    Panchayath.value = [];
    Village.value = [];
  }
});

watch(Taluk, (newVal) => {
  if (newVal.length) {
    fetchPanchayaths(newVal);
  } else {
    Panchayaths.value = [];
    Villages.value = [];
    Panchayath.value = [];
    Village.value = [];
  }
});

watch(Panchayath, (newVal) => {
  if (newVal.length) {
    fetchVillages(newVal);
  } else {
    Villages.value = [];
    Village.value = [];
  }
});

onMounted(() => {
  State.value = ["Kerala"];
  fetchDistricts(State.value);
});

const setFilter = () => {
  filters.value = null;
  filters.value = null;

  if (!Diety.value.includes("ALL") && Diety.value.length > 0) {
    const deityFilter = `["${Diety.value.join(
      '","'
    )}"].includes(item.properties.diety.main)`;
    filters.value = deityFilter;
  }

  if (!State.value.includes("ALL") && State.value.length > 0) {
    const stateFilter = `["${State.value.join('","')}"].includes(item.properties.state)`;
    filters.value = filters.value ? `${filters.value} && ${stateFilter}` : stateFilter;
  }
  if (!District.value.includes("ALL") && District.value.length > 0) {
    const districtFilter = `["${District.value.join(
      '","'
    )}"].includes(item.properties.district)`;
    filters.value = filters.value
      ? `${filters.value} && ${districtFilter}`
      : districtFilter;
  }

  if (!Taluk.value.includes("ALL") && Taluk.value.length > 0) {
    const talukFilter = `["${Taluk.value.join('","')}"].includes(item.properties.taluk)`;
    filters.value = filters.value ? `${filters.value} && ${talukFilter}` : talukFilter;
  }

  if (!Panchayath.value.includes("ALL") && Panchayath.value.length > 0) {
    const panchayathFilter = `["${Panchayath.value.join(
      '","'
    )}"].includes(item.properties.panchayath)`;
    filters.value = filters.value
      ? `${filters.value} && ${panchayathFilter}`
      : panchayathFilter;
  }

  if (!Village.value.includes("ALL") && Village.value.length > 0) {
    const villageFilter = `["${Village.value.join(
      '","'
    )}"].includes(item.properties.village)`;
    filters.value = filters.value
      ? `${filters.value} && ${villageFilter}`
      : villageFilter;
  }

  const filtered_items = filters.value
    ? items.filter((item) => new Function("item", `return ${filters.value}`)(item))
    : items;

  console.log(filtered_items);
};
</script>

<style scoped>
.v-container {
  max-width: 600px;
}
</style>
