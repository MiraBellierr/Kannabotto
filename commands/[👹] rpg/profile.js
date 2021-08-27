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
const { getMember, checkPlayerExist, getUserDataAndCreate, createAllDataForNewUser } = require('../../functions');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');
const characters = require('../../database/characters.json');

module.exports = {
	name: 'profile',
	aliases: ['pro', 'pf'],
	description: 'Shows user\'s character profile',
	category: '[👹] rpg',
	example: `${bot_prefix}profile [username | id | mention]`,
	usage: '[username | id | mention]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' '));
		const user = member.user.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Bag = Models.Bag();
		const Player = Models.Player();
		const Images = Models.Images();

		const images = await Images.findOne({ where: { id: 1 } });

		const playerImages = images.dataValues.data[user];

		await createAllDataForNewUser(user);

		const bag = await getUserDataAndCreate(Bag, user);
		const player = await getUserDataAndCreate(Player, user);

		const members = await message.guild.members.fetch();
		let board = [];
		const playerList = await Player.findAll({ attributes: ['userId'] });
		const playerListString = playerList.map(p => p.userId);

		for(let i = 0; i < playerListString.length; i++) {
			const value = Object.assign({ user: members.get(playerListString[i]) }, await Player.findOne({ where: { UserId: playerListString[i] } }));
			board.push(value);
		}

		board = board.filter(x => x.user);
		board = board.sort((a, b) => b.dataValues.rank - a.dataValues.rank);
		const map = board.map((x) => x.user.id);
		const index = map.indexOf(user);
		const rank = index + 1;

		const profile = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(`Level ${player.get('level')} ${player.get('name')}`)
			.addField('__User Stats__', `**• 👑 Rank:** ${rank}\n**• <:hdstar:880340055619694632> Stars:** ${player.get('rank')}\n**• ⚔ Total Battles:** ${player.get('battle')}\n**• 🤺 Win rate:** ${isNaN((player.get('won') / player.get('battle')) * 100) ? '0.00%' : `${((player.get('won') / player.get('battle')) * 100).toFixed(2)}%`}\n**• 💀 Boss Captured:** ${playerImages.length}/${characters.length}`, true)
			.setColor('RANDOM')
			.addField('__Character Stats__', `**• <:class:880658124246237254> Class:** ${player.get('class')}\n**• <:xp:880655736261206036> XP:** ${player.get('xp')}/${player.get('totalXp')}\n**• <:health:880655864523014155> Health:** ${(100 * player.get('health')).toLocaleString()}\n**• <:pa:880665943959797811> Physical Attack:** ${player.get('physicalAttack')}\n**• <:ma:880664129487138826> Magical Attack:** ${player.get('magicalAttack')}\n**• <:pr:880665272535642162> Physical Resistance:** ${player.get('physicalResistance')}\n**• <:mr:880667328671518731> Magical Resistance:** ${player.get('magicalResistance')}\n**• <:speed:880668456066891826> Speed:** ${player.get('speed')}\n**• <:weapon:880669056024317963> Weapon:** ${bag.get('weapon')}`, true)
			.setImage(player.get('image'))
			.setTimestamp();

		message.reply({ embeds: [profile] });
	},
};