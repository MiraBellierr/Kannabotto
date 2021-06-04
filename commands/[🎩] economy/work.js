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
const { getWork } = require('../../functions');
const Discord = require('discord.js');
const words = ['I\'m working for money.', 'Today, I want to find a job.', 'Time to go working!', 'Let me take a break for a while', 'Oh no, I\'m late for work!', 'Boss, I\'m done.'];
const Models = require('../../create-model.js');

module.exports = {
	name: 'work',
	category: '[🎩] economy',
	description: 'Get your body up and work to get coins',
	example: `${bot_prefix}work`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

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

			const timeOut = 3.6e+6;
			const workTimeout = cooldown.get('work');
			if (workTimeout !== null && timeOut - (Date.now() - workTimeout) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - workTimeout));
				message.channel.send(`**${message.author.username}**, Please wait **${timeObj.minutes}m ${timeObj.seconds}s** until you can work again.`);
			}
			else {
				await Cooldown.update({ work: Date.now() }, { where: { userId: user } });
				await Achievement.update({ work: achievement.get('work') + 1 }, { where: { userId: user } });

				const word = words[Math.floor(Math.random() * words.length)];
				await message.channel.send(`**${message.author.username}**\nRetype this following phrase:\n\`${word}\``);
				const filter = m => m.author.id === message.author.id;
				const input = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
				});
				if (!input.size) {
					await message.reply('Time is up! You lost the job.');
					return;
				}
				if (input.first().content.toLowerCase() === word.toLowerCase()) {
					const gain = Math.floor(Math.random() * 200) + 60;
					const multiplier = Math.floor((inventory.get('bunny') / 100) * gain);
					const random = gain + multiplier;
					const curBal = economy.get('balance');
					await Economy.update({ balance: curBal + random }, { where: { userId: user } });
					const coins = `<a:JasmineCoins:718067589984551042> ${random.toLocaleString()}`;
					message.reply(`${getWork(coins)}`);
				}
				else {
					message.reply(`Poor effort ${message.author.username}, you lost the job.`);
				}
			}
		});
	},
};