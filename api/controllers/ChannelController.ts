import { reqSsrRef } from "@nuxtjs/composition-api";
import { Controller, Get, Put } from "@overnightjs/core";
import { Request, Response } from 'express'
import { filterDataStore, getSessionId } from '../data/database'

//TODO option to only send notif on hashtag / tag of bot (send to followers).
@Controller('channels')
export class ChannelController {

    @Get('access')
    private async getAllowedChannels(req: Request, res: Response) {
        const token = req.headers.authorization
        if(token == null) {
            res.send([])
            return
        }
        if(req.query.server != null) {
            res.send(await filterDataStore.fetchAllowedChannels(token, req.query.server.toString()))
        } else res.send({ status: "Invalid server ID" })
    }

    @Get()
    private async listChannels(req: Request, res: Response) {
        const token = req.headers.authorization
        if(token != null && req.query.server != null && req.query.id != null) {
            const userId = await getSessionId(token)
            const serverId = req.query.server.toString()
            const targetId = req.query.id.toString()
            res.send(await filterDataStore.getChannels(userId, targetId, serverId))
        } else res.send( { status: "Invalid query params." })
    }

    @Put()
    private async updateChannels(req: Request, res: Response) {
        //TODO verify has permission to view all channels
        const token = req.headers.authorization
        if(token != null && req.query.server != null && req.query.id != null) {
            const userId = await getSessionId(token)
            const serverId = req.query.server.toString()
            const targetId = req.query.id.toString()
            const allowedChannels = (await filterDataStore.fetchAllowedChannels(token, serverId)).map(chnl => chnl.id)
            const permittedChannels = []
            for(const channelId of req.body.channelIds) {
                if(allowedChannels.includes(channelId)) {
                    permittedChannels.push(channelId)
                }
            }
            await filterDataStore.setChannels(userId, targetId, serverId, permittedChannels)
            res.send({ status: "OK" })
        } else res.send( { status: "One or more parameters were invalid." })
    }
    
}