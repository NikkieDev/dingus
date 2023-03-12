const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const conf = require('../private/config.json');
const core = require('../modules/core');
const users = require('../modules/users');
const __tokens = require('../modules/__user_tokens');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gender')
    .setDescription("Change your gender")
    .addStringOption(opt => 
        opt.setName('value')
        .setDescription("Change your gender to something new")
        .setRequired(true)
        .setMaxLength(16)
    ),

    async handleGenderSet(i) {
        const accCheck = await core.accountExists(i.user.id);

        if (!accCheck) {
            await core.initializeAccount(i.user.id);
            return i.reply(`Your account has been created and your gender has been set to ${i.options.getString('value')}`)
        }

        const bCheck = await __tokens.affordCheck(i.user.id, conf.prices.genderChange, false);
        if (!bCheck) return await i.reply(`You do not have enough tokens (${conf.prices.genderChange}) to change your gender!`);

        await users.setGender(i.user.id, i.options.getString('value'));
        const bRemain = await __tokens.withdraw(i.user.id, conf.prices.genderChange, 'tokens');

        const em = new EmbedBuilder()
        .setAuthor({name: conf.name})
        .setDescription(`Your gender has been set to ${i.options.getString('value')}`)
        .setColor(conf.color)
        .setTitle('Gender')
        .setFooter({text: 'Powered by KuByX Softworks'})
        .addFields(
            { name: 'Remaining tokens', value: bRemain.toString(), inline: true },
            { name: 'Tokens deducted', value: conf.prices.genderChange.toString(), inline: true }
        );

        return i.reply({embeds: [em], ephemeral: true});
    },

    async execute(i) {
        try {
            this.handleGenderSet(i);
        } catch (err) {
            await i.reply("An error has occured");
            return console.log(err);
        }
    }
}