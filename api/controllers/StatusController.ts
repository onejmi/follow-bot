import { Request, Response } from 'express';
import { Controller, Get } from "@overnightjs/core";
import ApiServer from '../ApiServer';

@Controller('status')
export class StatusController {
    @Get()
    private getStatus(req: Request, res: Response) {
        res.json({status: "OK"})
    }

    @Get('servers/count')
    private getServerCount(req: Request, res: Response) {
        res.json({ count: ApiServer.getDiscord().client.guilds.cache.size })
    }
}