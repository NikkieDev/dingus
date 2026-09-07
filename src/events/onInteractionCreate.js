import { Events, MessageFlags } from "discord.js";
import Logger from '../util/logger.js';

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
				logger.error(error.message);
			}
		}
	}
}
