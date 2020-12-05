<template>
    <p>Redirecting...</p>
</template>
<script>
import { useContext } from '@nuxtjs/composition-api'
export default {
    layout: 'skeleton',
    setup(props, context) {
        const { $axios, $auth, store } = useContext()
        const user = $auth.user
        const token = $auth.getToken('social')
        $axios.$post('/api/v1/auth/login', { token: token })
        context.root.$router.replace('/')
    }
}
</script>