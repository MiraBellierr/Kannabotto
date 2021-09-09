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
const { splitArrayIntoChunksOfLen } = require('../../functions');
const { PaginateContent } = require('../../Pagination');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb'],
	description: 'Top players leaderboard',
	category: '[👹] rpg',
	example: `${bot_prefix}leaderboard [rpg | star | level | economy]`,
	run: async (client, message, args) => {
		const members = await message.guild.members.fetch();

		const m = await message.reply('*Loading...*');

		const Player = Models.Player();

		const board = [];
		const playerList = await Player.findAll({ attributes: ['userId'] });
		const playerListString = playerList.map(p => p.userId);

		for(let i = 0; i < playerListString.length; i++) {
			const value = Object.assign({ user: await client.users.fetch(playerListString[i]) }, await Player.findOne({ where: { UserId: playerListString[i] } }));
			board.push(value);
		}

		let input;

		if (!args.length) {
			input = 'rpg';
		}
		else {
			input = args[0].toLowerCase();
		}

		// rpg leaderboard
		if (input === 'rpg') {
			const filterBoard = board.filter(x => x);
			const sortedBoard = filterBoard.sort((a, b) => b.dataValues.level - a.dataValues.level);
			const mappedBoard = sortedBoard.map((x, i) => `[${i + 1}] ${x.user.username} - **Level ${x.dataValues.level}**`);
			const chunks = splitArrayIntoChunksOfLen(mappedBoard, 10);
			const leaderboardPages = [];

			chunks.forEach((e, i) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setColor('RANDOM')
					.setTimestamp()
					.setFooter(`Page ${i + 1}/${chunks.length}`)
					.setDescription(`**⚔ | RPG leaderboard**\n\n${e.join('\n')}`);

				leaderboardPages.push(embed);
			});

			m.delete();
			const paginated = new PaginateContent.DiscordJS.Paginate(client, message, leaderboardPages);
			paginated.init();

		}
		// star leaderboard
		else if (input === 'star') {
			const filterBoard = board.filter(x => x);
			const sortedBoard = filterBoard.sort((a, b) => b.dataValues.rank - a.dataValues.rank);
			const mappedBoard = sortedBoard.map((x, i) => `[${i + 1}] ${x.user.username} - **<:hdstar:880340055619694632> ${x.dataValues.rank} **`);
			const chunks = splitArrayIntoChunksOfLen(mappedBoard, 10);
			const leaderboardPages = [];

			chunks.forEach((e, i) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setColor('RANDOM')
					.setTimestamp()
					.setFooter(`Page ${i + 1}/${chunks.length}`)
					.setDescription(`**⭐ | Star leaderboard**\n\n${e.join('\n')}`);

				leaderboardPages.push(embed);
			});

			m.delete();
			const paginated = new PaginateContent.DiscordJS.Paginate(client, message, leaderboardPages);
			paginated.init();
		}
		// level leaderboard
		else if (input === 'level') {
			const Level = Models.Level();
			let board2 = [];
			const levelList = await Level.findAll({ attributes: ['userId'] });
			const levelListString2 = levelList.map(p => p.userId);
			const levelListString = [];

			levelListString2.forEach(id => {
				if (!members.get(id)) return;

				levelListString.push(id);
			});

			for(let i = 0; i < levelListString.length; i++) {
				const value = Object.assign({ user: members.get(levelListString[i]) }, await Level.findOne({ where: { UserId: levelListString[i] } }));

				board2.push(value);
			}

			board2 = board2.filter(x => x.user);
			board2 = board2.sort((a, b) => b.dataValues.xp - a.dataValues.xp);
			const top = board2.map((x, i) => `[${i + 1}] ${x.user} - **Level: ${x.dataValues.level.toLocaleString()} | XP: ${x.dataValues.xp.toLocaleString()}**`);
			const chunks = splitArrayIntoChunksOfLen(top, 10);
			const leaderboardPages = [];

			chunks.forEach((e, i) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setColor('RANDOM')
					.setTimestamp()
					.setFooter(`Page ${i + 1}/${chunks.length}`)
					.setDescription(`**📝 | Kanna Usage leaderboard For This Server**\n\n${e.join('\n')}`);

				leaderboardPages.push(embed);
			});

			m.delete();
			const paginated = new PaginateContent.DiscordJS.Paginate(client, message, leaderboardPages);
			paginated.init();
		}
		// economy leaderboard
		else if (input === 'economy') {
			const Economy = Models.Economy();
			let board3 = [];
			const economyList = await Economy.findAll({ order: [['balance', 'DESC']], limit: 10, attributes: ['userId'] });
			const economyListString = economyList.map(p => p.userId);

			for(let i = 0; i < economyListString.length; i++) {
				const value = Object.assign({ user: await client.users.fetch(economyListString[i]) }, await Economy.findOne({ where: { UserId: economyListString[i] } }));

				board3.push(value);
			}

			board3 = board3.filter(x => x.user);
			board3 = board3.sort((a, b) => (b.dataValues.balance + b.dataValues.bank) - (a.dataValues.balance + a.dataValues.bank));

			const top = board3.map((x, i) => `[${i + 1}] ${x.user.username} - <a:jasminecoins:868105109748469780> **${(x.dataValues.balance + x.dataValues.bank).toLocaleString()}**`);
			const chunks = splitArrayIntoChunksOfLen(top, 10);
			const leaderboardPages = [];

			chunks.forEach((e, i) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setColor('RANDOM')
					.setTimestamp()
					.setFooter(`Page ${i + 1}/${chunks.length}`)
					.setDescription(`**💰 | Economy leaderboard**\n\n${e.join('\n')}`);

				leaderboardPages.push(embed);
			});

			m.delete();
			const paginated = new PaginateContent.DiscordJS.Paginate(client, message, leaderboardPages);
			paginated.init();
		}
		// other than above input
		else {
			m.delete();
			message.reply('No leaderboard found.');
		}
	},
};