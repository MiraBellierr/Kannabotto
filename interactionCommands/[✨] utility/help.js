const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const fs = require('fs');

module.exports = {
	name: 'help',
	category: '[✨] utility',
	description: 'Returns all commands',
	run: async (client, interaction) => {

		return getAll(client, interaction);
	},
};

function getAll(client, interaction) {
	const embed = new MessageEmbed()
		.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
		.setColor('RANDOM')
		.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
		.setTimestamp()
		.setTitle(`${client.user.username} Help Command`);

	const commands = (category) => {
		return client.interactions
			.filter(cmd => cmd.category === category)
			.map(cmd => ' ' + `\`${cmd.name}\``);
	};

	const info = fs.readdirSync('./interactionCommands')
		.map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
		.reduce((string, category) => string + '\n' + category);

	return interaction.reply({ embeds: [embed.setDescription(`<:discord:885340297733746798> [Invite Kanna](https://discord.com/api/oauth2/authorize?client_id=867048396358549544&permissions=0&scope=bot)\n<:kanna:885340978834198608> [Kanna's Kawaii Klubhouse](https://discord.gg/NcPeGuNEdc)\n\n${info}`)] });
}