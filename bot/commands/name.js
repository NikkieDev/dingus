const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const conf = require('../private/config.json');
const core = require('../modules/core');
const users = require('../modules/users');
const __tokens = require('../modules/__user_tokens');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('name')
    .setDescription("Change your name")
    .addStringOption(opt => 
        opt.setName('value')
        .setDescription("Change your name to something new")
        .setRequired(true)
        .setMaxLength(16)
    ),

    async handleNameSet(i) {
        const accCheck = await core.accountExists(i.user.id);

        if (!accCheck) {
            await core.initializeAccount(i.user.id);
            return i.reply(`Your account has been created and your name has been set to ${i.options.getString('value')}`)
        }

        const bCheck = await __tokens.affordCheck(i.user.id, conf.prices.nameChange, 'tokens');
        if (!bCheck) return await i.reply(`You do not have enough tokens (${conf.prices.nameChange}) to change your name!`);

        await users.setName(i.user.id, i.options.getString('value'));
        const bRemain = await __tokens.withdraw(i.user.id, conf.prices.nameChange, 'tokens');

        const em = new EmbedBuilder()
        .setAuthor({name: conf.name})
        .setDescription(`Your name has been set to ${i.options.getString('value')}`)
        .setColor(conf.color)
        .setTitle('Name')
        .setFooter({text: 'Powered by KuByX Softworks'})
        .addFields(
            { name: 'Remaining tokens', value: bRemain.toString(), inline: true },
            { name: 'Tokens deducted', value: conf.prices.nameChange.toString(), inline: true }
        );

        return i.reply({embeds: [em], ephemeral: true});
    },

    async execute(i) {
        try {
            this.handleNameSet(i);
        } catch (err) {
            await i.reply("An error has occured");
            return console.log(err);
        }
    }
}