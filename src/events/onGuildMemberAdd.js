import { Events } from "discord.js";
import GuildMember from '../entity/guildMember.js';
import Guild from "../entity/guild.js";
import Logger from '../util/logger.js';

export default {
	name: Events.GuildMemberAdd,
	async execute(memberObj) {
		const logger = new Logger('onGuildMemberAdd');

		if (memberObj.user.bot) {
			return;
		}

		if (!await GuildMember.findById(memberObj.user.id)) {
			const guild = await Guild.findById(memberObj.guild.id);
			const member = new GuildMember(
				memberObj.user.id,
				guild.id,
			);

			await member.save();
			logger.info(`User ${member.memberId} has joined Guild ${guild.name}`);
		}
	}
}

