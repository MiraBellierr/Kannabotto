// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
		.setColor('#CD1C6C')
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