const { EmbedBuilder } = require("@discordjs/builders");
const axios = require("axios");
const nbx = require("noblox.js");

module.exports = {
  name: "ssu",
  roles: ["1236526332712587318", "713430892168609932"],
  description: "Start a server session!",
  cooldown: 5,
  async execute(message, client, args) {
    await message.delete();

    // Specify the channel ID where the message should be sent
    const targetChannelId = "1236526333509632088"; // Replace with the actual channel ID
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (!targetChannel) {
      console.error(`Channel with ID ${targetChannelId} not found.`);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.policeroleplay.community/v1/server",
        {
          headers: {
            "Server-Key": client.config.ERLC_API,
          },
        }
      );
      const server = response.data;

      await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

      const response2 = await axios.get(
        "https://api.policeroleplay.community/v1/server/queue",
        {
          headers: {
            "Server-Key": client.config.ERLC_API,
          },
        }
      );
      const queue = response2.data;

      const ownerName = await nbx.getUsernameFromId(server.OwnerId);
      const ssuEmbed = new EmbedBuilder()
        .setDescription(
          `The <@&1236526332662517775> Team are hosting a session! Join our **[ERLC server](https://policeroleplay.community/join/rptampa)** with the information below or use the quick join button provided above. \n\n<:TRP_Text1:1277437292465619018> **Server Name:** \` ${server.Name} \` \n<:TRP_Text2:1277437378658697236> **Server Code:** \` ${server.JoinKey} \`\n<:TRP_Text3:1277437507692269608> **Server Owner:** \` ${ownerName} \` or [Quick Link](https://www.roblox.com/users/${server.OwnerId}/profile)`
        )
        .setColor(0x2b2d31)
        .setFooter({ text: "Immersive • Realistic • Fun" })
        .setImage(
          "https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&"
        );

      await targetChannel.send({
        embeds: [ssuEmbed],
        content:
          "@everyone <@&1236526332649672737> <@&1236526332662517775> - New Session Notification!",
      });
    } catch (error) {
      console.error("Error fetching server data:", error);
    }
  },
};
