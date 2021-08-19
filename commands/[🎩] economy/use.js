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
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name: 'use',
	category: '[🎩] economy',
	description: 'Use an item',
	example: `${bot_prefix}use <item> [amount]`,
	usage: '<item> [amount]',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const cooldown = await getUserDataAndCreate(Cooldown, user);
		const inventory = await getUserDataAndCreate(Inventory, user);
		const economy = await getUserDataAndCreate(Economy, user);

		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}use <item>\`.`);

		const content = args[0].toLowerCase();
		let amount = parseInt(args[1]);

		if (!amount) amount = 1;
		if (isNaN(amount)) return message.reply(`**${message.author.username}**, please provide a real amount of item you want to buy.`);

		if (content === 'bear') {
			const timeout = 3.6e+6;
			const lastBear = await cooldown.get('bear');

			if (lastBear !== null && timeout - (Date.now() - lastBear) > 0) return message.reply(`**${message.author.username}**, This item is still active.`);
			if (inventory.get('bear') < 1) return message.reply(`**${message.author.username}**, you don't have this item in your inventory`);

			await Cooldown.update({ bear: Date.now() }, { where: { userId: user } });
			await Inventory.update({ bear: inventory.get('bear') - 1 }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, you activated **<a:angrybear:868105109853327370> Bear**. Your Xp has been boosted by 50% for 1 hour.`);
		}
		else if (content === 'guard') {
			const timeout = 4.32e+7;
			const lastGuard = await cooldown.get('guard');

			if (lastGuard !== null && timeout - (Date.now() - lastGuard) > 0) return message.reply(`**${message.author.username}**, This item is still active.`);
			if (inventory.get('guard') < 1) return message.reply(`**${message.author.username}**, You don't have this item in your inventory.`);

			await Cooldown.update({ guard: Date.now() }, { where: { userId: user } });
			await Inventory.update({ guard: inventory.get('guard') - 1 }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, you activated <:bearguard:868105110289543188> **Guard**. now people can't rob you for 12 hours.`);
		}
		else if (content === 'dog') {
			if (inventory.get('dog') < amount) return message.reply(`**${message.author.username}**, You don't have this item in your inventory.`);

			await Inventory.update({ dog: inventory.get('dog') - amount }, { where: { userId: user } });
			await Economy.update({ totalBank: economy.get('totalBank') + 1000 * amount }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, you used **${amount}** <:dog:868105109647810600> **Dog**. Your bank has been expanded by ${(1000 * amount).toLocaleString()}.`);
		}
		else if (content === 'bunny') {
			if (inventory.get('bunny2') < 1) return message.reply(`**${message.author.username}**, you don't have this item in your inventory.`);

			await Inventory.update({ bunny2: inventory.get('bunny2') - 1 }, { where: { userId: user } });
			await Inventory.update({ bunny: inventory.get('bunny') + 0.25 }, { where: { userId: user } });

			message.reply(`**${message.author.username}**, you used **${amount}** <a:MyMelodyHeart:719100623328378901> **Bunny** and your multiplier has increased by 0.25%`);
		}
		else {
			return message.reply(`**${message.author.username}**, You can't use this item.`);
		}
	},
};