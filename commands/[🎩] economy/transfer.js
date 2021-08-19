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
const { getMember, checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'transfer',
	aliases: ['share', 'give', 'pay'],
	category: '[🎩] economy',
	example: `${bot_prefix}transfer <mention> <amount>`,
	description: 'Transfer coins to another user',
	usage: '<mention> <amount>',
	run: async (client, message, args) => {
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(message.author.id);

		const member = await getMember(message, args[0]);
		const user = member.user;

		const blacklist = await getUserDataAndCreate('Blacklist', user.id);

		if (blacklist.get('blacklist') === 1) return message.reply(`**${message.author.username}**, this user (${user.username}) is a blacklisted user.`);

		const economy = await getUserDataAndCreate(Economy, message.author.id);
		const economy2 = await getUserDataAndCreate(Economy, user.id);
		const achievement = await getUserDataAndCreate(Achievement, message.author.id);
		const achievement2 = await getUserDataAndCreate(Achievement, user.id);

		if (user.bot) return message.reply(`**${message.author.username}**, This user is a bot.`);
		if (!args[0]) return message.reply(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}transfer <mention> <amount>\``);
		if (!user) return message.reply(`**${message.author.username}**, please make sure you mention someone that you want to transfer to.`);
		if (!args[1]) return message.reply(`**${message.author.username}**, please provide the amount of coins you want to transfer to.`);
		if (isNaN(args[1])) return message.reply(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}transfer <mention> <amount>\``);
		if (args[1] < 1) return message.reply(`**${message.author.username}**, nope, only positive integers are allowed to be transfered.`);
		if (user.id === message.author.id) return message.reply(`**${message.author.username}**, You can't give coins to yourself!`);
		if (economy.get('balance') < 1) return message.reply(`**${message.author.username}**, you don't even have any coins in your pocket to be transfered, lol.`);
		if (economy.get('balance') < args[1]) return message.reply(`**${message.author.username}**, you don't have that much coins in your pocket.`);


		const amount = parseInt(args[1]);
		await Achievement.update({ transfer: achievement.get('transfer') + amount }, { where: { userId: message.author.id } });
		await Achievement.update({ gifted: achievement2.get('gifted') + amount }, { where: { userId: user.id } });

		let taxes;

		if (amount === 1) {
			taxes = 0;
		}
		else {
			taxes = Math.ceil(5 / 100 * amount);
		}

		const total = amount - taxes;

		await Economy.update({ balance: economy.get('balance') - amount }, { where: { userId: message.author.id } });
		await Economy.update({ balance: economy2.get('balance') + amount }, { where: { userId: user.id } });

		message.reply(`**${message.author.username}**, you gave <a:jasminecoins:868105109748469780> ${total.toLocaleString()} after a 5% taxes to **${user.username}**`);
	},
};