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
const chance = 0.7;
const Models = require('../../create-model');
const { checkGuildDisable, guildDisableMessage, checkBlacklist, blacklistMessage, cooldown, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name: 'beg',
	category: '[🎩] economy',
	description: 'You\'re poor. Try begging for coins',
	example: `${bot_prefix}beg`,
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
		const timer = await cooldown('beg', user, 40000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.seconds}s** until you can beg again.`);
		}
		else {
			await Cooldown.update({ beg: Date.now() }, { where: { userId: user } });
			await Achievement.update({ beg: achievement.get('beg') + 1 }, { where: { userId: user } });

			const success = Math.random() < chance;

			if (success) {
				const random = Math.floor(Math.random() * 50) + 3;
				const multiplier = Math.floor((inventory.get('bunny') / 100) * random);
				const gain = random + multiplier;
				const curBal = economy.get('balance');

				await Economy.update({ balance: curBal + gain }, { where: { userId: user } });

				message.reply(`You begged and you got <a:jasminecoins:868105109748469780> **${gain.toLocaleString()}**`);
			}
			else {
				message.reply(`**${message.author.username}**, you begged but no one is willing to give you coins.`);
			}
		}
	},
};