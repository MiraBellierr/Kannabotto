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
const { promptMessage } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const chooseArr = ['🗻', '📰', '✂'];
const Models = require('../../create-model.js');

module.exports = {
	name: 'rps',
	category: '[🎮] games',
	description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
	example: `${bot_prefix}rps <bet>`,
	usage: '<bet>',
	run: async (client, message, args) => {
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

			const warn = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('This command is disabled for this guild')
				.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();

			if (disable.get('economy') === 1) return message.channel.send(warn);
			if (disable.get('games') === 1) return message.channel.send(warn);


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
			if (blacklist.get('games') === 1) return message.channel.send(warn1);


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

			if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}rps <bet>\`.`);
			if (isNaN(args[0])) return message.channel.send(`**${message.author.username}**, only numbers accepted as an argument!`);
			if (args[0] < 1 || args[0] > 10000) return message.channel.send(`**${message.author.username}**, Please choose numbers between 1-10000 only`);
			if (args[0] > economy.get('balance')) return message.channel.send(`**${message.author.username}**, You don't have that much coins in your pocket!`);
			const timeOut = 15000;
			const lastRps = await cooldown.get('rps');
			if (lastRps !== null && timeOut - (Date.now() - lastRps) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastRps));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can play again.`);
			}
			else {
				await Cooldown.update({ rps: Date.now() }, { where: { userId: user } });

				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setColor('RANDOM')
					.setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
					.setDescription('Add a reaction to one of these emojis to play the game!')
					.setTimestamp();

				const m = await message.channel.send(embed);
				const reacted = await promptMessage(m, message.author, 30, chooseArr);

				const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

				const result = await getResult(reacted, botChoice);

				embed
					.setDescription('')
					.addField(result, `${reacted} vs ${botChoice}`);

				m.edit(embed);
			}

			async function getResult(me, clientChosen) {
				if ((me === '🗻' && clientChosen === '✂') || (me === '📰' && clientChosen === '🗻') || (me === '✂' && clientChosen === '📰')) {
					await Achievement.update({ rps: achievement.get('rps') + 1 }, { where: { userId: user } });
					await Economy.update({ balance: economy.get('balance') + parseInt(args[0]) }, { where: { userId: user } });
					return `You won <a:jasminecoins:868105109748469780> ${args[0].toLocaleString()}!`;
				}
				else if (me === clientChosen) {
					return 'It\'s a tie, coins has been returned back!';
				}
				else {
					await Economy.update({ balance: economy.get('balance') - parseInt(args[0]) }, { where: { userId: user } });
					return `You lost <a:jasminecoins:868105109748469780> ${args[0].toLocaleString()}!`;
				}
			}
		});
	},
};