import { Client, Collection, GatewayIntentBits } from 'discord.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { config } from 'dotenv';
import { updateCommands } from './util/cmdUpdate.js';
import Files from './util/files.js';

config();

if (!process.env.TOKEN) {
	console.log("Unable to login without token");
	process.exit(1);
}

updateCommands();

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]});
client.commands = new Collection();

const commands = Files.getCommandsDir();
const events = Files.getEventsDir();

for (const file of Files.getScriptFiles(commands)) {
	const p = path.join(commands, file);
	const cmd = await import(pathToFileURL(p));

	client.commands.set(cmd.data.name, cmd);
}

for (const file of Files.getScriptFiles(events)) {
	const p = path.join(events, file);
	const event = await import(pathToFileURL(p));

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);
