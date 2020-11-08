<template>
    <v-container fluid fill-height>
        <v-row class="justify-center">
            <v-col>
                <v-card
                    class="mx-auto pa-4"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">
                        User
                        </div>
                        <v-list-item-title class="headline mb-1">
                        {{ profile.value.tag }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ followers.value.length }} Follower{{ followers.value.length == 1 ? "" : "s" }}
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                    >
                        <v-img :src="profile.value.avatarURL">
                            <template v-slot:placeholder>
                                <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <v-progress-circular indeterminate color="grey lighten-5">
                                    </v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                    <v-btn
                    class="mt-6"
                    :color="color"
                    @click="followUser"
                    >
                    {{ followers.value.includes($auth.user.id) ? 'unfollow' : 'follow' }}
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useContext, useAsync, ref, computed, reactive } from '@nuxtjs/composition-api'
export default {
    middleware: 'auth',
    async validate({ params, $auth, $axios }) {
        //TODO change this to check server if valid user (and maybe if user is in the same server)
        const token = $auth.getToken('social')
        const headers =  { Authorization: token }
        const guilds = await $axios.$get('http://discord.com/api/users/@me/guilds', { headers })
        let hasGuild = false
        for(const guild of guilds) {
            if(guild.id === params.server) {
                hasGuild = true;
                break;
            }
        }
        if(!hasGuild) return false
        try {
            const followerIncluded = await $axios.$get(`/api/v1/users/${params.server}/members/${$auth.user.id}`)
            const targetIncluded = await $axios.$get(`/api/v1/users/${params.server}/members/${params.id}`)
            return followerIncluded && targetIncluded 
        } catch(e) {
            return false
        }
    },
    setup() {
        //TODO create base url axios '/api/v1'
        const { route, $auth, $axios } = useContext()
        const params = route.value.params
        const profile = useAsync(async () => ref(await $axios.$get(`/api/v1/users/${params.server}/members/${params.id}`)))
        const followers = useAsync(async () => {
            const val = await $axios.$get(`/api/v1/users/${params.server}/${params.id}/followers`)
            return ref(val)
        })
        const isFollowing = computed(() => followers.value != null && followers.value.value.includes($auth.user.id))
        const color = computed(() => isFollowing.value ? 'error' : 'purple')

        function followUser() {
            const headers = { Authorization: $auth.getToken('social') }
            $axios.$patch(`/api/v1/users/${params.server}/${params.id}/follow`, {}, { headers })
            if(isFollowing.value) { 
                followers.value.value = followers.value.value.filter(item => item !== $auth.user.id)
            } else {
                followers.value.value.push($auth.user.id)
            }
        }

        return { profile, followers, color, followUser }
    }
}
</script>