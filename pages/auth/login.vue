<template>
    <p>Redirecting...</p>
</template>
<script>
import { useContext } from '@nuxtjs/composition-api'
export default {
    setup(props, context) {
        const { $axios, $auth } = useContext()
        const user = $auth.user
        const token = $auth.getToken('social')
        $axios.$post('/api/v1/auth/login', { token: token })
        context.root.$router.replace('/')
    }
}
</script>