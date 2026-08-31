
import Files from './files.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { REST, Routes } from 'discord.js';

export default class Loader {
	constructor(token, guildId, clientId, isProd) {
		this.token = token;
		this.guildId = guildId;
		this.clientId = clientId;
		this.isProd = isProd;

		this.rest = new REST().setToken(this.token);
	}

	async registerCommands() {
		const commands = [];
		const files = Files.getScriptFiles(Files.getCommandsDir());

		for (const f of files) {
			const commandPath = path.join(Files.getCommandsDir(), f);
			const command = await import(pathToFileURL(commandPath));

			if (!command.data) {
				console.log(`Event ${commandPath} is not valid`);
				process.exit(2);
			}

			commands.push({
				name: command.default.data.name,
				cmd: command.default,
				json: command.default.data.toJSON(),
			});
		}

		try {
			const payload = { body: commands.map(cmd => cmd.json) };
			const route = this.isProd
				? Routes.applicationCommands(this.clientId)
				: Routes.applicationGuildCommands(this.clientId, this.guildId)
			;

			await this.rest.put(route, payload);
		} catch (error) {
			console.error(error);
		}

		// pop json using destructuring
		return commands.map(({ json, ...cmd }) => cmd);
	}
}
