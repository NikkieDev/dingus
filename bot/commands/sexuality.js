const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const conf = require('../private/config.json');
const core = require('../modules/core');
const users = require('../modules/users');
const __tokens = require('../modules/__user_tokens');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sexuality')
    .setDescription("Change your sexuality")
    .addStringOption(opt => 
        opt.setName('value')
        .setDescription("Change your sexuality to something new")
        .setRequired(true)
        .setMaxLength(16)
    ),

    async handleSexSet(i) {
        const accCheck = await core.accountExists(i.user.id);

        if (!accCheck) {
            await core.initializeAccount(i.user.id);
            return i.reply(`Your account has been created and your sexuality has been set to ${i.options.getString('value')}`)
        }

        const bCheck = await __tokens.affordCheck(i.user.id, conf.prices.sexChange, false);
        if (!bCheck) return await i.reply(`You do not have enough tokens (${conf.prices.sexChange}) to change your sexuality!`);

        await users.setSex(i.user.id, i.options.getString('value'));
        const bRemain = await __tokens.withdraw(i.user.id, conf.prices.sexChange, 'tokens');

        const em = new EmbedBuilder()
        .setAuthor({name: conf.name})
        .setDescription(`Your sexuality has been set to ${i.options.getString('value')}`)
        .setColor(conf.color)
        .setTitle('Sexuality')
        .setFooter({text: 'Powered by KuByX Softworks'})
        .addFields(
            { name: 'Remaining tokens', value: bRemain.toString(), inline: true },
            { name: 'Tokens deducted', value: conf.prices.sexChange.toString(), inline: true }
        );

        return i.reply({embeds: [em], ephemeral: true});
    },

    async execute(i) {
        try {
            this.handleSexSet(i);
        } catch (err) {
            await i.reply("An error has occured");
            return console.log(err);
        }
    }
}