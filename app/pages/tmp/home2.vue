<template>
  <v-sheet class="mx-auto" max-width="600">
    <v-slide-group show-arrows>
      <v-slide-group-item v-for="n in 25" :key="n" v-slot="{ isSelected, toggle }">
        <v-card height="250" width="250" @click="toggle">
          <v-btn :color="isSelected ? 'primary' : undefined" class="ma-2" rounded>
            Options {{ n }}
          </v-btn>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
