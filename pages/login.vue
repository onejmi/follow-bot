<template>
    <v-container>
        <v-row class="justify-center align-center">
            <v-col md="4">
                <v-card>
                    <v-card-title>Login</v-card-title>
                    <v-card-actions class="align-center">
                        <v-btn color="success" @click="login"> 
                            Login with Discord 
                            <v-icon>mdi-discord</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
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