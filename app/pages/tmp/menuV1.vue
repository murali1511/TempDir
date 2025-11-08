<template>
  <v-container>
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

const filters = ref("");
const items = [
  {
    Village: "Ayancheri",
    Panchayath: "Ayancheri",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Azhiyur",
    Panchayath: "Azhiyur",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Chekkiad",
    Panchayath: "Chekkiad",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Chorode",
    Panchayath: "Chorode",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Edacheri",
    Panchayath: "Edacheri",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Eramala",
    Panchayath: "Eramala",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Kavilumpara",
    Panchayath: "Kavilumpara",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Kayakkodi",
    Panchayath: "Kayakkodi",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Kottappally",
    Panchayath: "Thiruvallur",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Kunnummal",
    Panchayath: "Kunnumal",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Kuttiadi",
    Panchayath: "Kuttiadi",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Maniyur",
    Panchayath: "Maniyur",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Maruthonkara",
    Panchayath: "Maruthomkara",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Nadapuram",
    Panchayath: "Nadapuram",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Narippatta",
    Panchayath: "Naripetta",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Onchiam",
    Panchayath: "Onchiyam",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Palayad",
    Panchayath: "Maniyur",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Purameri",
    Panchayath: "Purameri",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Thinoor",
    Panchayath: "Naripetta",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Thiruvalloor",
    Panchayath: "Thiruvallur",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Thuneri",
    Panchayath: "Thuneri",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Valayam",
    Panchayath: "Valayam",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Vanimel",
    Panchayath: "Vanimel",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Velom",
    Panchayath: "Velom",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Vilangad",
    Panchayath: "Vanimel",
    Taluk: "Vadakara",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Olavanna",
    Panchayath: "Olavanna",
    Taluk: "Kozhikode",
    District: "Kozhikode",
    State: "Kerala",
  },
  {
    Village: "Osoor",
    Panchayath: "Osoor",
    Taluk: "Mysore",
    District: "Mysore",
    State: "Karnataka",
  },
];
const State = ref([]);
const District = ref([]);
const Taluk = ref([]);
const Panchayath = ref([]);
const Village = ref([]);

const States = ref(["ALL", ...new Set(items.map((i) => i.State))]);
const Districts = ref([]);
const Taluks = ref([]);
const Panchayaths = ref([]);
const Villages = ref([]);

const addAllOption = (arr) => ["ALL", ...arr.filter((v, i, a) => a.indexOf(v) === i)];

const fetchDistricts = (stateList) => {
  const filtered = items
    .filter((i) => stateList.includes("ALL") || stateList.includes(i.State))
    .map((i) => i.District);
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
        (districtList.includes("ALL") || districtList.includes(i.District)) &&
        (State.value.includes("ALL") || State.value.includes(i.State))
    )
    .map((i) => i.Taluk);
  Taluks.value = addAllOption(filtered);
  Taluk.value = [];
  Panchayath.value = [];
  Village.value = [];
};

const fetchPanchayaths = (talukList) => {
  const filtered = items
    .filter((i) => talukList.includes("ALL") || talukList.includes(i.Taluk))
    .map((i) => i["Panchayath"]);
  Panchayaths.value = addAllOption(filtered);
  Panchayath.value = [];
  Village.value = [];
};

const fetchVillages = (panchayathList) => {
  const filtered = items
    .filter(
      (i) => panchayathList.includes("ALL") || panchayathList.includes(i["Panchayath"])
    )
    .map((i) => i.Village);
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
  filters.value =
    State.value.includes("ALL") || State.value.length === 0
      ? null
      : `["${State.value.join('","')}"].includes(item.State)`;

  if (!District.value.includes("ALL") && District.value.length > 0) {
    const districtFilter = `["${District.value.join('","')}"].includes(item.District)`;
    filters.value = filters.value
      ? `${filters.value} && ${districtFilter}`
      : districtFilter;
  }

  if (!Taluk.value.includes("ALL") && Taluk.value.length > 0) {
    const talukFilter = `["${Taluk.value.join('","')}"].includes(item.Taluk)`;
    filters.value = filters.value ? `${filters.value} && ${talukFilter}` : talukFilter;
  }

  if (!Panchayath.value.includes("ALL") && Panchayath.value.length > 0) {
    const PanchayathFilter = `["${Panchayath.value.join(
      '","'
    )}"].includes(item.Panchayath)`;
    filters.value = filters.value
      ? `${filters.value} && ${PanchayathFilter}`
      : PanchayathFilter;
  }

  if (!Village.value.includes("ALL") && Village.value.length > 0) {
    const VillageFilter = `["${Village.value.join('","')}"].includes(item.Village)`;
    filters.value = filters.value
      ? `${filters.value} && ${VillageFilter}`
      : VillageFilter;
  }
  const filtered_items = filters.value
    ? items.filter((item) => new Function("item", `return ${filters.value}`)(item))
    : items;

  //   State = ref([]);
  // const District = ref([]);
  // const Taluk = ref([]);
  // const Panchayath = ref([]);
  // const Village = ref([]);
  console.log(filtered_items);
};
</script>

<style scoped>
.v-container {
  max-width: 600px;
}
</style>
