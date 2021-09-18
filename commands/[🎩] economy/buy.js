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
const { checkGuildDisable, guildDisableMessage, checkBlacklist, blacklistMessage, buyItem, buyWeapon, createAllDataForNewUser } = require('../../functions');

module.exports = {
	name: 'buy',
	category: '[🎩] economy',
	description: 'buy an item in the shop',
	example: `${bot_prefix}buy <item> [amount]`,
	usage: '<item> [amount]',
	run: async (client, message, args) => {
		const user = message.author.id;

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buy <item>\``);
		const content = args[0].toLowerCase();

		let amount = parseInt(args[1]);

		if (!amount) amount = 1;
		if (isNaN(amount)) return message.reply(`**${message.author.username}**, please provide a real amount of item you want to buy.`);
		if (amount < 1) amount = 1;

		if (client.items.has(content)) {
			const item = client.items.get(content);

			if (!item.price) return message.reply('No item found in the shop or the market');

			buyItem(message, content, item.price, amount, item.emoji);
		}
		else if (client.weapons.has(content)) {
			const weapon = client.weapons.get(content);

			buyWeapon(client, message, content, weapon.price, weapon.emoji);
		}
		else {
			message.reply(`**${message.author.username}**, no item found in the shop and the market`);
		}
	},
};
