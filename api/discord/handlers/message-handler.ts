import { Message } from 'discord.js';

import { followMap } from '../../data/database'
import { handleCommand } from './command-handler';

export function handleMessage(message: Message) {
    if(message.content.startsWith("!")) {
        const parts = message.content.substring(1).split(" ")
        handleCommand(message, parts[0], parts.slice(1))
        return
    }
    const authorId = message.author.id
    const followers = followMap.get(authorId)
    if(followers != undefined && followers.length > 0) {
        for(const followerId of followers) {
            const follower = message.guild?.members.cache.get(followerId)
            if(follower == undefined) {
                //remove the follower who seems to have left the guild...
                const currFollowers = followMap.get(authorId)
                if(currFollowers !== undefined) { 
                    followMap.set(authorId, currFollowers.filter(id => id !== followerId))
                }
            }
            else follower?.send(`<@${message.author.id}> just said something! ${message.url}`)
        }
    }
}