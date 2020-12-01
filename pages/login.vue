<template>
    <v-container fluid fill-height>
        <v-row class="justify-center align-center" fill-height>
            <v-col md="4" class="align-center">
                <v-btn color="success" @click="login"> 
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
    setup(setup, context) {
        const { route, $auth } = useContext()
        if($auth.loggedIn) {
            context.root.$router.replace('/')
        }
        function login() {
            $auth.loginWith('social')
        }

        return { login }
    }
}
</script>