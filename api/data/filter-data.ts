import { MongoClient } from "mongodb";
import ApiServer from "../ApiServer";
import { getSessionId } from "./database";

export class FilterDataStore {

    readonly client: MongoClient

    constructor(client: MongoClient) {
        this.client = client
    }

    public async fetchAllowedChannels(token: string, guildId: string) {
        const guild = await ApiServer.getDiscord().client.guilds.fetch(guildId)
        const userId = await getSessionId(token)
        const member = (await guild.members.fetch()).get(userId)
        const allowedChannels = []
        if(member != null) {
            for(const channel of guild.channels.cache.values()) {
                if(channel.permissionsFor(member)?.has('VIEW_CHANNEL') && channel.type == 'text') {
                    allowedChannels.push({ id: channel.id, name: channel.name, category: channel.parent?.name })
                }
            }
        }
        return allowedChannels
    }

    public async setChannels(userId: string, targetId: string, serverId: string, channelIds: string[]) {
        const sid = `${serverId}-${targetId}`
        await this.client.db()
            .collection('users')
            .updateOne({ userId: userId }, { $set: { [sid]: channelIds } }, { upsert: true })
    }

    public async getChannels(userId: string, targetId: string, serverId: string) : Promise<string[]> {
        const userChannels = await this.client.db()
            .collection('users')
            .findOne({ userId: userId })
        const sid = `${serverId}-${targetId}`    
        return userChannels != null ? userChannels[sid] : []
    }

}