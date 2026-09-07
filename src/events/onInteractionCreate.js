import { Events, MessageFlags } from "discord.js";
import Logger from '../util/logger.js';
import GuildMember from '../entity/guildMember.js';
import UserProfile from "../entity/userProfile.js";

export default  {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const logger = new Logger('onInteractionCreate');
		
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				await interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Command does not exist' });
				return;
			}

			logger.info(`/${interaction.commandName} called by [${interaction.user.username} - ${interaction.user.id}]`);
			try {
				await command.execute(interaction);
			} catch (error) {
				logger.error(`${interaction.commandName} - ${error.message}`);
			}

			return;
		} else if (interaction.isModalSubmit()) {
			if ('identityModal' === interaction.customId) {
				await interaction.deferReply({ flags: MessageFlags.Ephemeral });

				/** @type {GuildMember} */
				let member = await GuildMember.find(interaction.user.id);
				if (!member) {
					member = new GuildMember(interaction.user.id);
					await member.save();
				}

				const profile = await member.hasProfile() ? await member.getProfile() : UserProfile.new(member.id);
				profile.name = interaction.fields.getTextInputValue('nameText');
				profile.gender = interaction.fields.getStringSelectValues('genderSelect');
				profile.pronouns = `${interaction.fields.getStringSelectValues('subjectivePronounSelect')}/${interaction.fields.getStringSelectValues('objectivePronounSelect')}`;
				profile.sexuality = interaction.fields.getStringSelectValues('sexualitySelect');

				await profile.save();
				await interaction.editReply({ content: 'Your identity is saved' });

				logger.info(`[${interaction.user.username} - ${interaction.user.id}] saved their new identity`);
			}

			if ('aboutModal' === interaction.customId) {
				await interaction.deferReply({ flags: MessageFlags.Ephemeral });

				/** @type {GuildMember} */
				let member = await GuildMember.find(interaction.user.id);
				if (!member) {
					member = new GuildMember(interaction.user.id);
					await member.save();
				}

				const profile = await member.hasProfile() ? await member.getProfile() : UserProfile.new(member.id);
				profile.about = interaction.fields.getTextInputValue('aboutText');

				await profile.save();
				await interaction.editReply({ content: 'Your about is saved' });

				logger.info(`[${interaction.user.username} - ${interaction.user.id}] saved their new about`);
			}
		}
	}
}
