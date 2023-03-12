const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../private/config.json');
const core = require('../modules/core');
const __tokens = require('../modules/__user_tokens');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('token')
    .setDescription("Commands for tokens, gifts, and top-ups!")
    .addSubcommand(cmd =>
        cmd.setName('balance')
        .setDescription("View your token balance")
    )
    .addSubcommand(cmd =>
        cmd.setName('gift')
        .setDescription("Gift tokens to someone (warning: This uses gift tokens, the recipient does receive actual tokens)")
        .addUserOption(opt => opt.setName('recipient').setDescription("Who will receive your generous gift?").setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription("How much tokens will you send them?").setRequired(true).setMaxValue(1000))
    )
    .addSubcommand(cmd =>
        cmd.setName('buy')
        .setDescription("Top up on extra tokerecipientns for you, your friends, or your significant other!")
    ),

    async handleBuy(i) {
        const em = new EmbedBuilder()
        .setAuthor({name: config.name})
        .setDescription("Low on funds? Want to gift some tokens to your friends? Or do you need *UNLIMITED* tokens? For all your token needs, click on the links below")
        .setTitle('Store')
        .setFooter({text: "Powered by KuByX Softworks"})
        .setColor(config.color);

        const actions = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Visit store")
                .setStyle(ButtonStyle.Link)
                .setURL(`http://${config.url}/store`),
            new ButtonBuilder()
                .setLabel("Visit website")
                .setStyle(ButtonStyle.Link)
                .setURL(`http://${config.url}/`),
            new ButtonBuilder()
                .setLabel("Read eula")
                .setStyle(ButtonStyle.Link)
                .setURL(`http://${config.url}/eula`)
        )

        return await i.reply({embeds: [em], components: [actions], ephemeral: true})
    },

    async handleBalance(i) {
        const getBalance = [await __tokens.balanceCheck(i.user.id, 'tokens'), await __tokens.balanceCheck(i.user.id, 'gift_tokens')];

        const em = new EmbedBuilder()
        .setAuthor({name: config.name})
        .setTitle("Token balance")
        .setFooter({text: 'Powered by KuByX Softworks'})
        .setColor(config.color)
        .addFields(
            { name: 'Tokens', value: getBalance[0].toString(), inline: true },
            { name: 'Gift tokens', value: getBalance[1].toString(), inline: true }
        );

        const interactions = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Store")
                .setStyle(ButtonStyle.Link)
                .setURL(`http://${config.url}/store`)
            // gift button
        );
        
        return await i.reply({embeds: [em], components: [interactions], ephemeral: true});
    },

    async handleGift(i) {
        const [target, amount] = [i.options.getUser('recipient'), i.options.getInteger('amount')];
        const lmfao = {
            'recipient': target,
            'value': amount.toString()
        }
        return i.reply(lmfao.toString());
    },

    async execute(i) {
        try {
            const cmd = i.options.getSubcommand();

            if (cmd == 'buy') await this.handleBuy(i);
            else if (cmd == 'gift') await this.handleGift(i);
            else if (cmd == 'balance') await this.handleBalance(i);
        } catch (err) {
            await i.reply("An error has occured");
            console.log(err);
        }
    }
}