const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot\'s ping and round-trip latency.'),
    autocomplete: async function(interaction, client) {
        // This is optional, called on any autocomplete stuff
    },
    execute: async function(interaction, client) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const roundTripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = client.ws.ping;

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('Ping Information')
            .addFields(
                { name: 'Round-Trip Latency', value: `${roundTripLatency}ms`, inline: false },
                { name: 'Discord API Latency', value: `${apiLatency}ms`, inline: false }
            )
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() });

        interaction.editReply({ content: `${interaction.user}, here is your requested information`, embeds: [embed] });
    }
}