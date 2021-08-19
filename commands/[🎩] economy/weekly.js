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
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'weekly',
	category: '[🎩] economy',
	description: 'Weekly coins reward',
	example: `${bot_prefix}weekly`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const guild = client.guilds.cache.get('864537979339014184');
		const patron = guild.members.cache.get(message.author.id);

		if (!patron) return message.reply(`**${message.author.username}**, This command is accessible for Tier 1 Supporter only and must join our support server.`);
		if (!patron.roles.cache.get('867067538215272448')) return message.reply(`**${message.author.username}**, This command is accessible for Tier 1 Patreon only.`);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		const curcoins = economy.get('balance');
		const amount = 10000;
		const timer = await cooldown('weekly', user, 6.048e+8);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.days}d ${timer.hours}h ${timer.minutes}m ${timer.seconds}s** until you can claim your next weekly again.`);
		}
		else {
			await Cooldown.update({ weekly: Date.now() }, { where: { userId: user } });
			await Achievement.update({ weekly: achievement.get('weekly') + 1 }, { where: { userId: user } });
			await Economy.update({ balance: curcoins + amount }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, Here's your weekly <a:jasminecoins:868105109748469780> ${amount.toLocaleString()}. Come back again next week!`);
		}
	},
};
