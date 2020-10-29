<template>
    <v-container>
        <h1>You're currently @ User {{ $route.params.id }}</h1>
        <h2>They are apart of server {{ $route.params.server }}</h2>
        <p>This is your user object {{ $auth.user }}</p>
    </v-container>
</template>

<script>
export default {
    middleware: 'auth',
    validate({ params }) {
        //TODO change this to check server if valid user (and maybe if user is in the same server)
        return /^\d+$/.test(params.id)
    },
    setup() {}
}
</script>