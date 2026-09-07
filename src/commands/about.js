import { LabelBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { SlashCommandBuilder, TextInputStyle } from "discord.js";
import GuildMember from '../entity/guildMember.js';
import UserProfile from '../entity/userProfile.js';

export default {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Update your about'),
	async execute(ctx) {
		const username = ctx.user.globalName;
		let member = await GuildMember.find(ctx.user.id);
		if (!member) {
			member = new GuildMember(ctx.user.id);
			await member.save();
		}
		const profile = await member.hasProfile() ? await member.getProfile() : UserProfile.new(member.id);

		const modal = new ModalBuilder()
			.setCustomId('aboutModal')
			.setTitle(`About ${username}`)
		;

		const aboutTextInput = new TextInputBuilder()
			.setCustomId('aboutText')
			.setValue(profile.about)
			.setRequired(true)
			.setMaxLength(256)
			.setStyle(TextInputStyle.Paragraph)
		;

		const aboutTextLabel = new LabelBuilder()
			.setLabel('About you')
			.setDescription('Games you like, hobbies you do, foods you love, etc. Within 256 characters.')
			.setTextInputComponent(aboutTextInput)
		;

		modal.addLabelComponents(aboutTextLabel);
		await ctx.showModal(modal);
	}
}
