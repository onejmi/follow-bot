export default async function ({ $auth, app }) {
    if($auth.loggedIn) {
        app.router.replace('/')
    }
}