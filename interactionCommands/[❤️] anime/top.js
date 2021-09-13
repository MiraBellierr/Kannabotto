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

const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'top',
	category: '[❤️] anime',
	description: 'Top 10 Anime, Characters or Manga',
	options: [{
		name: 'type',
		description: 'retrieve data from',
		type: 3,
		required: true,
		choices: [{
			name: 'Anime',
			value: 'anime',
		},
		{
			name: 'Characters',
			value: 'characters',
		},
		{
			name: 'Manga',
			value: 'manga',
		}],
	}],
	run: async (client, interaction) => {
		const type = interaction.options.getString('type');

		axios({
			method: 'get',
			url: `https://api.jikan.moe/v3/top/${type}`,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async response => {
			const top = response.data.top.splice(0, 10);
			const board = top.map((anime, i) => `**[${i + 1}] - [${anime.title}](${anime.url})**`).join('\n');

			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
				.setTitle(`Top 10 ${type.toLowerCase()}`)
				.setDescription(board)
				.setColor('#CD1C6C')
				.setTimestamp();

			return interaction.reply({ embeds: [embed] });
		}).catch(err =>{
			console.log(err);

			return interaction.reply('I didn\'t find any result');
		});
	},
};