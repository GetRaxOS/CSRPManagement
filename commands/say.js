const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	roles: ['1236526332712587318'], // required to have one of the listed role IDs
	users: ['1130139643141177445'], // user whitelist via ID
	cooldown: 5, // cooldown in seconds
	userPerms: ['ManageGuild'], // required user permissions
	clientPerms: ['Administrator'], // required bot permissions
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Say command, for your saying needs!')
		.addStringOption(x => x
			.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true)
		),
	async execute(interaction) {
		const input = interaction.options.getString('input');
		await interaction.reply({
			ephemeral: true,
			content: `<:TRP_Check:1277336634009849957> **Successfully sent** - ${input}`
		});
		await interaction.channel.send(`${input}`);
	},
};
