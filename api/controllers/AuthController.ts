import { Request, Response } from 'express'
import { Controller, Post } from "@overnightjs/core";

import axios from 'axios'

import { sessions } from '../data/database'

@Controller('auth')
export class AuthController {
    @Post('login')
    private async loginUser(req: Request, res: Response) {
        const token = req.body.token
        const headers = { Authorization: token }
        const profile = await axios.get('https://discord.com/api/users/@me', { headers })
        if(profile.data?.id != null) {
            sessions.set(token, profile.data.id)
        }
    }

    @Post('logout')
    private async logoutUser(req: Request, res: Response) {
        const token = req.body.token 
        sessions.delete(token)
    }
}