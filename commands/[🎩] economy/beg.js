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
const chances = [0, 0, 1, 1, 1, 1, 1];
const Models = require('../../create-model');

module.exports = {
	name: 'beg',
	category: '[🎩] economy',
	description: 'You\'re poor. Try begging for coins',
	example: `${bot_prefix}beg`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Cooldown = Models.Cooldown();
			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
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

			if (!await Cooldown.findOne({ where: { userId: user } })) {
				await Cooldown.create({
					userId: user,
				});
			}
			const cooldown = await Cooldown.findOne({ where: { userId: user } });


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

			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			const timeOut = 40000;

			const lastBeg = await cooldown.get('beg');
			if (lastBeg !== null && timeOut - (Date.now() - lastBeg) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastBeg));
				message.channel.send(`**${message.author.username}**, Please wait **${timeObj.seconds}s** until you can beg again.`);
			}
			else {
				await Cooldown.update({ beg: Date.now() }, { where: { userId: user } });
				await Achievement.update({ beg: achievement.get('beg') + 1 }, { where: { userId: user } });
				const chance = chances[Math.floor(Math.random() * chances.length)];
				if (chance === 1) {
					const random = Math.floor(Math.random() * 50) + 3;
					const multiplier = Math.floor((inventory.get('bunny') / 100) * random);
					const gain = random + multiplier;
					const curBal = economy.get('balance');
					await Economy.update({ balance: curBal + gain }, { where: { userId: user } });
					message.reply(`You begged and you got <a:JasmineCoins:718067589984551042> **${gain.toLocaleString()}**`);
				}
				else {
					message.channel.send(`**${message.author.username}**, you begged but no one is willing to give you coins.`);
				}
			}
		});
	},
};