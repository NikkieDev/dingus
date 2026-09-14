import { MessageFlags, SlashCommandBuilder } from "discord.js";
import path from 'path';
import Files from '../util/files.js';
import GuildMember from '../entity/guildMember.js';
import { pathToFileURL } from "url";

export default {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote to support Pronounbot!'),
	async execute(ctx) {
		const configFile = path.join(Files.getConfigsDir(), 'links.json');
		const links = await import(pathToFileURL(configFile), { with: { type: 'json' } });

		let member = await GuildMember.find(ctx.user.id);
		if (!member) {
			member = new GuildMember(ctx.user.id);
		};

		const votes = await member.getVoteCount();

		let baseStr = `Please support Pronoun Bot by voting for it on ${links.default.vote.top_gg}`;
		if (0 < votes) {
			baseStr += `\nYou've voted for Pronoun Bot ${await member.getVoteCount()} already!`
		}

		return await ctx.reply({ flags: MessageFlags.Ephemeral, content: baseStr });
	}
}
