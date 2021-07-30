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
const Models = require('../../create-model.js');

module.exports = {
	name: 'rob',
	aliases: ['steal'],
	category: '[🎩] economy',
	description: 'Steal some coins from other user',
	example: `${bot_prefix}rob <mention>`,
	usage: 'mention>',
	run: async (client, message, args) => {
		import('parse-ms').then(async ms => {

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

			const member = await getMember(message, args.join(' '));
			const user = member.user;

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
			const cooldown = await Cooldown.findOne({ where: { userId: message.author.id } });


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
				await Economy.create({
					userId: user.id,
				});
			}
			const cooldownVictim = await Cooldown.findOne({ where: { userId: user.id } });

			if (!await Economy.findOne({ where: { userId: user.id } })) {
				await Economy.create({
					userId: user.id,
				});
			}
			const economyVictim = await Economy.findOne({ where: { userId: user.id } });


			if (!await Achievement.findOne({ where: { userId: message.author.id } })) {
				await Achievement.create({
					userId: message.author.id,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: message.author.id } });

			const successChance = 0.4;

			const success = Math.random() < successChance;

			const author = await cooldown.get('rob');
			const timeout = 3.6e+6;

			if (!user) return message.channel.send(`**${message.author.username}**, please make sure you mention someone after this`);
			if (!args[0]) return message.channel.send(`**${message.author.username}**, please make sure you mention someone after this`);
			if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, nope, you can't rob yourself or you entered an invalid user`);
			if (economyVictim.get('balance') < 1) return message.channel.send(`**${message.author.username}**, ${user.username} does not have anything you can rob`);

			if (author !== null && timeout - (Date.now() - author) > 0) {
				const time = ms.default(timeout - (Date.now() - author));
				message.channel.send(`**${message.author.username}**, Please wait **${time.minutes}m ${time.seconds}s** until you can rob again.`);
			}
			else {
				const timeout1 = 1.8e+6;
				const gotRobbed = cooldownVictim.get('gotRobbed');
				if (gotRobbed !== null && timeout1 - (Date.now() - gotRobbed) > 0) {
					message.channel.send(`**${message.author.username}**, This user has already been robbed in the past 30 minutes.`);
				}
				else {
					await Cooldown.update({ gotRobbed: Date.now() }, { where: { userId: user.id } });

					if (economy.get('balance') < 200) return message.channel.send(`**${message.author.username}**, You need atleast <a:jasminecoins:868105109748469780> 200 in your pocket to rob someone`);
					const timeOut = 4.32e+7;
					const lastGuard = await cooldown.get('guard');
					if (lastGuard !== null && timeOut - (Date.now() - lastGuard) > 0) return message.channel.send(`**${message.author.username}**, there is a guard watching over ${user.username}! You can't rob them.`);
					await Cooldown.update({ rob: Date.now() }, { where: { userId: message.author.id } });

					if (success) {
						const random = Math.floor(0.05 * economyVictim.get('balance'));
						await Achievement.update({ rob: achievement.get('rob') + random }, { where: { userId: message.author.id } });
						await Economy.update({ balance: economyVictim.get('balance') - random }, { where: { userId: user.id } });
						await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: message.author.id } });
						message.channel.send(`**${message.author.username}**, you robbed ${user.username} and got away with <a:jasminecoins:868105109748469780> ${random.toLocaleString()}`);
					}
					else {
						const random = Math.floor(0.05 * economy.get('balance'));

						await Economy.update({ balance: economyVictim.get('balance') + random }, { where: { userId: user.id } });
						await Economy.update({ balance: economy.get('balance') - random }, { where: { userId: message.author.id } });
						message.channel.send(`**${message.author.username}**, you get caught and you paid ${user.username} <a:jasminecoins:868105109748469780> ${random.toLocaleString()}`);
					}
				}
			}
		});
	},
};