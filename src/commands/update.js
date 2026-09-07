import { LabelBuilder, ModalBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { pathToFileURL } from 'url';
import path from "path";
import Files from '../util/files.js';
import GuildMember from '../entity/guildMember.js';
import UserProfile from "../entity/userProfile.js";

export default {
	data: new SlashCommandBuilder()
		.setName('identity')
		.setDescription('Update your pronoun profile'),
	async execute(ctx) {
		const identityPath = path.join(Files.getConfigsDir(), 'data.json');
		const identities = await import(pathToFileURL(identityPath), { with: { type: 'json'} });

		const username = ctx.user.globalName;
		let member = await GuildMember.find(ctx.user.id);
		if (!member) {
			member = new GuildMember(ctx.user.id);
			await member.save();
		}
		const profile = await member.hasProfile() ? await member.getProfile() : UserProfile.new(member.id);

		const modal = new ModalBuilder()
			.setCustomId('identityModal')
			.setTitle(`${username}'s profile`)
		;

		const selectors = [
			buildSelect('genderSelect', 'Male, Female, Non-binary, etc', 'What do you identify as?', identities.default.gender, profile.gender),
			buildSelect('subjectivePronounSelect', 'He, she, they, etc', 'Your subjective pronoun', identities.default.pronoun.subject, profile.getSubjectivePronoun()),
			buildSelect('objectivePronounSelect', 'Him, her, them, etc', 'Your objective pronoun', identities.default.pronoun.object, profile.getObjectivePronoun()),
			buildSelect('sexualitySelect', 'Hetero, gay, lesbian, etc', 'Who do you fall for?', identities.default.sexuality, profile.sexuality),
		];

		const nameTextInput = new TextInputBuilder()
			.setCustomId('nameText')
			.setValue(profile.name || ctx.user.globalName)
			.setMinLength(3)
			.setMaxLength(24)
			.setStyle(TextInputStyle.Short)
		;

		const nameTextLabel = new LabelBuilder()
			.setLabel('What do you want people to call you?')
			.setTextInputComponent(nameTextInput)
		;

		modal.addLabelComponents(selectors);
		modal.addLabelComponents(nameTextLabel);

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
