const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Create a local map to store pending messages (temporary storage)
const pendingMessages = new Map();

module.exports = {
    roles: ["1236526332712587318"],
    user: ["1130139643141177445"],
    cooldown: 5,
    name: "dm",
    description: "DM a certain user.",
    async execute(message, client, args) {
        await message.delete(); // Delete the initial command message

        // Split the message content into arguments
        const commandArgs = message.content.split(' ');

        // Ensure the command is in the correct format
        if (commandArgs.length < 3) {
            return message.reply({ content: 'Usage: -dm [user] [message]', ephemeral: true });
        }

        // Extract the user ID and message
        const userId = commandArgs[1].replace(/[^0-9]/g, ''); // Remove any non-numeric characters
        const dmMessage = commandArgs.slice(2).join(' '); // Join the rest of the arguments as the message

        // Store the DM message in the temporary map
        pendingMessages.set(userId, dmMessage);

        try {
            // Fetch the user
            const user = await client.users.fetch(userId);

            // Create the button and action row for the initial DM
            const dmButton = new ButtonBuilder()
                .setCustomId(`viewPendingMail_${userId}`) // Include user ID in custom ID for tracking
                .setLabel('View Pending Mail')
                .setEmoji("<:TRP_MailUnread:1282101212740849785>")
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(dmButton);

            // Send the initial DM with the button
            await user.send({
                content: `Hey, ${user}, you have pending mail. Click the button below to view the message.`,
                components: [row]
            });

            // Notify the command author that the initial DM was sent
            await message.channel.send(`Initial DM with pending mail button sent to <@${userId}>.`);
            
        } catch (error) {
            console.error('Error sending DM:', error);
            await message.reply('There was an error sending the DM. Make sure the user ID is correct and the bot has permission to send DMs.');
        }
    }
};

// Export the map so it can be used in the interaction handler
module.exports.pendingMessages = pendingMessages;