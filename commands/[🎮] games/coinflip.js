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

const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, checkBlacklist, blacklistMessage, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'coinflip',
	aliases: ['cf'],
	category: '[🎮] games',
	description: 'bet your coins on coinflip and get double reward if you win',
	example: `${bot_prefix}coinflip <heads | tails> <bet>`,
	usage: '<heads | tails> <bet>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Economy = Models.Economy();
		const Cooldown = Models.Cooldown();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkGuildDisable(message, 'games')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);
		if (await checkBlacklist(message, 'games')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}coinflip <heads | tails> <bet>\`.`);
		if (!args[1]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}coinflip <heads | tails> <bet>\`.`);

		const content = args[0].toLowerCase();

		if (isNaN(args[1])) return message.reply(`**${message.author.username}**, please make sure you bet with real coins after this.`);
		if (args[1] < 1 || args[1] > 1000) return message.reply(`**${message.author.username}**, You can bet from 1-1,000 only`);
		if (economy.get('balance') < args[1]) return message.reply(`**${message.author.username}**, you don't even have that much coins in your pocket to bet.`);

		const timer = await cooldown('coinflip', user, 15000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can play again.`);
		}
		else {
			await Cooldown.update({ coinflip: Date.now() }, { where: { userId: user } });

			if (content === 'heads') message.reply(`**${message.author.username}**, you chose ${content}`);
			else if (content === 'tails') message.reply(`**${message.author.username}**, you chose ${content}`);
			else return message.reply(`**${message.author.username}**, you can only choose \`heads\` or \`tails\`.`);

			const flip = ['heads', 'tails'];
			const botChoice = flip[Math.floor(Math.random() * flip.length)];
			const m = await message.reply('*Flipping coin...*');

			if (content === botChoice) {
				await Achievement.update({ coinflip: achievement.get('coinflip') + 1 }, { where: { userId: user } });
				await Economy.update({ balance: economy.get('balance') + parseInt(args[1]) }, { where: { userId: user } });

				setTimeout(() => m.edit(`*Flipping coin...* its **${botChoice}**! You won <a:jasminecoins:868105109748469780> ${(args[1]).toLocaleString()}`), 3000);
			}
			else {
				await Economy.update({ balance: economy.get('balance') - parseInt(args[1]) }, { where: { userId: user } });

				setTimeout(() => m.edit(`*Flipping coin...* its **${botChoice}**! You lost <a:jasminecoins:868105109748469780> ${(args[1]).toLocaleString()}`), 3000);
			}
		}
	},
};