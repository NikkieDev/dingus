import { Client, Collection, GatewayIntentBits } from 'discord.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { config } from 'dotenv';
import Files from './util/files.js';
import Loader from './util/Loader.js';
import Logger from './util/logger.js';
import SqliteConnection from './db/sqliteConnection.js';

config({ quiet: true });
const logger = new Logger('bot');
const database = new SqliteConnection();

if (!process.env.TOKEN) {
	logger.error('No token provided');
	process.exit(1);
}

const loader = new Loader(
	process.env.TOKEN,
	process.env.GUILD_ID,
	process.env.CLIENT_ID,
	'prod' === process.env.ENVIRONMENT
);
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]});
client.commands = new Collection();

for (const { name, cmd } of await loader.registerCommands()) {
	client.commands.set(name, cmd);
}

const events = Files.getEventsDir();
for (const file of Files.getScriptFiles(events)) {
	const p = path.join(events, file);
	const event = await import(pathToFileURL(p));

	if (!event.default.name) {
		logger.error(`Event ${p} is not valid`);
		process.exit(2);
	}

	if (event.once) {
		client.once(event.default.name, async (...args) => event.default.execute(...args));
	} else {
		client.on(event.default.name, async (...args) => await event.default.execute(...args));
	}
}

client.login(process.env.TOKEN);
logger.info('Client logged in');
