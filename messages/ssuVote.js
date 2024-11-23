const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");

global.maxVotes = 4; // Maximum number of votes required
global.voters = new Set(); // A set to track unique voters

module.exports = {
  name: "ssuvote",
  roles: ["1236526332712587318", "713430892168609932"], // Roles allowed to use this command
  description: "Sends a session poll.",
  cooldown: 5,
  async execute(message, client, args) {
    // Clear the voters set at the start of each poll
    voters.clear();

    // Specify the channel ID where the message should be sent
    const targetChannelId = "1236526333509632088"; // Replace with the actual channel ID
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (!targetChannel) {
      console.error(`Channel with ID ${targetChannelId} not found.`);
      return;
    }

    const label = `0/${maxVotes}`; // Initial label for the vote button
    const voteButton = new ButtonBuilder()
      .setCustomId("vote")
      .setLabel(label)
      .setStyle(ButtonStyle.Success); // Button for voting

    const voterListButton = new ButtonBuilder()
      .setCustomId("voters")
      .setLabel("Voters")
      .setStyle(ButtonStyle.Secondary); // Button to display voters

    const row = new ActionRowBuilder().addComponents(
      voteButton,
      voterListButton
    ); // Add buttons to the action row

    const timeNow = Math.floor(Date.now() / 1000); // Get current timestamp
    const ssuvoteEmbed = new EmbedBuilder()
      .setColor(0x2b2d31) // Embed color
      .setFooter({ text: "Immersive • Realistic • Fun" })
      .setDescription(
        `The <@&1236526332662517775> Team are thinking of starting a server session! If you'd like to participate and roleplay within the Tampa Region of Florida for a little while, we highly suggest you vote up.\n\n<:TRP_Text1:1277437292465619018> Votes Required: \`${maxVotes}\`\n<:TRP_Text2:1277437378658697236> Vote Time Start: <t:${timeNow}:R>\n<:TRP_Text3:1277437507692269608> Started by: ${message.author}`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&"
      ); // Embed image

    try {
      // Send the vote message to the specified channel
      await targetChannel.send({
        content:
          "@everyone <@&1236526332649672737> <@&1236526332662517775> - New Session Vote Notification!",
        embeds: [ssuvoteEmbed],
        components: [row],
      });

      // Set a timeout to delete the trigger message after a short delay
      setTimeout(() => {
        message
          .delete()
          .catch((err) =>
            console.error("Failed to delete the trigger message:", err)
          );
      }, 5000); // 5000ms = 5 seconds
    } catch (error) {
      console.error("Error sending vote message:", error);
    }
  },
};
