import { Message } from 'discord.js';
import * as database from '../../data/database';


export function handleCommand(message: Message, command: string, args: string[]) {
    if(command == 'follow') {
        if(args.length < 1) {
            message.channel.send("Usage: !follow <target>")
            return
        }
        if(!args[0].startsWith('<') || !args[0].endsWith('>')) {
            message.channel.send("Invalid user!")
            return
        }

        const targetId = args[0].substring(3, args[0].length - 1)
        const isFollow = database.follow(message.author.id, targetId)
        message.channel.send(`Successfully ${isFollow ? 'followed' : 'unfollowed'} user!`)
    }
}