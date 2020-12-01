<template>
    <v-container>
        <v-row class="justify-center align-center">
            <v-col md="4">
                <v-card>
                    <v-card-title>Please login here!</v-card-title>
                    <v-card-actions>
                        <v-btn color="success" @click="login">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    layout: 'skeleton',
    setup() {
        if(this.$auth.loggedIn) {
            this.$router.replace('/')
        }
        function login() {
            this.$auth.loginWith('social')
        }

        return { login }
    }
}
</script>