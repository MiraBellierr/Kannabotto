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

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const fs = require('fs');
const starboard = require('../../database/starboard.json');

module.exports = {
	name: 'starboard',
	category: '[✨] utility',
	description: 'A :star: starboard channel for the server',
	example: `${bot_prefix}starboard`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('Sorry, You don\'t have manage channels permission to use this command!');

		const prefix = prefixes[message.guild.id];
		const option = args.join(' ');

		if (!starboard[message.guild.id]) {
			starboard[message.guild.id] = {
				channel: 'none',
				checker: 0,
				count: 1,
			};
		}

		if (!option) {
			const embed1 = new Discord.MessageEmbed()
				.setAuthor(`${client.user.username} Starboard`, client.user.displayAvatarURL({ dynamic: true }))
				.setColor('#CD1C6C')
				.setDescription(`**Proper Usage:**\n• ${prefix}starboard set \`#tagchannel\`\n• ${prefix}starboard star \`number\` (stars needed for the message to be posted in the starboard channel, default = 1)\n• ${prefix}starboard on\n• ${prefix}starboard off\n**Example:**\n• ${prefix}starboard set \`#hall-of-fame\`\n**After do that, do again:**\n• ${prefix}starboard on`)
				.setFooter('Starboard Channel')
				.setTimestamp();

			message.reply({ embeds: [embed1] });
		}
		else if (option.match('set')) {

			const inputmessage = message.mentions.channels.first();

			if (!inputmessage) return message.reply(`The right syntax is \`${prefix}starboard set <channel>\`.`);
			if (!message.guild.me.permissionsIn(inputmessage).has('SEND_MESSAGES')) return message.reply('I do not have a permission to send a message in that channel.');

			if (args[0]) {
				starboard[message.guild.id].channel = inputmessage.id;

				fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
					if (err) console.log(err);
				});

				const embed2 = new Discord.MessageEmbed()
					.setColor('#CD1C6C')
					.setDescription(`Starboard channel set to: ${inputmessage}`)
					.setTimestamp().setFooter('Starboard channel', client.user.displayAvatarURL({ dynamic: true }));

				message.reply({ embeds: [embed2] });
			}
		}
		else if (option.match('star')) {
			const inputmessage = parseInt(args[1]);

			if (!args[1]) return message.reply(`The right syntax is \`${prefix}starboard star <number>\`.`);
			if (!inputmessage) return message.reply('Please enter a valid number');
			if (isNaN(inputmessage)) return message.reply('Please enter a valid number');
			if (inputmessage < 1) return message.reply(`**${message.author.username}**, please enter a valid number`);

			if (args[0]) {
				starboard[message.guild.id].count = inputmessage;

				fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
					if (err) console.log(err);
				});

				const embed2 = new Discord.MessageEmbed()
					.setColor('#CD1C6C')
					.setDescription(`Starboard star set to: ${inputmessage}`)
					.setTimestamp().setFooter('Starboard star', client.user.displayAvatarURL({ dynamic: true }));

				message.reply({ embeds: [embed2] });
			}

		}

		if (option.match('on')) {
			if (starboard[message.guild.id].channel === 'none') return message.reply('The channel has not been set yet for this guild.');

			starboard[message.guild.id].checker = 1;

			fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
				console.error(err);
			});

			const embed3 = new Discord.MessageEmbed()
				.setColor('#CD1C6C')
				.setDescription('Starboard has been set **on**.')
				.setTimestamp()
				.setFooter('Starboard enable', client.user.displayAvatarURL({ dynamic: true }));

			message.reply({ embeds: [embed3] });
		}
		if (option.match('off')) {
			if (starboard[message.guild.id].channel === 'none') return message.reply('The channel has not been set yet for this guild.');

			starboard[message.guild.id].checker = 0;

			fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
				console.error(err);
			});

			const embed4 = new Discord.MessageEmbed()
				.setColor('#CD1C6C')
				.setDescription('Starboard has been set **off**.')
				.setTimestamp()
				.setFooter('Starboard disable', client.user.displayAvatarURL({ dynamic: true }));

			message.reply({ embeds: [embed4] });
		}
	},
};