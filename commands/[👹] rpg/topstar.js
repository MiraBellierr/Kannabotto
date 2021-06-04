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
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'topstar',
	aliases: ['ts'],
	description: 'Top star leaderboard',
	category: '[👹] rpg',
	example: `${bot_prefix}topstar`,
	run: async (client, message) => {

		message.guild.members.fetch(). then(async members => {
			const user = message.author.id;
			const m = await message.channel.send('*Loading...*');

			const Bag = Models.Bag();
			const Player = Models.Player();

			if (!await Bag.findOne({ where: { userId: user } })) {
				await Bag.create({
					userId: user,
				});
			}


			const player = await Player.findOne({ where: { userId: user } });


			const result = new Discord.MessageEmbed()
				.setDescription('No profile found 😓')
				.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

			if (!player) return message.channel.send(result);


			let board = [];
			const playerList = await Player.findAll({ attributes: ['userId'] });
			const playerListString = playerList.map(p => p.userId);
			for(let i = 0; i < playerListString.length; i++) {
				const value = Object.assign({ user: members.get(playerListString[i]) }, await Player.findOne({ where: { UserId: playerListString[i] } }));
				board.push(value);
			}

			board = board.filter(x => x.user);
			board = board.sort((a, b) => b.dataValues.rank - a.dataValues.rank).splice(0, 10);
			const top = board.map((x, i) => `[${i + 1}] **${x.user}** - ${x.dataValues.rank} ⭐`).join('\n');
			const embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setDescription(`**⭐ | Top 10 Star Players in The Server**\n\n${top}`);

			m.delete();
			return message.channel.send(embed);
		});

	},
};