const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const config = require('../private/config.json');
const core = require('../core.js');

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
        if (await !core.accountExists(i.user.id)) {
            await core.initializeAccount(i.user.id);
        } else {
            return i.reply("Account exists");
        }
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