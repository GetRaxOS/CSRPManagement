module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	async execute(message, client, args) {
        const sent = await message.reply({ content: "Fetching Discord Information", fetchReply: true });
        const roundTripLatency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = client.ws.ping;


        sent.edit({ content: `### <:TRP_Online:1278096474831323237> ${message.author}, here is your requested information\n-# <:TRP_Web:1277337217726939361> Discord API Latency: \`${apiLatency}ms\`\n-# <:TRP_World:1277336783016689706> Round-Trip Latency: \`${roundTripLatency}ms\`` });
    }
}