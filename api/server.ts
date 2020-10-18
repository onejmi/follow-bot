import ApiServer from './ApiServer';
import DiscordManager from './discord/bot-manager';

const discordManager = new DiscordManager()
discordManager.login()

const apiServer = new ApiServer();
const app = apiServer.app
module.exports = app