export default async function ({ $auth, app }) {
    console.log('a')
    if($auth.loggedIn) {
        app.router.replace('/')
        console.log('b')
    }
}