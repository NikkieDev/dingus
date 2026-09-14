import { LabelBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { MessageFlags, SlashCommandBuilder, TextInputStyle } from "discord.js";
import GuildMember from '../entity/guildMember.js';

export default {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Update your about'),
	async execute(ctx) {
		let member = await GuildMember.find(ctx.user.id);
		if (!member || !await member?.hasProfile()) {
			await ctx.reply({ flags: MessageFlags.Ephemeral, content: 'Please create an identity first with /identity'});
			return;
		}

		const username = ctx.user.globalName;
		const profile = await member.getProfile();

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
