const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const path = require('path');
const sql = require('sqlite3');
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
        const db = new sql.Database(path.join(__dirname, '../../private/db.sqlite3'));

        db.all("SELECT * FROM users WHERE userid = ?", [i.user.id], (err, rows) => {
            if (err) {
                console.error(err.message);
                return i.reply("An error has occured");
            }
            
            const q = "UPDATE users SET pronouns = ? WHERE userid = ?";
            const d = [i.options.getString('pronouns'), i.user.id];

            if (rows.length == 1) {
                core.execQuery(i, q, d);
                core.execQuery(i, "UPDATE users SET tokens = ? WHERE userid = ?", [rows[0].tokens-config.prices.cheap, i.user.id])

                return i.reply(`Your pronouns have been set to ${i.options.getString('pronouns')}\nYou now have ${rows[0].tokens-config.prices.cheap} tokens`);
            } else if (rows.length > 1) {
                return i.reply('A database interferance has occured, please contact support.');
            } else {
                core.initializeAccount(i);
                core.execQuery(i, q, d);
                core.execQuery(i, "UPDATE users SET tokens = ? WHERE userid = ?", [rows[0].tokens-config.prices.cheap, i.user.id])

                return i.reply(`Your account has been created and your pronouns have been set to ${i.options.getString('pronouns')}\nYou now have ${rows[0].tokens-config.prices.cheap} tokens`);
            }
        });

        db.close(err => {
            if (err) return console.error(err.message);
        });

        return;
    },

    async handleGet(i) {
        const db = new sql.Database(path.join(__dirname), '../../private/db.sqlite3');

        db.all("SELECT * FROM users WHERE userid = ?", [i.options.getUser('target').id], (err, rows) => {
            if (err) {
                console.error(err.message);
                return i.reply("An error has occured");
            }
            console.log(rows);
            const q = "SELECT pronouns FROM users WHERE userid = ?";
            const d = [i.options.getUser('target').id];

            if (rows.length == 1) {
                const user = core.execQuery(i, q, d, true);
                
                return i.reply(`${i.options.getUser('target').username}'s pronouns are ${user}`);
            } else if (rows.length > 1) return i.reply('A database interferance has occured, please contact support.');
            else return i.reply("Couldn't find that user!");
        });

        db.close(err => {
            if (err) return console.error(err.message);
        });
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