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
const Models = require('../../create-model.js');
const { PaginateContent } = require('../../Pagination');

module.exports = {
	name: 'topplayer',
	aliases: ['tp'],
	description: 'Top star leaderboard',
	category: '[👹] rpg',
	example: `${bot_prefix}topstar`,
	run: async (client, message) => {
		const members = await message.guild.members.fetch();

		const m = await message.reply('*Loading...*');

		const Player = Models.Player();

		const board = [];
		const playerList = await Player.findAll({ attributes: ['userId'] });
		const playerListString = playerList.map(p => p.userId);

		for(let i = 0; i < playerListString.length; i++) {
			const value = Object.assign({ user: members.get(playerListString[i]) }, await Player.findOne({ where: { UserId: playerListString[i] } }));
			board.push(value);
		}

		const starboard = board.filter(x => x.user);
		const levelboard = board.filter(x => x.user);

		// highest star
		const sortedStar = starboard.sort((a, b) => b.dataValues.rank - a.dataValues.rank).splice(0, 10);
		const starLeaderboard = sortedStar.map((x, i) => `[${i + 1}] **${x.user}** - ${x.dataValues.rank} ⭐`).join('\n');
		const starEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`**⭐ | Top 10 Highest Star in The Server**\n\n${starLeaderboard}`);

		// highest level
		const sortedLevel = levelboard.sort((a, b) => b.dataValues.level - a.dataValues.level).splice(0, 10);
		const levelLeaderboard = sortedLevel.map((x, i) => `[${i + 1}] **${x.user}** - Level ${x.dataValues.level} `).join('\n');
		const levelEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`**⚔ | Top 10 Highest Level in The Server**\n\n${levelLeaderboard}`);

		const pages = [levelEmbed, starEmbed];

		m.delete();

		const paginated = new PaginateContent.DiscordJS(client, message, pages);
		paginated.init();
	},
};