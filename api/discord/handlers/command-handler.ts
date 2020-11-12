import { Message, MessageEmbed } from 'discord.js';


export async function handleCommand(message: Message, command: string, args: string[]) {
    if(command == 'follow') {
        if(args.length < 1) {
            message.channel.send("Usage: !follow <target>")
            return
        }
        if(!args[0].startsWith('<') || !args[0].endsWith('>')) {
            message.channel.send("Invalid user!")
            return
        }
        if(message.guild == null) {
            message.channel.send("You can only follow inside a guild!")
            return
        }

        const targetId = args[0].substring(3, args[0].length - 1)
       // const isFollow = database.follow(message.guild.id, message.author.id, targetId)
       //  message.channel.send(`Successfully ${isFollow ? 'followed' : 'unfollowed'} user!`)
        
        const target = await message.guild.members.fetch(targetId)
        let image = target.user.avatarURL()?.toString() ?? target.user.defaultAvatarURL
        const followEmbed = new MessageEmbed()
            .setTitle("Follow " + target.displayName)
            .setURL(`http://localhost:3000/users/${message.guild.id}/${targetId}`)
            .setImage(image)
       
       message.channel.send(followEmbed)
    }
}