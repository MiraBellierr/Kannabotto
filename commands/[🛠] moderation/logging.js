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

const fs = require('fs');
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'logging',
	aliases: ['log'],
	category: '[🛠] moderation',
	description: 'Set the logging to the channel like `Message Edited`, `Message Deleted` and more!',
	example: `${bot_prefix}logging`,
	run: async (client, message, args) => {
		const prefix = prefixes[message.guild.id];
		const option = args.join(' ');
		if (!option) {
			const embed1 = new Discord.MessageEmbed()
				.setAuthor(`${client.user.username} Logging`, client.user.displayAvatarURL({ dynamic: true }))
				.setColor('#CD1C6C')
				.setDescription(`
**Proper Usage:**
• ${prefix}logging set \`#tagchannel\`
• ${prefix}logging on
• ${prefix}logging off
**Example:**
• ${prefix}logging set \`#mod-log\`
**After do that, do again:**
• ${prefix}logging on
`)
				.setFooter('Logging Announcement')
				.setTimestamp();
			message.reply({ embeds: [embed1] });
		}
		else if (option.match('set')) {
			const channel = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
			if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply(`**${message.author.username}**, 'Sorry you don't have manage server permission to use this command.`);
			const inputmessage = message.mentions.channels.first();
			if (!inputmessage) return message.reply(`**${message.author.username}**, The right syntax is \`${prefix}logging set <channel>\`.`);
			if (!message.guild.me.permissionsIn(inputmessage).has('SEND_MESSAGES')) return message.reply('I don\'t have a permission to send a message in that channel.');
			if (args[0]) {
				channel[message.guild.id] = {
					channel: inputmessage.id,
				};
				fs.writeFile('./database/logging.json', JSON.stringify(channel, null, 2), (err) => {
					if (err) console.log(err);
				});

				const embed2 = new Discord.MessageEmbed()
					.setColor('#CD1C6C')
					.setDescription(`Logging channel set to: ${inputmessage}`)
					.setTimestamp().setFooter('Logging channel', client.user.displayAvatarURL({ dynamic: true }));
				message.reply({ embeds: [embed2] });
			}
		}

		if (option.match('on')) {
			if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply(`**${message.author.username}**, Sorry, You need \`Manage Server\` permission to use this command!`);
			const welcomesetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));
			welcomesetting[message.guild.id] = {
				checker: 1,
			};
			fs.writeFile('./database/logonoff.json', JSON.stringify(welcomesetting, null, 2), (err) => {
				console.error(err);
			});
			const embed3 = new Discord.MessageEmbed()
				.setColor('#CD1C6C')
				.setDescription('Logging has been set **on**.')
				.setTimestamp()
				.setFooter('Logging enable', client.user.displayAvatarURL({ dynamic: true }));

			message.reply({ embeds: [embed3] });
		}
		if (option.match('off')) {
			if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply(`**${message.author.username}**, Sorry, You need \`Manage Server\` permission to use this command!`);
			const welcomesetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

			welcomesetting[message.guild.id] = {
				checker: 0,
			};
			fs.writeFile('./database/logonoff.json', JSON.stringify(welcomesetting, null, 2), (err) => {
				console.error(err);
			});
			const embed4 = new Discord.MessageEmbed()
				.setColor('#CD1C6C')
				.setDescription('Logging has been set **off**.')
				.setTimestamp()
				.setFooter('Logging disable', client.user.displayAvatarURL({ dynamic: true }));

			message.reply({ embeds: [embed4] });
		}
	},
};