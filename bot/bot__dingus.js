const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./private/config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

const commandFiles = fs.readdirSync(commandsPath).filter(f=>f.endsWith('.js'));
const eventFiles = fs.readdirSync(eventsPath).filter(f=>f.endsWith('.js'));

for (const file of commandFiles) {
    const fPath = path.join(commandsPath, file);
    const cmd = require(fPath);

    client.commands.set(cmd.data.name, cmd);
}

for (const file of eventFiles) {
    const fPath = path.join(eventsPath, file);
    const event = require(fPath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(config.token);