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

const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'rich',
	category: '[🎩] economy',
	example: `${bot_prefix}rich [global]`,
	description: 'Let\'s see who has the most coins in your server',
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

		const warn = new MessageEmbed()
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

		const warn1 = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();


		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);
		const m = await message.channel.send('*Loading..*');


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

		if (args[0] === 'global') {
			let board = [];
			const economyList = await Economy.findAll({ order: [['balance', 'DESC']], limit: 10, attributes: ['userId'] });
			const economyListString = economyList.map(p => p.userId);
			for(let i = 0; i < economyListString.length; i++) {
				const value = Object.assign({ user: await client.users.fetch(economyListString[i]) }, await Economy.findOne({ where: { UserId: economyListString[i] } }));
				board.push(value);
			}

			board = board.filter(x => x.user);
			board = board.sort((a, b) => (b.dataValues.balance + b.dataValues.bank) - (a.dataValues.balance + a.dataValues.bank)).splice(0, 10);
			const top = board.map((x, i) => `[${i + 1}] ${x.user.username} - Total: <a:JasmineCoins:718067589984551042> **${(x.dataValues.balance + x.dataValues.bank).toLocaleString()}**`).join('\n');
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setDescription(`**🆙 | Top 10 Global Rich**\n\n${top}`);

			m.delete();
			return message.channel.send(embed);
		}
		else {

			message.guild.members.fetch().then(async members => {
				let board = [];
				const economyList = await Economy.findAll({ order: [['balance', 'DESC']], limit: 800, attributes: ['userId'] });
				const economyListString = economyList.map(p => p.userId);
				for(let i = 0; i < economyListString.length; i++) {
					const value = Object.assign({ user: members.get(economyListString[i]) }, await Economy.findOne({ where: { UserId: economyListString[i] } }));
					board.push(value);
				}

				board = board.filter(x => x.user);
				board = board.sort((a, b) => (b.dataValues.balance + b.dataValues.bank) - (a.dataValues.balance + a.dataValues.bank)).splice(0, 10);
				const top = board.map((x, i) => `[${i + 1}] ${x.user} - Total: <a:JasmineCoins:718067589984551042> **${(x.dataValues.balance + x.dataValues.bank).toLocaleString()}**`).join('\n');
				const embed = new MessageEmbed()
					.setColor('RANDOM')
					.setDescription(`**🆙 | Top 10 Server Rich**\n\n${top}`);

				m.delete();
				return message.channel.send(embed);
			});
		}

	},
};