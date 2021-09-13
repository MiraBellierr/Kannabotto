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
const { bot_prefix } = require('../../config.json');
const axios = require('axios');

module.exports = {
	name: 'top',
	category: '[❤️] anime',
	description: 'Top 10 Anime, Characters or Manga',
	example: `${bot_prefix}top [anime | characters | manga]`,
	usage: '[anime | character | manga]',
	run: async (client, message, args) => {
		let type = 'anime';

		if (args.length > 0) type = args[0];

		axios({
			method: 'get',
			url: `https://api.jikan.moe/v3/top/${type}`,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async response => {
			const m = await message.reply('*please wait...*');
			const top = response.data.top.splice(0, 10);
			const board = top.map((anime, i) => `**[${i + 1}] - [${anime.title}](${anime.url})**`).join('\n');

			const embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle(`Top 10 ${type.toLowerCase()}`)
				.setDescription(board)
				.setColor('#CD1C6C')
				.setTimestamp();

			m.delete();

			return message.reply({ embeds: [embed] });
		}).catch(err =>{
			console.log(err);

			return message.reply('I didn\'t find any result');
		});
	},
};