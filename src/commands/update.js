import { LabelBuilder, ModalBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import path from "path";
import Files from '../util/files.js';
import GuildMember from '../entity/guildMember.js';
import UserProfile from "../entity/userProfile.js";

export default {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Update your pronoun profile'),
	async execute(ctx) {
		const identityPath = path.join(Files.getConfigsDir(), 'data.json');
		const identities = await import(pathToFileURL(identityPath), { with: { type: 'json'} });

		const username = ctx.user.globalName;
		const member = await GuildMember.findById(ctx.user.id);
		const profile = await member?.hasProfile() ? await member?.getProfile() : UserProfile.new();

		const modal = new ModalBuilder()
			.setCustomId('updateModal')
			.setTitle(`${username}'s profile`)
		;

		const selectors = [
			buildSelect('genderSelect', 'Male, Female, Non-binary, etc', 'What do you identify as?', identities.default.gender, profile.gender),
			buildSelect('subjectivePronounSelect', 'He, she, they, etc', 'Your subjective pronoun', identities.default.pronoun.subject, profile.getSubjectivePronoun()),
			buildSelect('objectivePronounSelect', 'Him, her, them, etc', 'Your objective pronoun', identities.default.pronoun.object, profile.getObjectivePronoun()),
			buildSelect('sexualitySelect', 'Hetero, gay, lesbian, etc', 'Who do you fall for?', identities.default.sexuality, profile.sexuality),
		];

		selectors.forEach(selector => modal.addLabelComponents(selector));
		await ctx.showModal(modal);
	}
}

function buildSelect(id, placeholder, label, values, setValue = null) {
	const options = [];

	for (const value of values) {
		let optionsBuilder = new StringSelectMenuOptionBuilder()
			.setLabel(value)
			.setValue(value)
		;

		if (setValue) {
			optionsBuilder = optionsBuilder.setDefault(value === setValue)
		}

		options.push(optionsBuilder);
	}

	const selector = new StringSelectMenuBuilder()
		.setCustomId(id)
		.setPlaceholder(placeholder)
		.addOptions(options)
	;

	const labelObj = new LabelBuilder()
		.setLabel(label)
		.setStringSelectMenuComponent(selector)
	;

	return labelObj;
}
