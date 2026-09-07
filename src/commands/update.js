import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Update your pronoun profile'),
	async execute(ctx) {
		await ctx.reply('pong');
	}
}
