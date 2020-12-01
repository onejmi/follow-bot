<template>
  <v-app>
    <v-app-bar
      app
      elevation="0"
    >
      <v-spacer></v-spacer>
      <v-btn @click="$router.replace('/login').catch(() => {})" color="primary" v-if="!$auth.loggedIn">
          Login
      </v-btn>
      <v-btn @click="logout()" color="warning" v-else>
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useContext } from '@nuxtjs/composition-api'
export default {
  setup(props, context) {
    const { $auth, $axios } = useContext()
    function logout() {
      $axios.$post('/api/v1/auth/logout', { token: $auth.getToken('social') })
      $auth.logout()
      context.root.$router.replace('/')
    }

    return { logout }
  }
}
</script>
