import {  ActionRowBuilder, Events } from "discord.js";
import GuildMember from '../entity/guildMember.js';
import Logger from '../util/logger.js';
import accountButton from '../ui/accountButton.js';
import voteButton from '../ui/voteButton.js';

export default {
	name: Events.GuildMemberAdd,
	async execute(memberObj) {
		const logger = new Logger('onGuildMemberAdd');

		const guildMemberId = memberObj.user.id;
		const guildMemberName = memberObj.user.globalName;
		const guildName = memberObj.guild.name;

		if (memberObj.user.bot) {
			return;
		}

		let member = null;
		if (!await GuildMember.find(guildMemberId)) {
			member = new GuildMember(guildMemberId);
			await member.save();
		} else {
			member = await GuildMember.find(guildMemberId);
		}

		if (!await member.hasProfile()) {
			try {
				const channel = memberObj.dmChannel || await memberObj.createDM();
				if (!channel) {
					logger.error(`Cannot get channel for user ${guildMemberName}/${guildMemberId}`);
					throw new Error('No channel');
				}

				const component = new ActionRowBuilder().addComponents(accountButton, voteButton)
				await channel.send({
					content: `Hello! Thank you for joining **${guildName}**. You don't seem to have a pronoun profile yet :( you can create one with the button below!`,
					components: [component],
				});

				logger.info(`Messaged user ${guildMemberId}/${guildMemberName} to create a profile`);
			} catch (error) {
				logger.info(`Unable to message User ${guildMemberName}/${guildMemberId}.`);
				console.log(error);
			}
		}

		logger.info(`User ${guildMemberId}/${guildMemberName} has joined Guild ${guildName}`);
	}
}
