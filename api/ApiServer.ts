import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import DiscordManager from './discord/bot-manager';
import * as database from './data/database'

class ApiServer extends Server {

    private readonly SERVER_STARTED = 'API server started on port: ';
    private static discordManager : DiscordManager;

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        database.begin()
        this.setupControllers();
    }

    public static setDiscord(discordManager: DiscordManager) {
        this.discordManager = discordManager;
    }

    public static getDiscord() : DiscordManager { 
        return this.discordManager
    }

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                ctlrInstances.push(new controller());
            }
        }
        super.addControllers(ctlrInstances);
    }

    public start(port: number): void {
        this.app.get('*', (_, res) => {
            res.send(this.SERVER_STARTED + port);
        });
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_STARTED + port);
        });
    }
}

export default ApiServer;