import Files from './files.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { REST, Routes } from 'discord.js';

export async function updateCommands() {
	if (!process.env.TOKEN) {
		console.log("Unable to upload commands without token");
		return 1;
	}

	const commands = [];
	const files = Files.getScriptFiles(Files.getCommandsDir());

	for (const f of files) {
		const command = await import(pathToFileURL(path.join(Files.getCommandsDir(), f)));
		commands.push(command.data.toJSON());
	}

	const discordRest = new REST().setToken(process.env.TOKEN);
	try {
		console.log(`Registering ${commands.length} commands`);
		
		if ('prod' === process.env.ENVIRONMENT) {
			await discordRest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
		} else {
			await discordRest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
		}
	} catch (error) {
		console.error(error);
	}
}

