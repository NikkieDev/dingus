import {  ActionRowBuilder, Events } from "discord.js";
import GuildMember from '../entity/guildMember.js';
import Logger from '../util/logger.js';
import CreateAccountButton from '../ui/createAccountButton.js';

export default {
	name: Events.GuildMemberAdd,
	async execute(memberObj) {
		const logger = new Logger('onGuildMemberAdd');

		if (memberObj.user.bot) {
			return;
		}

		let member = null;
		if (!await GuildMember.find(memberObj.user.id)) {
			member = new GuildMember(memberObj.user.id);
			await member.save();
		} else {
			member = await GuildMember.find(memberObj.user.id);
		}

		if (!await member.hasProfile()) {
			try {
				const channel = memberObj.dmChannel || await memberObj.createDM();
				if (!channel) {
					logger.error(`Cannot get channel for user ${memberObj.user.globalName}/${memberObj.user.id}`);
					throw new Error('No channel');
				}

				await channel.send({
					content: `Hello! Thank you for joining **${memberObj.guild.name}**. You don't seem to have a pronoun profile yet :( you can create one with the button below!`,
					components: [new ActionRowBuilder().addComponents(CreateAccountButton)],
				});
			} catch (error) {
				logger.info(`Unable to message User ${memberObj.user.globalName}/${memberObj.user.id}.`);
				console.log(error);
			}
		}

		logger.info(`User ${member.memberId} has joined Guild ${memberObj.guild.name}`);
	}
}
