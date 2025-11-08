<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        class="mx-auto"
        max-width="344"
        v-bind="props"
      >
       <section  class="pl-2 pr-2">
            <v-card
              class="mb-2"
              elevation="4"
              max-width="800px"
              outlined
              color="#282828"
            >
              <v-card-title
                class="text-h5 font-weight-bold text-center text-white"
              >
                Health Information
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="py-2 px-4">
                <div class="text-container">
                  <!-- Image -->
                  <v-img
                    src="/logo-10-tr1.png"
                    height="150"
                    width="150"
                    class="rounded float-left mr-1 mb-n2"
                    alt="Health and Safety"
                  ></v-img>

                  <!-- Text -->
                  
                  <p class="text-body-2 text-justify">
                    Lokanarkavu Temple, established around the 14th century,
                    holds a significant place in Kerala’s spiritual and cultural
                    history. Founded by the Nair community, renowned for their
                    martial traditions, the temple is closely associated with
                    the legendary warrior Thacholi Othenan. Its traditional
                    Kerala architecture, featuring sloping tiled roofs,
                    intricate wooden carvings, and murals, showcases the
                    artistic excellence of the time.
                  </p>
                  <p class="text-body-2 text-justify pt-2">
                    Over centuries, the temple has witnessed historical
                    milestones, serving as a spiritual haven during periods of
                    unrest and cultural shifts. Restorations in the 20th century
                    ensured its preservation without compromising its original
                    charm. The temple played a vital role in promoting
                    Kalaripayattu and other cultural expressions, while its
                    rituals and festivals have inspired art and literature.
                    <v-chip
                      variant="outlined"
                      size="x-small"
                      append-icon="mdi-arrow-right-thick"
                      class="d-flex-1 font-italic"
                      @click="test"
                    >
                      Learn more
                    </v-chip>
                  </p>
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

        <v-overlay
          :model-value="!!isHovering"
          class="align-center justify-center"
          scrim="#036358"
          contained
        >
          <v-btn variant="flat">See more info</v-btn>
        </v-overlay>
      </v-card>
    </v-hover>
  </div>
</template>