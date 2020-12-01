import { ChildControllers, Controller, Get, Patch, Post, Put } from "@overnightjs/core";
import { Request, Response } from 'express';
import ApiServer from "../ApiServer";
import { follow, getFollowMap, getSessionId } from "../data/database";
import { ChannelController } from "./ChannelController";

@Controller('users')
@ChildControllers([
    new ChannelController()
])
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
        const followers = followMap == null ? null : followMap[userId]
        res.json(followers ?? [])
    }

    @Patch(':server/:id/follow')
    private async followUser(req: Request, res: Response) {
        //TODO make this more secure (ask for token and make request to manually get user id)
        const serverId = req.params.server
        const userId = req.params.id
        //const accessToken = req.headers.authorization
        if(req.headers.authorization != null) {
            const newFollower = await getSessionId(req.headers.authorization)
            if(newFollower != null) follow(serverId, newFollower, userId)
        }
        res.json({status: "Follow user attempted."})
    }
}