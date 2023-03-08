const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./private/config.json');

const cmds = [];
const cmdFiles = fs.readdirSync('./commands').filter(f=>f.endsWith('.js'));

for (const f of cmdFiles) {
    const cmd = require(`./commands/${f}`);
    cmds.push(cmd.data.toJSON());
}

const r = new REST({version: '10'}).setToken(config.token);

(async () => {
    try {
        cmds.forEach(cmd => console.log(`Uploading ${cmd.name}`))
        const d = await r.put(Routes.applicationCommands(config.client_id), {body: cmds});
    } catch (err) {
        console.error(err);
    }
})();