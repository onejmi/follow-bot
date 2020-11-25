<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="8">
      <v-card color="blue" class="pa-8">
        <v-card-text>
          <v-row justify="center">
            <v-col md="4">
              <v-img class="ml-10" src="img/chick-pink.jpg" width="128" height="128" style="border-radius: 50%"></v-img>
              <p class="mt-5" style="font-size: 2.4em; font-weight: bold; color: white;">HeyFollowers</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center mr-5">
            <v-btn color="success">Purchase</v-btn>
            <v-btn color="warning">Login</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mt-8" height="600"></v-card>
      <v-card class="mt-8" height="600"></v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

import { ref } from '@nuxtjs/composition-api' 

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  setup() {
    const test = ref('test')

    const grind = () => {
      test.value = "snake"
    }

    return { test, grind }
  }
}
</script>
