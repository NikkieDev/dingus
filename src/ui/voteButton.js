import { ButtonBuilder, ButtonStyle } from "discord.js";
import Files from '../util/files.js';
import path from 'path';
import { pathToFileURL } from 'url';

const configFile = path.join(Files.getConfigsDir(), 'links.json');
const links = await import(pathToFileURL(configFile), { with: { type: 'json' } });

export default new ButtonBuilder()
		.setLabel('Vote on Top.GG!')
		.setStyle(ButtonStyle.Link)
		.setURL(links.default.vote.top_gg)
	;

