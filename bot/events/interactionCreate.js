module.exports = {
    name: 'interactionCreate',
    async execute(i) {
        if (!i.isChatInputCommand()) return;

        const cmd = i.client.commands.get(i.commandName);

        if (cmd) {
            try {
                await cmd.execute(i);
            } catch (err) {
                console.log(`Error executing command ${i.commandName}'`);
                console.error(err);
            }
        }
    }
}