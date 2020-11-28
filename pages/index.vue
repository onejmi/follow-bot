<template>
  <v-container fluid fill-height>
    <v-row class="justify-center align-center">
      <v-col md="4" class="align-center"> 
        <v-card class="pa-6" raised>
          <v-card-text>
            <v-row>
              <v-col md="5">
                <v-img src="img/chick-pink.jpg" width="128" height="128" style="border-radius: 50%">
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
              <v-col md="7"> 
                <h1>HeyFollowers!</h1>
                <p class="mt-6" style="color: white; font-size: 1.3em">Bring the follow culture to discord 🔥</p>
                <p class="mt-6" style="font-size: 1.2em">
                  Chilling on <strong style="color: cyan">{{ serverCount.value.count }}</strong> servers
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="teal" @click="$router.push('/login')">
              Login
            </v-btn>
            <v-btn color="purple" href="https://discord.com/oauth2/authorize?client_id=764557927360102400&scope=bot&permissions=68608">
                Invite
                <v-icon class="ml-1">mdi-discord</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="cyan" href="https://twitter.com/heyfollowbot">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

import { ref, useContext } from '@nuxtjs/composition-api' 
import { useAsync } from '@nuxtjs/composition-api'

export default {
  layout: 'skeleton',
  components: {
    Logo,
    VuetifyLogo
  },
  setup() {
    const { $axios } = useContext()
    const serverCount = useAsync(async () => {
            const val = await $axios.$get(`/api/v1/status/servers/count`)
            return ref(val)
        })

    return { serverCount }
  }
}
</script>
