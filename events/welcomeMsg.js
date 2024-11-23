const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(client, member) {
        const welcomeChannelId = "1236526333945712683";
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        const guild = member.guild;
        const membercount = guild.memberCount;

        if (welcomeChannel) {
            const welcomeMessage = `Welcome ${member} to \`${guild.name}\`. We're glad to have you here!`;

            const mcButton = new ButtonBuilder()
                .setCustomId('mcButton')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("1280668866313322579") // Correctly set a custom emoji ID
                .setLabel(membercount.toString()) // Ensure membercount is a string
                .setDisabled(true);

            const homeButton = new ButtonBuilder()
                .setLabel("Home")
                .setEmoji("1277338242940932157") // Correctly set a custom emoji ID
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/channels/1236526332628828231/1238617102907342901"); // Add a URL for the link button

            const row = new ActionRowBuilder().addComponents(mcButton, homeButton);

            try {
                await welcomeChannel.send({ content: `${welcomeMessage}`, components: [row] });
            } catch (error) {
                console.error(`Failed to send welcome message: ${error}`);
            }
        } else {
            console.error(`Channel with ID ${welcomeChannelId} not found.`);
        }
    }
};