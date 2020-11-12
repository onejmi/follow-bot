import { Controller, Get, Patch, Post } from "@overnightjs/core";
import { Request, Response } from 'express';
import ApiServer from "../ApiServer";
import { follow, getFollowMap, getSession } from "../data/database";

@Controller('users')
export class UserController { 

    @Get(":server/members/:id")
    private async hasMember(req: Request, res: Response) {
        const guild = await ApiServer.getDiscord().client.guilds.fetch(req.params.server)
        const ans = await guild.members.fetch()
        res.json(ans.get(req.params.id)?.user)
    }

    @Get(':server/:id/followers')
    private async getFollowers(req: Request, res: Response) {
        const serverId = req.params.server
        const userId = req.params.id
        const followMap = await getFollowMap(serverId)
        const followers = followMap[userId]
        res.json(followers ?? [])
    }

    @Patch(':server/:id/follow')
    private async followUser(req: Request, res: Response) {
        //TODO make this more secure (ask for token and make request to manually get user id)
        const serverId = req.params.server
        const userId = req.params.id
        //const accessToken = req.headers.authorization
        if(req.headers.authorization != null) {
            const newFollower = await getSession(req.headers.authorization)
            if(newFollower != null) follow(serverId, newFollower, userId)
        }
        res.json({status: "Follow user attempted."})
    }
}