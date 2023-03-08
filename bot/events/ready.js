const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} bot is running`);
        client.user.setActivity('your feelings', {type:ActivityType.Listening});
    }
}