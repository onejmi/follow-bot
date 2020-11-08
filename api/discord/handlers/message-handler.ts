import { Message } from 'discord.js';

import { serverMap } from '../../data/database'
import { handleCommand } from './command-handler';

export function handleMessage(message: Message) {
    if(message.content.startsWith("!")) {
        const parts = message.content.substring(1).split(" ")
        handleCommand(message, parts[0], parts.slice(1))
        return
    }
    const authorId = message.author.id
    const guildId = message.guild?.id
    
    if(guildId == null) return
    const followers = serverMap.get(guildId)?.get(authorId)

    if(followers != undefined && followers.length > 0) {
        for(const followerId of followers) {
            const follower = message.guild?.members.cache.get(followerId)
            if(follower == undefined) {
                //remove the follower who seems to have left the guild...
                const currFollowers = serverMap.get(guildId)?.get(authorId)
                if(currFollowers !== undefined) { 
                    const followMap = serverMap.get(guildId)
                    if(followMap != null) {
                        followMap?.set(authorId, currFollowers.filter(id => id !== followerId))
                        serverMap.set(guildId, followMap)
                    }
                }
            }
            else follower?.send(`<@${message.author.id}> just said something! ${message.url}`)
        }
    }
}