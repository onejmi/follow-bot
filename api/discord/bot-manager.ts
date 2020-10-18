import { Client }  from 'discord.js'
import * as keys from '../keys'
import { handleMessage } from './handlers/message-handler'

export default class DiscordManager {
    
    private client: Client

    constructor() {
        this.client = new Client()
    }
    
    login() {
        this.registerHandlers()
        this.client.login(keys.discordToken)
    }

    private registerHandlers() {
        this.client.on('message', handleMessage)
    }
}