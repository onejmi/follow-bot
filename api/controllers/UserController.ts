import { Controller, Get, Patch, Post } from "@overnightjs/core";
import { Request, Response } from 'express';
import ApiServer from "../ApiServer";
import { serverMap, follow, sessions } from "../data/database";

@Controller('users')
export class UserController { 

    @Get(":server/members/:id")
    private async hasMember(req: Request, res: Response) {
        const guild = await ApiServer.getDiscord().client.guilds.fetch(req.params.server)
        const ans = await guild.members.fetch()
        res.json(ans.get(req.params.id)?.user)
    }

    @Get(':server/:id/followers')
    private getFollowers(req: Request, res: Response) {
        const serverId = req.params.server
        const userId = req.params.id
        const followers = serverMap.get(serverId)?.get(userId)
        res.json(followers ?? [])
    }

    @Patch(':server/:id/follow')
    private followUser(req: Request, res: Response) {
        //TODO make this more secure (ask for token and make request to manually get user id)
        const serverId = req.params.server
        const userId = req.params.id
        //const accessToken = req.headers.authorization
        if(req.headers.authorization != null) {
            const newFollower = sessions.get(req.headers.authorization)
            if(newFollower != null) follow(serverId, newFollower, userId)
        }
        res.json({status: "Follow user attempted."})
    }
}