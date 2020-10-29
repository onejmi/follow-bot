<template>
    <v-container>
        <v-card>
            <v-card-title>Please login here!</v-card-title>
            <v-card-actions>
                <v-btn success @click="login">Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
export default {
    setup() {
        function login() {
            this.$auth.loginWith('social')
        }

        return { login }
    }
}
</script>