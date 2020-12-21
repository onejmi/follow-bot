import { Message, MessageEmbed } from 'discord.js';
import { getFollowMap, setFollowNotifications } from '../../data/database'


export async function handleCommand(message: Message, command: string, args: string[]) {
    const prefix = "hf"
    const helpEmbed = new MessageEmbed({
        "title": "HeyFollowers Help 🔎",
        "description": "Here's a list of useful things to know!\n\n__**Commands**__\n\n`!hf follow <user>` Links a member's account to follow / unfollow\n`!hf followers` Displays your follow count\n`!hf mute/unmute` Toggle follower notifications\n`!hf help` How to use HeyFollowers",
        "footer": {
          "text": "heyfollow.live"
        },
        "thumbnail": {
          "url": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_28937.png&f=1&nofb=1"
        }
      })
    if(command == prefix) {
        if(args.length < 1) {
            message.channel.send(helpEmbed)
            return
        }
        if(args[0] == 'follow') {
            if(args.length < 2) {
                message.channel.send(helpEmbed)
                return
            }
            if(!args[1].startsWith('<') || !args[1].endsWith('>')) {
                message.channel.send(new MessageEmbed({ "description": "Invalid user!", "color": "#FF0000" }))
                return
            }
            if(message.guild == null) {
                message.channel.send("You can only follow inside a guild!")
                return
            }
    
            const targetId = args[1].substring(3, args[1].length - 1)
            
            const target = await message.guild.members.fetch(targetId)
            let image = target.user.avatarURL()?.toString() ?? target.user.defaultAvatarURL
            const followEmbed = new MessageEmbed()
                .setTitle("Follow " + target.displayName)
                .setURL(`https://heyfollow.live/users/${message.guild.id}/${targetId}`)
                .setImage(image)
           
           message.channel.send(followEmbed)
        }
        else if(args[0] == "help") {
            message.channel.send(helpEmbed)
        }
        else if(args[0] == "followers") {
            if(message.guild != null) {
                const followMap = await getFollowMap(message.guild.id)
                const followers = followMap[message.author.id]
                let followCount = 0
                if(followers != null) followCount = followers.length

                const followCountEmbed = new MessageEmbed()
                    .setTitle("Follow Count")
                    .setDescription(`You have ${followCount} follower${followCount != 1 ? 's' : ''}!`)
                    .setColor('#0099ff')
                
                message.channel.send(followCountEmbed)
            }  
        }
        else if(args[0] == "mute") {
            if(message.guild != null) {
                setFollowNotifications(message.author.id, false)

                const followCountEmbed = new MessageEmbed()
                    .setTitle("Notification Settings")
                    .setDescription("Successfully muted follow notifications")
                    .setColor('#0099ff')
                
                message.channel.send(followCountEmbed)
            }  
        }
        else if(args[0] == "unmute") {
            if(message.guild != null) {
                setFollowNotifications(message.author.id, true)

                const followCountEmbed = new MessageEmbed()
                    .setTitle("Notification Settings")
                    .setDescription("Successfully unmuted follow notifications")
                    .setColor('#0099ff')
                
                message.channel.send(followCountEmbed)
            }  
        }
    }
}