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
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name: 'withdraw',
	aliases: ['with'],
	category: '[🎩] economy',
	description: 'Withdraw your money from the bank',
	example: `${bot_prefix}withdraw <amount | all>`,
	usage: '<amount | all>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Economy = Models.Economy();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);

		if (args[0] == 'all') {
			if(economy.get('bank') <= 0) return message.reply(`**${message.author.username}**, You don't have any coins to withdraw`);

			const curcoins = economy.get('bank');

			await Economy.update({ balance: economy.get('balance') + economy.get('bank') }, { where: { userId: user } });
			await Economy.update({ bank: 0 }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, You have withdrew <a:jasminecoins:868105109748469780> ${curcoins.toLocaleString()} from your bank`);
		}
		else if (isNaN(args[0])) {
			return message.reply(`**${message.author.username}**, You have to withdraw real amount of coins from your bank`);
		}
		else {
			if (!args[0]) return message.reply(`**${message.author.username}**, you need to specify an amount to withdraw`);
			if (args[0] < 1) return message.reply(`**${message.author.username}**, nope, only positive integers are allowed to be withdrew.`);
			if (economy.get('bank') < args[0]) return message.reply(`**${message.author.username}**, You don't have that much money to withdraw`);

			await Economy.update({ balance: economy.get('balance') + parseInt(args[0]) }, { where: { userId: user } });
			await Economy.update({ bank: economy.get('bank') - parseInt(args[0]) }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, You have withdrew <a:jasminecoins:868105109748469780> ${parseInt(args[0]).toLocaleString()} from your bank`);
		}
	},
};