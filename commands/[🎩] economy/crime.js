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
const { getCrimeSuccess, getCrimeFail, checkGuildDisable, guildDisableMessage, checkBlacklist, blacklistMessage, getUserDataAndCreate, createAllDataForNewUser, cooldown } = require('../../functions');
const Models = require('../../create-model');

module.exports = {
	name: 'crime',
	category: '[🎩] economy',
	description: 'Do some bad works and get coins',
	example: `${bot_prefix}crime`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		const answers = ['success', 'failed'];
		const answer = answers[Math.floor(Math.random() * answers.length)];

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		if (economy.get('balance') < 1) return message.reply(`**${message.author.username}**, You need at least <a:jasminecoins:868105109748469780> 1 to be able to do crime.`);

		const timer = await cooldown('crime', user, 60000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.seconds}s** until you can do crime again.`);
		}
		else {
			await Cooldown.update({ crime: Date.now() }, { where: { userId: user } });
			await Achievement.update({ crime: achievement.get('crime') + 1 }, { where: { userId: user } });

			if (answer === 'success') {
				const curBal = economy.get('balance');
				const random = Math.ceil((0.05 * curBal));

				await Economy.update({ balance: curBal + random }, { where: { userId: user } });

				const coins = `<a:jasminecoins:868105109748469780> ${random.toLocaleString()}`;

				message.reply(`${message.author.username}, ${getCrimeSuccess(coins)}`);
			}
			if (answer === 'failed') {
				const curBal = economy.get('balance');
				const random = Math.floor(0.05 * curBal);

				await Economy.update({ balance: curBal - random }, { where: { userId: user } });

				const coins = `<a:jasminecoins:868105109748469780> ${random.toLocaleString()}`;

				message.reply(`${message.author.username}, ${getCrimeFail(coins)}`);
			}
		}
	},
};