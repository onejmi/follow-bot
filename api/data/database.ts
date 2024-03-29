
//further complicate things with per channel
//this needs to be PER SERVER.

import { dbPassword, dbName, dbUser } from './credentials'
import { MongoClient } from 'mongodb'
import { FilterDataStore } from './filter-data'
import ApiServer from '../ApiServer'
import { MessageEmbed } from 'discord.js'

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.jlsao.mongodb.net/${dbName}?retryWrites=true&w=majority`
let client = new MongoClient(uri, { useNewUrlParser: true })

export const filterDataStore = new FilterDataStore(client)

export async function getSessionId(key: string) {
    const session = await client.db().collection('sessions').findOne({ 'sessionId' : key })
    return session?.userId
}

export async function setSession(key: string, userId: string) {
    await client.db()
        .collection('sessions')
        .updateOne({ 'sessionId' : key }, { $set: { 'userId' : userId } }, { upsert: true })
}

export function deleteSession(key: string) {
    client.db().collection('sessions').deleteOne({ 'sessionId' : key })
}

export async function getFollowMap(serverId: string) {
    let serverData = await client.db().collection('servers').findOne({ 'serverId' : serverId })
    return serverData?.followMap
}

export function setFollowMap(serverId: string, followMap: Map<string, string[]>) {
    client.db()
        .collection('servers')
        .updateOne({ 'serverId' : serverId }, { $set: { 'followMap' : followMap } }, { upsert: true })
}

export async function setFollowNotifications(userId: string, state: boolean) {
    await client.db()
            .collection('users')
            .updateOne({ userId: userId }, { $set: { followAlerts: state } }, { upsert: true })
}

export async function userIgnoresAlert(userId: string) {
    const user = await client.db().collection('users').findOne({userId: userId})
    return !user.followAlerts
}

export async function begin() {
    client = await client.connect()
}

export async function follow(serverId: string, fromId: string, toId: string) {
    const discord = ApiServer.getDiscord()
    let followMap = await getFollowMap(serverId)
    if(followMap == null) followMap = new Map()

    const guild = discord.client.guilds.cache.get(serverId)
    const embed = new MessageEmbed()
    embed.setTitle('New Follow (' + guild?.name + ')')
    const avatarURL = guild?.members.cache.get(fromId)?.user?.avatarURL() 
        ?? guild?.members.cache.get(fromId)?.user?.defaultAvatarURL
    if(avatarURL != null) embed.setThumbnail(avatarURL)
    embed.setDescription(guild?.members.cache.get(fromId)?.toString() + ' followed you.')
    embed.setFooter('Mute these alerts with !hf mute')

    if(!followMap[toId]) {
        followMap[toId] = [fromId]
        setFollowMap(serverId, followMap)
        if(!userIgnoresAlert(toId)) {
            guild?.members.cache.get(toId)?.send(embed)
        }
        
        // discord.client.guilds.cache.get(serverId)?.members.cache.get(toId)?.send("You have a new follower!")
        return true
    }
    if(followMap[toId]?.includes(fromId)) {
        //unfollow
        const currFollowers = followMap[toId]
        if(currFollowers !== undefined) {
            followMap[toId] = currFollowers.filter((id: string) => id !== fromId)
            setFollowMap(serverId, followMap)
            filterDataStore.setChannels(fromId, toId, serverId, [])
        }
        return false
    }

    followMap[toId]?.push(fromId)
    if(!userIgnoresAlert(toId)) guild?.members.cache.get(toId)?.send(embed)
    setFollowMap(serverId, followMap)
    return true
}