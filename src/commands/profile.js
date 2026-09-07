import { MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";
import GuildMember from '../entity/guildMember.js';
import UserProfile from "../entity/userProfile.js";

export default {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Check a user\'s pronoun profile')
		.addUserOption(option => option.setName('user').setDescription('Who\'se identity do you want to see?').setRequired(true)),
	async execute(ctx) {
		await ctx.deferReply({ flags: MessageFlags.Ephemeral });

		const target = ctx.options.getUser('user');
		const member = await GuildMember.find(target.id);

		if (!member || !await member.hasProfile()) {
			await ctx.editReply({ content: 'This member does not have a profile yet. Encourage them!' });
			return;
		}

		/* @type {UserProfile} */
		const profile = await member.getProfile();

		const textDisplay = new TextDisplayBuilder().setContent(
			`**${target.globalName}'s** identity\n\nCall me **${profile.name}**\nRefer to me as: **${profile.pronouns}**\nI'm **${profile.gender}** and **${profile.sexuality}**
			\nAbout ${profile.name}:\n${profile.about}`
		);

		await ctx.editReply({
			components: [textDisplay],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
