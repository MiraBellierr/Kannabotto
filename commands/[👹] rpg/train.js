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
const { createAllDataForNewUser, getUserDataAndCreate, checkPlayerExist, cooldown } = require('../../functions');

module.exports = {
	name: 'train',
	description: 'Train your character and gain xp',
	category: '[👹] rpg',
	example: `${bot_prefix}train`,
	run: async (client, message) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Cooldown = Models.Cooldown();
		const Player = Models.Player();
		const Economy = Models.Economy();

		await createAllDataForNewUser(user);

		const player = await getUserDataAndCreate(Player, user);
		const economy = await getUserDataAndCreate(Economy, user);

		if (economy.get('balance') < 20) return message.reply(`**${message.author.username}**, you don't have enough coins in your pocket to train your character.`);

		const timer = await cooldown('train', user, 300000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.minutes}m ${timer.seconds}s** till you can train your character again.`);
		}
		else {
			await Cooldown.update({ train: Date.now() }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') - 20 }, { where: { userId: user } });

			let xpAdd = Math.floor(Math.random() * 300) + 1;
			const bearTimer = await cooldown('bear', user, 3.6e+6);

			if (bearTimer.bool) {
				const xpAdd2 = Math.floor(Math.random() * 300) + 1;
				xpAdd = ((50 / 100) * xpAdd2) + xpAdd2;
			}

			const curxp = player.get('xp');

			await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });

			message.reply(`🛡 | **${message.author.username}**, You spent <a:jasminecoins:868105109748469780> 20 to train ${player.get('name')} and ${player.get('name')} gained **${xpAdd}** xp.`);
		}

		const player1 = await Player.findOne({ where: { userId: user } });

		if (player1.get('totalXp') < player1.get('xp')) {
			await Player.update({ totalXp: 100 * Math.pow(player.get('level') + 1, 3) }, { where: { userId: message.author.id } });
			await Player.update({ level: player.get('level') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ health: player.get('health') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ physicalAttack: player.get('physicalAttack') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ magicalAttack: player.get('magicalAttack') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ physicalResistance: player.get('physicalResistance') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ magicalResistance: player.get('magicalResistance') + 1 }, { where: { userId: message.author.id } });
			await Player.update({ speed: player.get('speed') + 1 }, { where: { userId: message.author.id } });
			message.reply(`🆙 | **${message.author.username}**, ${player.get('name')} has leveled up to level **${player.get('level') + 1}**`);
		}
	},
};