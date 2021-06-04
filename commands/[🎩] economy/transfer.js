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
const { getMember } = require('../../functions');
const Discord = require('discord.js');
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
		const Disable = Models.Disable();
		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
			await Disable.create({
				guildId: message.guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: message.guild.id } });

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

		const user = getMember(message, args[0]).user;

		if (!await Blacklist.findOne({ where: { userId: user.id } })) {
			await Blacklist.create({
				userId: user.id,
			});
		}
		const blacklist2 = await Blacklist.findOne({ where: { userId: user.id } });

		if (blacklist2.get('blacklist') === 1) return message.channel.send(`**${message.author.username}**, this user (${user.username}) is a blacklisted user.`);


		if (!await Cooldown.findOne({ where: { userId: message.author.id } })) {
			await Cooldown.create({
				userId: message.author.id,
			});
		}


		if (!await Inventory.findOne({ where: { userId: message.author.id } })) {
			await Inventory.create({
				userId: message.author.id,
			});
		}


		if (!await Economy.findOne({ where: { userId: message.author.id } })) {
			await Economy.create({
				userId: message.author.id,
			});
		}
		const economy = await Economy.findOne({ where: { userId: message.author.id } });

		if (!await Cooldown.findOne({ where: { userId: user.id } })) {
			await Cooldown.create({
				userId: user.id,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user.id } })) {
			await Inventory.create({
				userId: user.id,
			});
		}

		if (!await Economy.findOne({ where: { userId: user.id } })) {
			await Economy.create({
				userId: user.id,
			});
		}
		const economy2 = await Economy.findOne({ where: { userId: user.id } });


		if (!await Achievement.findOne({ where: { userId: message.author.id } })) {
			await Achievement.create({
				userId: message.author.id,
			});
		}
		const achievement = await Achievement.findOne({ where: { userId: message.author.id } });

		if (!await Achievement.findOne({ where: { userId: user.id } })) {
			await Achievement.create({
				userId: user.id,
			});
		}
		const achievement2 = await Achievement.findOne({ where: { userId: user.id } });

		if (user.bot) return message.channel.send(`**${message.author.username}**, This user is a bot.`);
		if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}transfer <mention> <amount>\``);
		if (!user) return message.channel.send(`**${message.author.username}**, please make sure you mention someone that you want to transfer to.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, please provide the amount of coins you want to transfer to.`);
		if (isNaN(args[1])) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}transfer <mention> <amount>\``);
		if (args[1] < 1) return message.channel.send(`**${message.author.username}**, nope, only positive integers are allowed to be transfered.`);
		if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, You can't give coins to yourself!`);
		if (economy.get('balance') < 1) return message.channel.send(`**${message.author.username}**, you don't even have any coins in your pocket to be transfered, lol.`);
		if (economy.get('balance') < args[1]) return message.channel.send(`**${message.author.username}**, you don't have that much coins in your pocket.`);

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
		message.channel.send(`**${message.author.username}**, you gave <a:JasmineCoins:718067589984551042> ${total.toLocaleString()} after a 5% taxes to **${user.username}**`);
	},
};