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
const Models = require('../../create-model');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');
const patrons = require('../../database/patrons.json');

module.exports = {
	name: 'daily',
	category: '[🎩] economy',
	description: 'Daily coins reward',
	example: `${bot_prefix}daily`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		const curcoins = economy.get('balance');

		let amount = 1000;

		// tier III
		if (message.member.roles.cache.has(patrons['tier 3'])) amount = 2000;

		const timer = await cooldown('daily', user, 8.64e+7);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.hours}h ${timer.minutes}m ${timer.seconds}s** until you can claim your next daily again.`);
		}
		else {
			await Cooldown.update({ daily: Date.now() }, { where: { userId: user } });
			await Achievement.update({ daily: achievement.get('daily') + 1 }, { where: { userId: user } });
			await Economy.update({ balance: curcoins + amount }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, Here's your daily <a:jasminecoins:868105109748469780> ${amount.toLocaleString()}. Come back again tomorrow!`);
		}
	},
};
