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
const Discord = require('discord.js');
const Models = require('../../create-model.js');

module.exports = {
	name: 'sell',
	category: '[🎩] economy',
	description: 'sell an item from your inventory',
	example: `${bot_prefix}sell <item> [amount]`,
	usage: '<item> [amount]',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Disable = Models.Disable();
		const Bag = Models.Bag();
		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();

		if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
			await Disable.create({
				guildId: message.guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: message.guild.id } });


		if (!await Bag.findOne({ where: { userId: user } })) {
			await Bag.create({
				userId: user,
			});
		}

		const warn = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('This command is disabled for this guild')
			.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();

		if (disable.get('economy') === 1) return message.channel.send(warn);


		if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
			await Blacklist.create({
				userId: message.author.id,
			});
		}
		const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

		const warn1 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();


		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


		if (!await Cooldown.findOne({ where: { userId: user } })) {
			await Cooldown.create({
				userId: user,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user } })) {
			await Inventory.create({
				userId: user,
			});
		}
		const inventory = await Inventory.findOne({ where: { userId: user } });


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}sell <item> [amount]\`.`);
		const content = args[0].toLowerCase();
		let amount = parseInt(args[1]);
		if (!amount) amount = 1;
		if (isNaN(amount)) return message.channel.send(`**${message.author.username}**, please provide a real amount of item you want to sell.`);

		if (content === 'dog') {
			if (inventory.get('dog') < amount) return message.channel.send(`**${message.author.username}**, You don't have enough item to sell!`);
			await Economy.update({ balance: economy.get('balance') + 500 * amount }, { where: { userId: user } });
			await Inventory.update({ dog: inventory.get('dog') - 1 * amount }, { where: { userId: user } });
			const earn = 500 * amount;
			message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:dog:868105109647810600> **Dog** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'fishing-rod') {
			if (inventory.get('fishingRod') < amount) return message.channel.send(`**${message.author.username}**, You don't have enough item to sell!`);
			await Economy.update({ balance: economy.get('balance') + 2500 * amount }, { where: { userId: user } });
			await Inventory.update({ fishingRod: inventory.get('fishingRod') - 1 * amount }, { where: { userId: user } });
			const earn = 2500 * amount;
			message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🎣 **Fishing-Rod** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'hunting-rifle') {
			if (inventory.get('huntingRifle') < amount) return message.channel.send(`**${message.author.username}**, You don't have enough item to sell!`);
			await Economy.update({ balance: economy.get('balance') + 2500 * amount }, { where: { userId: user } });
			await Inventory.update({ huntingRifle: inventory.get('huntingRifle') - 1 * amount }, { where: { userId: user } });
			const earn = 2500 * amount;
			message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:huntingrifle:868724539121610783> **Hunting-Rifle** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'guard') {
			if (inventory.get('guard') < amount) return message.channel.send(`**${message.author.username}**, You don't have enough item to sell!`);
			await Economy.update({ balance: economy.get('balance') + 2500 * amount }, { where: { userId: user } });
			await Inventory.update({ guard: inventory.get('guard') - 1 * amount }, { where: { userId: user } });
			const earn = 2500 * amount;
			message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:bearguard:868105110289543188> **Guard** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'bear') {
			if (inventory.get('bear') < amount) return message.channel.send(`**${message.author.username}**, You don't have enough item to sell!`);
			await Inventory.update({ bear: inventory.get('bear') - 1 * amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 1500 * amount }, { where: { userId: user } });
			const earn = 1500 * amount;
			message.channel.send(`**${message.author.username}**, You have sold **${amount}** <a:angrybear:868105109853327370> **Bear** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'laptop') {
			if (inventory.get('laptop') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Economy.update({ balance: economy.get('balance') + 1500 * amount }, { where: { userId: user } });
			await Inventory.update({ laptop: inventory.get('laptop') - 1 * amount }, { where: { userId: user } });
			const earn = 1500 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:laptop:868105109379379221> **Laptop** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'junk') {
			if (inventory.get('junk') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ junk: inventory.get('junk') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 50 * amount }, { where: { userId: user } });
			const earn = 50 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🦴 **Junk** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'tuna') {
			if (inventory.get('commonFish') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ commonFish: inventory.get('commonFish') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 250 * amount }, { where: { userId: user } });
			const earn = 250 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:fish:868105109631025163> **Tuna** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'goldfish') {
			if (inventory.get('uncommonFish') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ uncommonFish: inventory.get('uncommonFish') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 500 * amount }, { where: { userId: user } });
			const earn = 500 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:goldfish:868115088165462076> **Gold Fish** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'squid') {
			if (inventory.get('rareFish') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ rareFish: inventory.get('rareFish') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 750 * amount }, { where: { userId: user } });
			const earn = 750 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🦑 **Squid** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'whale') {
			if (inventory.get('legendaryFish') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ legendaryFish: inventory.get('legendaryFish') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 1000 * amount }, { where: { userId: user } });
			const earn = 1000 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🐋 **Whale** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'rabbit') {
			if (inventory.get('commonHunt') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ commonHunt: inventory.get('commonHunt') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 50 * amount }, { where: { userId: user } });
			const earn = 50 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🐇 **Rabbit** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'turkey') {
			if (inventory.get('uncommonHunt') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ uncommonHunt: inventory.get('uncommonHunt') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 250 * amount }, { where: { userId: user } });
			const earn = 250 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🦃 **Turkey** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'pig') {
			if (inventory.get('rareHunt') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ rareHunt: inventory.get('rareHunt') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 500 * amount }, { where: { userId: user } });
			const earn = 500 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🐖 **Pig** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'deer') {
			if (inventory.get('mythicalHunt') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ mythicalHunt: inventory.get('mythicalHunt') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 750 * amount }, { where: { userId: user } });
			const earn = 750 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🦌 **Deer** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'dragon') {
			if (inventory.get('legendaryHunt') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ legendaryHunt: inventory.get('legendaryHunt') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 1000 * amount }, { where: { userId: user } });
			const earn = 1000 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** 🐉 **Dragon** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'iron') {
			if (inventory.get('iron') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ iron: inventory.get('iron') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 52 * amount }, { where: { userId: user } });
			const earn = 52 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:iron:868722021159292978>> **Iron** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'copper') {
			if (inventory.get('copper') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ copper: inventory.get('copper') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 257 * amount }, { where: { userId: user } });
			const earn = 257 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:copper:868722021142523924> **Copper** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'gold') {
			if (inventory.get('gold') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ gold: inventory.get('gold') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 555 * amount }, { where: { userId: user } });
			const earn = 555 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:gold:868722020945371197> **Gold** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'bauxite') {
			if (inventory.get('bauxite') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ bauxite: inventory.get('bauxite') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 763 * amount }, { where: { userId: user } });
			const earn = 763 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:bauxite:868119461243273226> **Bauxite** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else if (content === 'manganese') {
			if (inventory.get('manganese') < amount) return message.channel.send(`**${message.author.username}**, you don't have enough item to sell.`);
			await Inventory.update({ manganese: inventory.get('manganese') - amount }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') + 1100 * amount }, { where: { userId: user } });
			const earn = 1100 * amount;
			return message.channel.send(`**${message.author.username}**, You have sold **${amount}** <:manganese:868119479383646288> **Manganese** and earned <a:jasminecoins:868105109748469780> **${earn.toLocaleString()}** from it!`);
		}
		else {
			message.channel.send(`**${message.author.username}**, no item found with that name in your inventory.`);
		}
	},
};