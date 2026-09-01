import { Events } from "discord.js";
import Logger from '../util/logger.js';
import GuildMember from '../model/discord/guildMember.js';

export default {
	name: Events.GuildMemberAdd,
	async execute(memberObj) {
		const member = GuildMember.fromObject(memberObj);
		const logger = new Logger('onGuildMemberAdd');

		logger.info(`User ${member.getId()}/${member.getGlobalName()} has joined Guild ${member.getGuild().getId()}/${member.getGuild().getName()}`);
	}
}

