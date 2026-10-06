import { ButtonBuilder, ButtonStyle } from "discord.js";

export default new ButtonBuilder()
		.setCustomId('create_profile_btn')
		.setLabel('Create profile')
		.setStyle(ButtonStyle.Success)
	;

