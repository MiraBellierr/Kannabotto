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

/* eslint-disable no-lonely-if */
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const { checkPlayerExist, cooldown, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const Models = require('../../create-model.js');
const bossFight = require('../../utils/bossfight');
const challengeFight = require('../../utils/challengefight');
const randomFight = require('../../utils/randomfight');

module.exports = {
	name: 'battle',
	aliases: ['b'],
	description: 'battle and gain xp and coins',
	category: '[👹] rpg',
	example: `${bot_prefix}battle [mention | id | username | boss]`,
	usage: '[mention | id | username | boss]',
	run: async (client, message, args) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Cooldown = Models.Cooldown();
		const Player = Models.Player();

		await createAllDataForNewUser(user);

		const timer = await cooldown('battle', user, 15000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can battle again.`);
		}
		else {
			await Cooldown.update({ battle: Date.now() }, { where: { userId: user } });

			if (args.length > 0) {
				if (args[0].toLowerCase() === 'boss') {
					bossFight(message, user);
				}
				else {
					challengeFight(user, message, args);
				}
			}
			else {
				randomFight(message, user);
			}
		}

		const player = await getUserDataAndCreate(Player, user);

		if (player.get('totalXp') < player.get('xp')) {
			await Player.update({ totalXp: 100 * Math.pow(player.get('level') + 1, 3) }, { where: { userId: message.author.id } });
			await Player.update({ level: player.get('level') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ health: player.get('health') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ physicalAttack: player.get('physicalAttack') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ magicalAttack: player.get('magicalAttack') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ physicalResistance: player.get('physicalResistance') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ magicalResistance: player.get('magicalResistance') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ speed: player.get('speed') + 1 }, { where: { userId: message.author.id } });
			setTimeout(async function() {
				message.reply(`🆙 | **${message.author.username}**, ${player.get('name')} has leveled up to level **${player.get('level') + 1}**`);
			}, 4000);
		}
	},
};