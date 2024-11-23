const { EmbedBuilder } = require('discord.js');
const { pendingMessages } = require('../messages/dm'); // Adjust path as needed

module.exports = {
    name: 'interactionCreate', // Event name for interaction handling
    once: false, // Indicates the event should trigger every time an interaction is created
    async execute(client, interaction) {
        // Check if the interaction is a button and matches the 'viewPendingMail' custom ID
        if (!interaction.isButton() || !interaction.customId.startsWith('viewPendingMail_')) return;

        // Extract the user ID from the custom ID
        const userId = interaction.customId.split('_')[1];

        // Retrieve the DM message from the temporary storage
        const dmMessage = pendingMessages.get(userId);

        if (!dmMessage) {
            return interaction.reply({ content: 'No pending message found.', ephemeral: true });
        }

        try {
            // Create the embed message that will be shown when the button is clicked
            const DMdmessage = new EmbedBuilder()
                .setImage("https://cdn.discordapp.com/attachments/1135702056234139810/1249178327411851305/invisible_divider.png?ex=66ddab39&is=66dc59b9&hm=149b92dfd902e0ae2304fdd0e0071b5373eef6890ad5d5d5333&")
                .setDescription(`> ${dmMessage}`) // Display the actual message content
                .setFooter({ text: "Tampa Roleplay", iconURL: client.user.displayAvatarURL() })
                .setColor(0x2b2d31);

            // Update the interaction to show the actual message content when the button is clicked
            await interaction.update({
                content: null, // Clear the initial content
                embeds: [DMdmessage], // Show the actual message content
                components: [] // Remove the button after it's clicked
            });

            // Optionally remove the message from pendingMessages if no longer needed
            pendingMessages.delete(userId);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({ content: 'There was an error displaying the message.', ephemeral: true });
        }
    },
};