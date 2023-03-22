const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const conf = require('../private/config.json');
const ws = require('ws');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for our bot, and get 10 tokens for EACH vote!'),

    async execute(i) {
        const em = new EmbedBuilder()
        .setAuthor({name: conf.name})
        .setTitle("Vote")
        .setDescription("You can vote once every 12 hours on each site. Every vote grants you 10 tokens.")
        .setFooter({text: "Powered by KuByX Softworks"})
        .setColor(conf.color)
        .addFields(
            { name: 'DiscordBotList', value: 'Voting', inline: false },
            { name: 'Coming soon', value: 'More coming soon!', inline: false }
        )

        const inter = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Site 1")
                .setStyle(ButtonStyle.Link)
                .setURL('https://discordbotlist.com/bots/dingus')
        );

        const Soc = new ws('ws://localhost:3006');
        Soc.onopen = () => {
            Soc.send(JSON.stringify({state: 'connect', authorization: 'CLIENTELE', target: 'user', userid: i.user.id}));
        }

        Soc.on('message', async msg => {
            const decoder = new TextDecoder();
            const data = JSON.parse(decoder.decode(msg));

            if (data.command == 'close') {
                Soc.close();
            } else if (data.state == 'balanceTopped') {
                return await i.editReply("Your vote has been confirmed, your balance has increased!");
            }
            
            console.log(data);
        })

        return await i.reply({embeds: [em], components: [inter], ephemeral: true});
    }
}