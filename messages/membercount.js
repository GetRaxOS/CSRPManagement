const { EmbedBuilder } = require('discord.js');

module.exports = {
    roles: ["1236526332712587318"],
    cooldown: 5,
    name: 'mc',
    description: "Shows server member count",
    async execute(message, client, args) {
        await message.delete();
        const guild = message.guild;

        // Fetch all members to ensure accurate presence status
        await guild.members.fetch();

        // Count online members by checking presence status not being 'offline'
        const onlineCount = guild.members.cache.filter(
            member => member.presence && member.presence.status !== 'offline'
        ).size;

        const mcEmbed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: client.user.displayAvatarURL() })
            .setColor(0xffdc03)
            .setThumbnail("https://cdn.discordapp.com/attachments/1248738234524237945/1249354833371332720/1CAC8E64-AB38-42C9-AFFA-3F9E1C308343.jpg?ex=66de4f9c&is=66dcfe1c&hm=91486fc14a4c6e2ef98933277956ac8ac0d015789d641c6652e02d88bd889a14&")
             .addFields(
                {
                    name: '<:TRP_Group:1277338082957332594> Members',
                    value: `- ${guild.memberCount}`,
                    inline: true
                },
                {
                    name: '<:TRP_Boost:1277339470605062298> Boosts',
                    value: `- ${guild.premiumSubscriptionCount}`,
                    inline: true
                }
            );

        message.channel.send({ embeds: [mcEmbed] });
    }
};