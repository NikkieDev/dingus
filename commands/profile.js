import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Check a user\'s pronoun profile'),
	async execute(ctx) {
		
	}
}
