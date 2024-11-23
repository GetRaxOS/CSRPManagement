const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('group')
        .setDescription('Gets the Tampa Roleplay group link!'),
    autocomplete: async function(interaction, client) {
        // This is optional, called on any autocomplete stuff
    },
    execute: async function(interaction, client) {

        const groupEmbed = new EmbedBuilder()
        .setColor(0xffdc03)
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setFields(
            {
                name: "Group Link",
                value: "[Link](https://www.roblox.com/groups/33102342/Tampa-Roleplay)",
                inline:  true
            },
            {
                name: "Owner",
                value: `[@Fe4ll10](https://www.roblox.com/users/1657993698/profile)`,
                inline: true
            }
        )
        interaction.reply({ content: null, embeds: [groupEmbed] })

    }
}