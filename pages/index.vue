<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Welcome to the Vuetify + Nuxt.js template
          {{ test }}
        </v-card-title>
        <v-card-text>
          
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            @click="grind"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
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
