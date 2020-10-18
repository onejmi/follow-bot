import { Request, Response } from 'express';
import { Controller, Get } from "@overnightjs/core";

@Controller('status')
export class StatusController {
    @Get()
    private getStatus(req: Request, res: Response) {
        res.json({status: "OK"})
    }
}