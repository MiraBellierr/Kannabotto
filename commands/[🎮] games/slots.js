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
function shuffle(array) {
	const arr = array.slice(0);
	for(let i = arr.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'slots',
	aliases: ['slot', 'sl'],
	category: '[🎮] games',
	description: 'Play the slot machine.',
	example: `${bot_prefix}slots <amount>`,
	usage: '<amount>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkGuildDisable(message, 'games')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);
		if (await checkBlacklist(message, 'games')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);


		const slots = ['🐹', '🐶', '🐵', '🐱', '🐸', '🐻', '🐰'];
		if (!args[0]) return message.reply(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}slots <amount>\`.`);
		if (isNaN(args[0])) return message.reply(`**${message.author.username}**, Please enter a valid number!`);
		if (args[0] > 10000 || args[0] < 100) return message.reply(`**${message.author.username}**, You can only bet from 100-10,000 only`);
		if(economy.get('balance') < args[0]) return message.reply(`**${message.author.username}**, You don't have that much coins in your pocket!`);

		const timer = await cooldown('slots', user, 15000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can play again.`);
		}
		else {

			await Cooldown.update({ slots: Date.now() }, { where: { userId: user } });
			const amount = parseInt(args[0]);

			const arr1 = shuffle(slots);
			const arr2 = shuffle(slots);
			const arr3 = shuffle(slots);

			const thisMes = await message.reply(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      `);

			for(let i = 0; i < 5; i++) {
				arr1.push(arr1.shift());
				arr2.push(arr2.shift());
				arr3.push(arr3.shift());

				await setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[0]} : ${arr2[1]} : ${arr3[0]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
          `), 800);

				setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[1]} : ${arr3[2]}
      ${arr1[0]} : ${arr2[1]} : ${arr3[2]} **«**
      ${arr1[2]} : ${arr2[0]} : ${arr3[1]}
      **-----------------**
          `), 1000);

				if (arr1[1] === arr2[1] && arr1[1] === arr3[1] || arr2[1] === arr1[1] && arr2[1] === arr3[1] || arr3[1] === arr2[1] && arr3[1] === arr1[1]) {
					const random = 5 * amount;

					await Achievement.update({ slots: achievement.get('slots') + 1 }, { where: { userId: user } });

					const curBal = economy.get('balance');

					await Economy.update({ balance: curBal + random }, { where: { userId: user } });

					return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **WIN** : : : |
      **${message.author.username}** used <a:jasminecoins:868105109748469780> ${amount.toLocaleString()} and won <a:jasminecoins:868105109748469780> ${random.toLocaleString()}
		  `), 2500);

				}
				if (arr1[1] === arr2[1] || arr1[1] === arr2[1] || arr2[1] === arr1[1] || arr2[1] === arr2[3] || arr3[1] === arr1[1] || arr3[1] === arr2[1]) {
					const random = 2 * amount;

					await Achievement.update({ slots: achievement.get('slots') + 1 }, { where: { userId: user } });

					const curBal = economy.get('balance');

					await Economy.update({ balance: curBal + random }, { where: { userId: user } });

					return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **WIN** : : : |
      **${message.author.username}** used <a:jasminecoins:868105109748469780> ${amount.toLocaleString()} and won <a:jasminecoins:868105109748469780> ${random.toLocaleString()}
		  `), 2500);

				}
				const curbal = economy.get('balance');

				await Economy.update({ balance: curbal - amount }, { where: { userid: user } });

				return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **LOST** : : : |
      **${message.author.username}** used <a:jasminecoins:868105109748469780> ${amount.toLocaleString()} and lost everything.
		  `), 2500);

			}
		}
	},
};