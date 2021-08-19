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
const ms = require('ms');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'giveaway',
	aliases: ['giveaways'],
	category: '[✨] utility',
	description: 'Set up a giveaway on your server',
	example: `${bot_prefix}giveaway <start | end | reroll>`,
	usage: '<start | end | reroll',
	run: async (client, message, args) => {
		const prefix = prefixes[message.guild.id];

		if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('You don\'t have `MANAGE_MESSAGES` permission to use this command.');

		if (!args[0]) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${client.user.username} logging`, client.user.avatarURL())
				.setColor('RANDOM')
				.setDescription(`**Proper Usage:**\n• ${prefix}giveaway start\n• ${prefix}giveaway end \`[message ID | prize]\`\n• ${prefix}giveaway reroll \`[message ID | prize]\``)
				.setTimestamp();

			return message.reply({ embeds: [embed] });
		}

		if (args[0].toLowerCase() === 'start') {
			let giveawayChannel = 'None', giveawayDuration = 'None', numberOfWinners = 'None', giveawayPrize = 'None';
			const example = new Discord.MessageEmbed().setDescription('filler');
			const msg = await message.reply('Setting up...');

			await message.reply({ embeds: [example] });

			msg.delete();

			const filter = m => m.author.id === message.author.id;

			await message.reply('Mention a channel that you want the giveaway to be posted.\n\nType `cancel` if you want to cancel.');

			const giveawayChannelinput = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!giveawayChannelinput.size) {
				return message.reply('Time is up. Canceled.');
			}

			if (giveawayChannelinput.first().mentions.channels.first()) {
				if (!message.guild.me.permissionsIn(giveawayChannelinput.first().mentions.channels.first()).has('SEND_MESSAGES')) return message.reply('I do not have a permission to send a message in that channel.');

				giveawayChannel = giveawayChannelinput.first().mentions.channels.first();

				if (!message.guild.channels.cache.get(giveawayChannel.id)) {
					return message.reply('Error: Channel not found. Please run the command again.');
				}

				example.addField('Giveaway Channel', `${giveawayChannel}`);
			}
			else if (giveawayChannelinput.first().content.toLowerCase() === 'cancel') {
				return message.reply('cancelled');
			}
			else {
				return message.reply('Invalid input. Canceled.');
			}

			await message.reply({ embeds: [example] });
			await message.reply('Please provide a duration how long it would be.(example:`10m`, `1h`, `2.5h`, `1d`)\n\nType `cancel` if you want to cancel.');

			const giveawayDurationinput = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!giveawayDurationinput.size) {
				return message.reply('Time is up. Cancelled.');
			}

			if (giveawayDurationinput.first().content.toLowerCase() === 'cancel') {
				return message.reply('Cancelled.');
			}
			else if (isNaN(ms(giveawayDurationinput.first().content))) {
				return message.reply('Invalid Input. Cancelled.');
			}
			else {
				giveawayDuration = giveawayDurationinput.first().content;

				example.addField('Duration', `${giveawayDuration}`);
			}

			await message.reply({ embeds: [example] });
			await message.reply('How many winners would it be?\n\nType `cancel` if you want to cancel.');

			const numberOfWinnersInput = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!numberOfWinnersInput.size) {
				return message.reply('Time is up. Cancelled.');
			}
			else if (numberOfWinnersInput.first().content.toLowerCase() === 'cancel') {
				return message.reply('Cancelled');
			}
			else if (isNaN(numberOfWinnersInput.first().content) || (parseInt(numberOfWinnersInput.first().content) < 1)) {
				return message.reply('Invalid input. Cancelled.');
			}
			else {
				numberOfWinners = parseInt(numberOfWinnersInput.first().content);

				example.addField('Number Of Winners', `${numberOfWinners}`);
			}

			await message.reply({ embeds: [example] });
			await message.reply('What is the prize of the giveaway?\n\nType `cancel` if you want to cancel.');

			const giveawayPrizeInput = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!giveawayPrizeInput.size) {
				return message.reply('Time is up. Cancelled');
			}
			else if (giveawayPrizeInput.first().content.toLowerCase() === 'cancel') {
				return message.reply('Cancelled');
			}
			else {
				giveawayPrize = giveawayPrizeInput.first().content;

				example.addField('Prize', `${giveawayPrize}`);
			}

			await message.reply({ embeds: [example] });
			await message.reply('Is this okay? (yes or no)');

			const confirm = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});
			if (!confirm.size) {
				return message.reply('Time is up. Cancelled.');
			}
			if (confirm.first().content.toLowerCase() === 'yes') {
				message.reply('Alright.');
			}
			else if (confirm.first().content.toLowerCase() === 'no') {
				return message.reply('Cancelled.');
			}
			else {
				await message.reply({ embeds: [example] });
				await message.reply('Last Attempt. Is this okay? (yes or no)');

				const confirm2 = await message.channel.awaitMessages({
					filter,
					max: 1,
					time: 30000,
				});

				if (!confirm2.size) {
					return message.reply('Time is up. Cancelled.');
				}

				if (confirm2.first().content.toLowerCase() === 'yes') {
					message.reply('Alright.');
				}
				else if (confirm2.first().content.toLowerCase() === 'no') {
					return message.reply('Cancelled.');
				}
				else {
					return message.reply('Invalid Input. Cancelled');
				}
			}

			client.giveawaysManager.start(giveawayChannel, {
				time: ms(giveawayDuration),
				prize: giveawayPrize,
				winnerCount: numberOfWinners,
				hostedBy: message.author,
				messages: {
					giveaway: '🎉 **GIVEAWAY** 🎉',
					giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
					timeRemaining: 'Time remaining: **{duration}**!',
					inviteToParticipate: 'React with 🎉 to participate!',
					winMessage: 'Congratulations, {winners}! You won 🎉 {prize}! 🎉',
					embedFooter: 'Giveaways',
					noWinner: 'Giveaway cancelled, no valid participations.',
					hostedBy: 'Hosted by: {user}',
					winners: 'winner(s)',
					endedAt: 'Ended at',
					units: {
						seconds: 'seconds',
						minutes: 'minutes',
						hours: 'hours',
						days: 'days',
						pluralS: false,
					},
				},
			});

			message.reply(`Giveaway started in ${giveawayChannel}!`);
		}
		else if (args[0].toLowerCase() === 'end') {
			const giveawayGuild = client.giveawaysManager.giveaways.filter(g => g.guildID === message.guild.id);

			if (!args[1]) {
				return message.reply(`**${message.author.username}**, The right syntax is \`${prefix}giveaway end <message ID | prize>\`.`);
			}

			const giveaway = giveawayGuild.find(g => g.prize === args.slice(1).join(' ')) || giveawayGuild.find(g => g.messageID === args[1]);


			if(!giveaway) {
				return message.reply(`Unable to find a giveaway for \`${args.slice(1).join(' ')}\`.`);
			}

			client.giveawaysManager.edit(giveaway.messageID, {
				setEndTimestamp: Date.now(),
			}).then(() => {
				message.reply(`Giveaway will end in less than ${(client.giveawaysManager.options.updateCountdownEvery / 1000)} seconds...`);
			}).catch(e => {
				if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)) {
					message.reply('This giveaway is already ended!');
				}
				else {
					console.error(e);

					message.reply('An error occured...');
				}
			});
		}
		else if (args[0].toLowerCase() === 'reroll') {
			let giveaway;
			const giveawayGuild = client.giveawaysManager.giveaways.filter(g => g.guildID === message.guild.id);

			if (!args[1]) {
				giveaway = giveawayGuild[giveawayGuild.length - 1];
			}

			if (args[1]) {
				giveaway = giveawayGuild.find((g) => g.prize === args.slice(1).join(' ')) || giveawayGuild.find((g) => g.messageID === args[1]);
			}

			if (!giveaway) {
				return message.reply('Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');
			}

			client.giveawaysManager.reroll(giveaway.messageID)
				.then(() => {
					message.reply('Giveaway rerolled!');
				}).catch((e) => {
					if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)) {
						message.reply('This giveaway is not ended!');
					}
					else {
						console.error(e);

						message.reply('An error occured...');
					}
				});
		}
	},
};