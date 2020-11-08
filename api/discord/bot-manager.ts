import { Client }  from 'discord.js'
import * as keys from '../keys'
import { handleMessage } from './handlers/message-handler'

export default class DiscordManager {
    
    private _client: Client

    constructor() {
        this._client = new Client()
    }
    
    login() {
        this.registerHandlers()
        this._client.login(keys.discordToken)
    }

    private registerHandlers() {
        this._client.on('message', handleMessage)
    }

    public get client() {
        return this._client
    }
}