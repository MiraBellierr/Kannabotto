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
const Discord = require('discord.js');
const Models = require('../../create-model.js');

module.exports = {
	name: 'withdraw',
	aliases: ['with'],
	category: '[🎩] economy',
	description: 'Withdraw your money from the bank',
	example: `${bot_prefix}withdraw <amount | all>`,
	usage: '<amount | all>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Disable = Models.Disable();
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


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		if (args[0] == 'all') {
			if(economy.get('bank') <= 0) return message.channel.send(`**${message.author.username}**, You don't have any coins to withdraw`);

			const curcoins = economy.get('bank');
			await Economy.update({ balance: economy.get('balance') + economy.get('bank') }, { where: { userId: user } });
			await Economy.update({ bank: 0 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have withdrew <a:jasminecoins:868105109748469780> ${curcoins.toLocaleString()} from your bank`);
		}
		else if (isNaN(args[0])) {
			return message.channel.send(`**${message.author.username}**, You have to withdraw real amount of coins from your bank`);
		}
		else {
			if (!args[0]) return message.channel.send(`**${message.author.username}**, you need to specify an amount to withdraw`);
			if (args[0] < 1) return message.channel.send(`**${message.author.username}**, nope, only positive integers are allowed to be withdrew.`);
			if (economy.get('bank') < args[0]) return message.channel.send(`**${message.author.username}**, You don't have that much money to withdraw`);
			await Economy.update({ balance: economy.get('balance') + parseInt(args[0]) }, { where: { userId: user } });
			await Economy.update({ bank: economy.get('bank') - parseInt(args[0]) }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have withdrew <a:jasminecoins:868105109748469780> ${parseInt(args[0]).toLocaleString()} from your bank`);
		}
	},
};