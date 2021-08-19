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
const { getWork, checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');
const words = ['I\'m working for money.', 'Today, I want to find a job.', 'Time to go working!', 'Let me take a break for a while', 'Oh no, I\'m late for work!', 'Boss, I\'m done.'];
const Models = require('../../create-model.js');

module.exports = {
	name: 'work',
	category: '[🎩] economy',
	description: 'Get your body up and work to get coins',
	example: `${bot_prefix}work`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const inventory = await getUserDataAndCreate(Inventory, user);
		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		const timer = await cooldown('work', user, 3.6e+6);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.minutes}m ${timer.seconds}s** until you can work again.`);
		}
		else {
			await Cooldown.update({ work: Date.now() }, { where: { userId: user } });
			await Achievement.update({ work: achievement.get('work') + 1 }, { where: { userId: user } });

			const word = words[Math.floor(Math.random() * words.length)];

			await message.reply(`**${message.author.username}**\nRetype this following phrase:\n\`${word}\``);

			const filter = m => m.author.id === message.author.id;

			const input = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!input.size) {
				await message.reply('Time is up! You lost the job.');
				return;
			}

			if (input.first().content.toLowerCase() === word.toLowerCase()) {
				const gain = Math.floor(Math.random() * 200) + 60;
				const multiplier = Math.floor((inventory.get('bunny') / 100) * gain);
				const random = gain + multiplier;
				const curBal = economy.get('balance');

				await Economy.update({ balance: curBal + random }, { where: { userId: user } });

				const coins = `<a:jasminecoins:868105109748469780> ${random.toLocaleString()}`;

				message.reply(`${getWork(coins)}`);
			}
			else {
				message.reply(`Poor effort ${message.author.username}, you lost the job.`);
			}
		}
	},
};