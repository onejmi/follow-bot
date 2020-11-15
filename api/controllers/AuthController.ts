import { Request, Response } from 'express'
import { Controller, Post, Get } from "@overnightjs/core";

import axios from 'axios'
import { deleteSession, getSessionId, setSession } from '../data/database';

@Controller('auth')
export class AuthController {
    loggingInTokens: string[] = []

    @Post('login')
    private async loginUser(req: Request, res: Response) {
        const token = req.body.token
        this.loggingInTokens.push(token)
        const headers = { Authorization: token }
        const profile = await axios.get('https://discord.com/api/users/@me', { headers })
        if(profile.data?.id != null) {
            await setSession(token, profile.data.id)
            res.send({status: "OK"})
        }
        else res.send({status: "Invalid token"})
        this.loggingInTokens = this.loggingInTokens.filter(userToken => userToken !== token)
    }

    @Post('logout')
    private async logoutUser(req: Request, res: Response) {
        const token = req.body.token 
        deleteSession(token)
    }

    @Get('status')
    private async isLoggedIn(req: Request, res: Response) {
        const token = req.headers.authorization
        if(token != null && this.loggingInTokens.includes(token)) {
            res.send(true)
        }
        else res.send(token != null && (await getSessionId(token)) != null)
    }
}