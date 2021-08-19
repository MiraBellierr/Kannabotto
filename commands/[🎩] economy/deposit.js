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
const { checkGuildDisable, checkBlacklist, guildDisableMessage, blacklistMessage, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name: 'deposit',
	aliases: ['dep'],
	category: '[🎩] economy',
	description: 'Deposit your money to the bank',
	example: `${bot_prefix}deposit <amount | all>`,
	usage: '<amount | all>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Economy = Models.Economy();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);

		const curSpace = economy.get('totalBank') - economy.get('bank');

		if (args[0] == 'all') {
			if (curSpace === 0) return message.reply(`**${message.author.username}**, You don't have any space in your bank for you to deposit.`);
			if(economy.get('balance') <= 0) return message.reply(`**${message.author.username}**, You don't have any coins to deposit`);

			const curbal = economy.get('balance');

			if (curSpace > economy.get('balance')) {
				await Economy.update({ bank: economy.get('bank') + economy.get('balance') }, { where: { userId: user } });
				await Economy.update({ balance: 0 }, { where: { userId: user } });

				message.reply(`**${message.author.username}**, You have deposited <a:jasminecoins:868105109748469780> ${curbal.toLocaleString()} into your bank`);

			}
			else {
				await Economy.update({ bank: economy.get('bank') + curSpace }, { where: { userId: user } });
				await Economy.update({ balance: economy.get('balance') - curSpace }, { where: { userId: user } });

				message.reply(`**${message.author.username}**, You have deposited <a:jasminecoins:868105109748469780> ${curSpace.toLocaleString()} into your bank`);
			}
		}
		else if (isNaN(args[0])) {
			return message.reply(`**${message.author.username}**, You have to deposit real amount of coins into your bank`);
		}
		else {
			if (!args[0]) return message.reply(`**${message.author.username}**, you need to specify an amount to deposit`);
			if (args[0] > curSpace) return message.reply(`**${message.author.username}**, You don't have enough space in your bank for you to deposit that amount.`);
			if (curSpace === 0) return message.reply(`**${message.author.username}**, You don't have any space in your bank for you to deposit.`);
			if (args[0] < 1) return message.reply(`**${message.author.username}**, nope, only positive integers are allowed to be deposited.`);
			if (economy.get('balance') < args[0]) return message.reply(`**${message.author.username}**, You don't have that much money`);

			const money = parseInt(args[0]);

			await Economy.update({ bank: economy.get('bank') + money }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') - money }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, You have deposited <a:jasminecoins:868105109748469780> ${money.toLocaleString()} into your bank`);
		}
	},
};