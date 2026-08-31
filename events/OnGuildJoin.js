import { Events } from "discord.js";
import Guild from '../model/guild.js';
import Logger from '../util/logger.js';

export default {
	name: Events.GuildCreate,
	async execute(guildObj) {
		const guild = Guild.fromObject(guildObj);
		const logger = new Logger('onGuildJoin');

		logger.info(`Joined ${guild.getName()} with ${guild.getMemberCount()} members`);
	}
}
