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
const { bot_prefix } = require('../../config.json');
const Models = require('../../create-model');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb'],
	category: '[🎮] level',
	example: `${bot_prefix}leaderboard [global]`,
	description: 'See the top 10 highest user in your server or global',
	run: async (client, message) => {
		message.guild.members.fetch(). then(async members => {
			const m = await message.reply('*Please wait...*');
			const Level = Models.Level();
			let board = [];
			const levelList = await Level.findAll({ attributes: ['userId'] });
			const levelListString2 = levelList.map(p => p.userId);
			const levelListString = [];

			levelListString2.forEach(id => {
				if (!members.get(id)) return;

				levelListString.push(id);
			});

			for(let i = 0; i < levelListString.length; i++) {
				const value = Object.assign({ user: members.get(levelListString[i]) }, await Level.findOne({ where: { UserId: levelListString[i] } }));

				board.push(value);
			}

			board = board.filter(x => x.user);
			board = board.sort((a, b) => b.dataValues.xp - a.dataValues.xp).splice(0, 10);
			const top = board.map((x, i) => `[${i + 1}] ${x.user} - Level: **${x.dataValues.level.toLocaleString()}** | XP: **${x.dataValues.xp.toLocaleString()}**`).join('\n');

			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setDescription(`**🆙 | Top 10 Level XP Users in The Server**\n\n${top}`);

			m.delete();

			return message.reply({ embeds: [embed] });
		});
	},
};