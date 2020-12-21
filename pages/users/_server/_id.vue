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
                    :disabled="$auth.user.id == $route.params.id"
                    >
                    {{ followers.value.includes($auth.user.id) ? 'unfollow' : 'follow' }}
                    </v-btn>
                    <v-btn 
                    @click="filter.show = true"
                    class="mt-6"
                    :disabled="!followers.value.includes($auth.user.id)"
                    icon>
                        <v-icon>mdi-cog</v-icon>
                    </v-btn>
                    </v-card-actions>
                </v-card>
                <v-dialog
                v-model="filter.show"
                width="300"
                >
                    <v-card
                    height="500">
                        <v-card-title>Listen to Channels</v-card-title>
                        <v-card-text>
                            <v-row justify="center" v-if="filter.loading">
                                <v-progress-circular  
                                color="blue" 
                                indeterminate
                                ></v-progress-circular>
                            </v-row>
                            <v-checkbox 
                            v-else
                            v-for="channel in filter.channels" 
                            :key="channel.id"
                            v-model="filter.selectedChannels"
                            :label="channel.name"
                            :value="channel.id"
                            ></v-checkbox>
                        </v-card-text>
                        <v-card-actions class="ml-4">
                            <v-btn color="success" @click="save">Save</v-btn>
                            <v-btn color="error" @click="hide">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-snackbar
        v-model="filter.snackbar"
        timeout="1000"
        >
        Saved 🎉

        <template v-slot:action="{ attrs }">
            <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
        </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import { useContext, useAsync, ref, computed, reactive, watchEffect, watch } from '@nuxtjs/composition-api'
export default {
    middleware: ['auth', 'session'],
    async validate({ params, $auth, $axios }) {
        let token 
        try {
            token = $auth.getToken('social')
        } catch(e) {
            return false
        }
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
        //TODO organize filters into categories
        const serverBase = 'https://heyfollow.live'
        const { route, $auth, $axios } = useContext()
        const params = route.value.params
        const profile = useAsync(async () => ref(await $axios.$get(`/api/v1/users/${params.server}/members/${params.id}`)))
        const followers = useAsync(async () => {
            const val = await $axios.$get(`/api/v1/users/${params.server}/${params.id}/followers`)
            return ref(val)
        })
        const isFollowing = computed(() => followers.value != null && followers.value.value.includes($auth.user.id))
        const color = computed(() => isFollowing.value ? 'error' : 'purple')

        const filter = reactive({
            show: false,
            channels: [],
            selectedChannels: [],
            snackbar: false,
            loading: true
        })

        watchEffect(async () => {
            if(filter.show) {
                const headers = { Authorization: $auth.getToken('social')}
                filter.channels = 
                    await $axios.$get(`${serverBase}/api/v1/users/channels/access?server=${params.server}`, { headers })
                filter.channels = filter.channels.map((chnl) => {
                    if(chnl.category != null) {
                        chnl.name = '#' + chnl.name + ` (${chnl.category})`
                    }
                    return chnl
                })
                filter.selectedChannels = await $axios
                    .$get(`${serverBase}/api/v1/users/channels?server=${params.server}&id=${params.id}`, { headers })
                filter.loading = false
            }
        })

        function save(showSnackbar = true) {
            const headers = { Authorization: $auth.getToken('social')}
            $axios.$put(`${serverBase}/api/v1/users/channels?server=${params.server}&id=${params.id}`, 
                { channelIds: filter.selectedChannels }, 
                { headers }
            )
            if(showSnackbar) filter.snackbar = true
        }

        function hide() {
            filter.show = false
        }

        async function followUser() {
            const headers = { Authorization: $auth.getToken('social') }
            $axios.$patch(`${serverBase}/api/v1/users/${params.server}/${params.id}/follow`, {}, { headers })
            if(isFollowing.value) { 
                followers.value.value = followers.value.value.filter(item => item !== $auth.user.id)
            } else {
                followers.value.value.push($auth.user.id)
                filter.channels = 
                    await $axios.$get(`${serverBase}/api/v1/users/channels/access?server=${params.server}`, { headers })
                filter.selectedChannels = filter.channels.map(chnl => chnl.id)
                save(false)
            }
        }

        return { profile, followers, color, followUser, filter, save, hide }
    }
}
</script>