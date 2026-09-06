import { Events } from "discord.js";
import Guild from '../entity/guild.js';
import Logger from '../util/logger.js';

export default {
	name: Events.GuildCreate,
	async execute(guildObj) {
		const logger = new Logger('onGuildJoin');
		const guild = new Guild(
			guildObj.id,
			guildObj.ownerId,
			guildObj.name,
			guildObj.description
		);

		logger.info(`Joined ${guildObj.name} with ${guildObj.memberCount} members`);
		await guild.save();
	}
}
