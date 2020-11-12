
//further complicate things with per channel
//this needs to be PER SERVER.

import { dbPassword, dbName, dbUser } from './credentials'
import { MongoClient } from 'mongodb'

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.jlsao.mongodb.net/${dbName}?retryWrites=true&w=majority`
let client = new MongoClient(uri, { useNewUrlParser: true })

export async function getSession(key: string) {
    const session = await client.db().collection('sessions').findOne({ 'sessionId' : key })
    return session?.userId
}

export function setSession(key: string, userId: string) {
    client.db()
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

export async function begin() {
    client = await client.connect()
}

export async function follow(serverId: string, fromId: string, toId: string) {
    let followMap = await getFollowMap(serverId)
    if(followMap == null) followMap = new Map()
    if(!followMap[toId]) {
        followMap[toId] = [fromId]
        setFollowMap(serverId, followMap)
        return true
    }
    if(followMap[toId]?.includes(fromId)) {
        //unfollow
        const currFollowers = followMap[toId]
        if(currFollowers !== undefined) {
            followMap[toId] = currFollowers.filter((id: string) => id !== fromId)
            setFollowMap(serverId, followMap)
        }
        return false
    }

    followMap[toId]?.push(fromId)
    setFollowMap(serverId, followMap)
    return true
}