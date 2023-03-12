const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../private/config.json');
const core = require('../modules/core');
const users = require('../modules/users');
const __tokens = require('../modules/__user_tokens');

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
        const em = new EmbedBuilder();
        let msg = '';

        if (!accCheck) {
            await core.initializeAccount(i.user.id);
            msg = `Your account has been created and your pronouns have been set to ${i.options.getString('pronouns')}`;

        } else msg = `Your pronouns have been set to ${i.options.getString('pronouns')}`;

        const bCheck = await __tokens.affordCheck(i.user.id, config.prices.pronounChange);

        if (!bCheck) return i.reply(`You do not have enough tokens (${config.prices.pronounChange})!\nBuy more with /store`);
        
        await users.setPronouns(i.user.id, i.options.getString('pronouns'));
        const bRemain = await __tokens.withdraw(i.user.id, config.prices.pronounChange, 'tokens');
        
        em.setAuthor({name: config.name})
        em.setDescription(msg);
        em.setColor(config.color)
        .setTitle('Pronouns')
        .setFooter({text: "Powered by KuByX Softworks"})
        .addFields(
            { name: "Remaining tokens", value: bRemain.toString(), inline: true },
            { name: "Tokens deducted", value: config.prices.pronounChange.toString(), inline: true }
        );

        return i.reply({embeds: [em], ephemeral: true});
    },

    async handleGet(i) {
        const fetchUser = i.options.getUser('target');
        const accCheck = await core.accountExists(fetchUser.id);
        const em = new EmbedBuilder();

        if (!accCheck) return i.reply("This user doesn't have an account yet!");
        else {
            const found = await core.fetchUser(fetchUser.id);
            let name = undefined;

            if (found.name != 'Not set') name = found.name;
            else name = fetchUser.username;

            em.setAuthor({name: config.name})
            .setColor(config.color)
            .setTitle(name)
            .setFooter({text: 'Powered by KuByX Softworks'})
            .addFields(
                { name: 'Gender', value: found.gender, inline: true },
                { name: 'Pronouns', value: found.pronouns, inline: true },
                { name: '\u200B', value: '\u200B', inline: false },
                { name: 'Partner (s/o)', value: found.sig_other, inline: true },
                { name: 'Sexuality', value: found.sexuality, inline: true }
            );

            return i.reply({embeds: [em], ephemeral: true});
        }
    },

    async execute(i) {
        try {
            const cmd = i.options.getSubcommand();

            if (cmd == 'set') await this.handleSet(i);
            else await this.handleGet(i);
        } catch (err) {
            await i.reply("An error has occured");
            return console.log(err);
        }
    }
}