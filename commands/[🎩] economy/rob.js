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
const { getMember, checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');
const Models = require('../../create-model.js');
const patrons = require('../../database/patrons.json');

module.exports = {
	name: 'rob',
	aliases: ['steal'],
	category: '[🎩] economy',
	description: 'Steal some coins from other user',
	example: `${bot_prefix}rob <mention>`,
	usage: 'mention>',
	run: async (client, message, args) => {

		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(message.author.id);

		const member = await getMember(message, args.join(' '));
		const user = member.user;

		await createAllDataForNewUser(user.id);

		if (!await Blacklist.findOne({ where: { userId: user.id } })) {
			await Blacklist.create({
				userId: user.id,
			});
		}

		const blacklist = await Blacklist.findOne({ where: { userId: user.id } });
		if (blacklist.get('blacklist') === 1) return message.reply(`**${message.author.username}**, this user (${user.username}) is a blacklisted user.`);

		const economy = await getUserDataAndCreate(Economy, message.author.id);
		const economyVictim = await getUserDataAndCreate(Economy, user.id);
		const achievement = await getUserDataAndCreate(Achievement, message.author.id);

		let successChance = 0.4;

		const success = Math.random() < successChance;
		const timer = await cooldown('rob', message.author.id, 3.6e+6);

		if (!user) return message.reply(`**${message.author.username}**, please make sure you mention someone after this`);
		if (!args[0]) return message.reply(`**${message.author.username}**, please make sure you mention someone after this`);
		if (user.id === message.author.id) return message.reply(`**${message.author.username}**, nope, you can't rob yourself or you entered an invalid user`);
		if (economyVictim.get('balance') < 1) return message.reply(`**${message.author.username}**, ${user.username} does not have anything you can rob`);

		for (let i = 0; i < 5; i++) {
			if (member.roles.cache.has(patrons[`tier ${i + 1}`])) successChance = 0.4 - (4 * (i + 1));
		}

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.minutes}m ${timer.seconds}s** until you can rob again.`);
		}
		else {
			const timerVictim = await cooldown('gotRobbed', user.id, 1.8e+6);

			if (timerVictim.bool) {
				message.reply(`**${message.author.username}**, This user has already been robbed in the past 30 minutes.`);
			}
			else {
				if (economy.get('balance') < 200) return message.reply(`**${message.author.username}**, You need atleast <a:jasminecoins:868105109748469780> 200 in your pocket to rob someone`);

				const guardTimer = await cooldown('guard', user.id, 4.32e+7);

				if (guardTimer.bool) return message.reply(`**${message.author.username}**, there is a guard watching over ${user.username}! You can't rob them.`);

				await Cooldown.update({ rob: Date.now() }, { where: { userId: message.author.id } });

				if (success) {
					const random = Math.floor(0.05 * economyVictim.get('balance'));

					await Cooldown.update({ gotRobbed: Date.now() }, { where: { userId: user.id } });
					await Achievement.update({ rob: achievement.get('rob') + random }, { where: { userId: message.author.id } });
					await Economy.update({ balance: economyVictim.get('balance') - random }, { where: { userId: user.id } });
					await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: message.author.id } });

					message.reply(`**${message.author.username}**, you robbed ${user.username} and got away with <a:jasminecoins:868105109748469780> ${random.toLocaleString()}`);
				}
				else {
					const random = Math.floor(0.05 * economy.get('balance'));

					await Economy.update({ balance: economyVictim.get('balance') + random }, { where: { userId: user.id } });
					await Economy.update({ balance: economy.get('balance') - random }, { where: { userId: message.author.id } });

					message.reply(`**${message.author.username}**, you get caught and you paid ${user.username} <a:jasminecoins:868105109748469780> ${random.toLocaleString()}`);
				}
			}
		}
	},
};