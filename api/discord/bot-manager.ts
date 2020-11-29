import { Client }  from 'discord.js'
import * as keys from '../keys'
import { handleMessage } from './handlers/message-handler'

export default class DiscordManager {
    
    private _client: Client

    constructor() {
        this._client = new Client()
    }
    
    async login() {
        this.registerHandlers()
        await this._client.login(keys.discordToken)
        this._client.user?.setPresence(
            {
                status: 'online',
                activity: {
                    name: 'heyfollow.live',
                    type: 'WATCHING'
                }
            }
        )
    }

    private registerHandlers() {
        this._client.on('message', handleMessage)
    }

    public get client() {
        return this._client
    }
}