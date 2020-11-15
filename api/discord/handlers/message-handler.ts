import { Message, MessageEmbed } from 'discord.js';
import { getFollowMap, setFollowMap, filterDataStore } from '../../data/database';

import { handleCommand } from './command-handler';

//TODO handle discarding certain channel follows if they lose permission to view it.
export async function handleMessage(message: Message) {
    if(message.content.startsWith("!")) {
        const parts = message.content.substring(1).split(" ")
        handleCommand(message, parts[0], parts.slice(1))
        return
    }
    const authorId = message.author.id
    const guildId = message.guild?.id
    
    if(guildId == null) return
    const followMap = await getFollowMap(guildId)
    const followers = followMap[authorId]

    if(followers != undefined && followers.length > 0) {
        for(const followerId of followers) {
            const follower = message.guild?.members.cache.get(followerId)
            if(follower == undefined) {
                //remove the follower who seems to have left the guild...
                const currFollowers = followMap[authorId]
                if(currFollowers !== undefined) {
                    if(followMap != null) {
                        followMap?.set(authorId, currFollowers.filter((id: string) => id !== followerId))
                        setFollowMap(guildId, followMap)
                    }
                }
            }
            else {
                const userId = follower.id
                const targetId = message.author.id 
                const serverId = message.guild?.id
                const botId = message.client.user?.id
                if(serverId != null && botId != null) {
                    const channels = await filterDataStore.getChannels(userId, targetId, serverId) ?? []
                    if(channels.includes(message.channel.id) && message.mentions.users.has(botId)) {
                        const embed = new MessageEmbed()
                        embed.setTitle('New Message (' + message.guild?.name + ')')
                        embed.setURL(message.url)
                        embed.setDescription(message.content)
                        embed.setAuthor(
                            message.author.username, 
                            message.author.avatarURL() ?? message.author.defaultAvatarURL, 
                            `http://localhost:3000/users/${serverId}/${targetId}`
                            )
                        const date = new Date(message.createdTimestamp)
                        embed.addField('Posted', date.toString())
                        embed.setFooter('heyfollow.club')
                        follower?.send(embed)
                    }
                }
            }
        }
    }
}