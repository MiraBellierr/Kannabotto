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
	name: 'train',
	description: 'Train your character and gain xp',
	category: '[👹] rpg',
	example: `${bot_prefix}train`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Cooldown = Models.Cooldown();
			const Player = Models.Player();
			const Economy = Models.Economy();

			if (!await Cooldown.findOne({ where: { userId: user } })) {
				await Cooldown.create({
					userId: user,
				});
			}
			const cooldown = await Cooldown.findOne({ where: { userId: user } });


			const player = await Player.findOne({ where: { userId: user } });


			if (!await Economy.findOne({ where: { userId: user } })) {
				await Economy.create({
					userId: user,
				});
			}
			const economy = await Economy.findOne({ where: { userId: user } });


			const result = new Discord.MessageEmbed()
				.setDescription('No profile found 😓')
				.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

			if (!player) return message.channel.send(result);
			if (economy.get('balance') < 20) return message.channel.send(`**${message.author.username}**, you don't have enough coins in your pocket to train your character.`);

			const timeOut = 300000;
			const lastTrain = await cooldown.get('train');
			if (lastTrain !== null && timeOut - (Date.now() - lastTrain) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastTrain));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.minutes}m ${timeObj.seconds}s** till you can train your character again.`);
			}
			else {
				await Cooldown.update({ train: Date.now() }, { where: { userId: user } });
				await Economy.update({ balance: economy.get('balance') - 20 }, { where: { userId: user } });
				let xpAdd = Math.floor(Math.random() * 300) + 1;
				const timeOut2 = 3.6e+6;
				const lastbear = await cooldown.get('bear');
				if (lastbear !== null && timeOut2 - (Date.now() - lastbear) > 0) {
					const xpAdd2 = Math.floor(Math.random() * 300) + 1;
					xpAdd = ((50 / 100) * xpAdd2) + xpAdd2;
				}
				const curxp = player.get('xp');
				await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });

				message.channel.send(`🛡 | **${message.author.username}**, You spent <a:jasminecoins:868105109748469780> 20 to train ${player.get('name')} and ${player.get('name')} gained **${xpAdd}** xp.`);

			}

			const player1 = await Player.findOne({ where: { userId: user } });
			if (player1.get('totalXp') < player1.get('xp')) {
				await Player.update({ totalXp: Math.floor(player.get('level') * 2.5 * 500) }, { where: { userId: message.author.id } });
				await Player.update({ level: player.get('level') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ health: player.get('health') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ speed: player.get('speed') + 1 }, { where: { userId: message.author.id } });
				message.channel.send(`🆙 | **${message.author.username}**, ${player.get('name')} has leveled up to level **${player.get('level') + 1}**`);
			}
		});
	},
};