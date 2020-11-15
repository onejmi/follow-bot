export default async function ({ $axios, $auth, app }) {
    const token = $auth.getToken('social')
    const headers = { Authorization: token }
    const validSession = await $axios.$get('/api/v1/auth/status', { headers })
    if(!validSession) {
        const res = await $axios.$post('/api/v1/auth/login', { token: token })
        if(res.status != 'OK') {
            $auth.logout()
            app.router.replace('/login')
        }
    }
}