const { SlashCommandBuilder, EmbedBuilder, Embed, UserSelectMenuBuilder } = require('discord.js');
const config = require('../private/config.json');
const core = require('../core');
const users = require('../users');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pronouns')
    .setDescription("View & change pronouns for yourself or someone else")
    .addSubcommand(cmd => 
        cmd.setName('set')
        .setDescription("Set your preferred pronouns")
        .addStringOption(option =>
            option.setName('pronouns')
            .setDescription("examples: he/him, she/her, they/them, xe/xem")
            .setRequired(true)
            .setMaxLength(12)
        )
    )
    .addSubcommand(cmd =>
        cmd.setName('get')
        .setDescription("See your pronouns, or even someone else's!")
        .addUserOption(opt => opt.setName('target').setDescription("Who's pronouns would you like to see?").setRequired(true))
    ),

    async handleSet(i) {
        const accCheck = await core.accountExists(i.user.id);
        let msg = '';

        if (!accCheck) {
            await core.initializeAccount(i.user.id);
            msg = `Your account has been created and your pronouns have been set to ${i.options.getString('pronouns')}`;
        } else {
            await users.setPronouns(i.user.id, i.options.getString('pronouns'));
            msg = `Your pronouns have been set to ${i.options.getString('pronouns')}`;
        }

        return i.reply(msg);
    },

    async handleGet(i) {
        return;
    },

    async execute(i) {
        try {
            const cmd = i.options.getSubcommand();

            if (cmd == 'set') await this.handleSet(i);
            else await this.handleGet(i);
        } catch (err) {
            await i.reply("An error has occured");
            console.log(err);
        }
    }
}