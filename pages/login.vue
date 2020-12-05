<template>
    <v-container fluid fill-height>
        <v-row class="text-center justify-center">
            <v-col>
                <v-btn color="success" @click="login" class="pa-5"> 
                    Login with Discord 
                    <v-icon class="ml-1">mdi-discord</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useContext } from '@nuxtjs/composition-api' 
export default {
    layout: 'skeleton',
    middleware: ['loggedIn'],
    setup(setup, context) {
        const { route, $auth } = useContext()
        function login() {
            $auth.loginWith('social')
        }

        return { login }
    }
}
</script>