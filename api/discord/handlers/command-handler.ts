import { Message, MessageEmbed } from 'discord.js';


export async function handleCommand(message: Message, command: string, args: string[]) {
    const prefix = "hf"
    const helpEmbed = new MessageEmbed({
        "title": "HeyFollowers Help 🔎",
        "description": "Here's a list of useful things to know!\n\n__**Commands**__\n\n`!hf follow <user>` links a member's account to follow / unfollow\n`!hf help` How to use HeyFollowers",
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
                message.channel.send(new MessageEmbed({ "description": "Invalid user!", "color": "red" }))
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
    }
}