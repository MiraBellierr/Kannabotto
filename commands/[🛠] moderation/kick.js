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
const prefixes = require('../../database/prefix.json');
const log = require('../../database/logging.json');
const logsetting = require('../../database/logonoff.json');
const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	category: '[🛠] moderation',
	description: 'kick a member',
	example: `${bot_prefix}kick <mention | id | username> [reason]`,
	usage: '<mention | id | username> [reason]',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('Sorry you don\'t have kick members permission to use this command.');
		if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.reply('I don\'t have kick members permission. Please enable it for me to be able to kick members');
		if (!args[0]) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}kick <mention | id | username> [reason]\`.`);

		const member = await getMember(message, args[0]);

		if (!member) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}kick <mention | id | username> [reason]\`.`);
		if (!member.kickable) return message.reply('Seems like I can\'t kick that user');
		if (member.user.id === '275989071774351360') return message.reply('Seems like I can\'t kick my owner!');
		if (member.user.id === message.author.id) return message.reply('Seems like you can\'t kick yourself');
		if (member.user.id === client.user.id) return message.reply('Seems like I can\'t kick myself');
		if (member.roles.highest.position > message.member.roles.highest.position && message.guild.owner.user.id !== message.author.id) return message.reply('Please make sure your role is higher than the person you want to kick.');

		if (!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		const values = logsetting[message.guild.id].checker;


		const reason = args.slice(1).join(' ');

		let res;
		if (!reason) {
			res = 'no reason given';
		}
		else {
			res = reason;
		}

		member.send(`Hi there, you have been kicked from **${message.guild.name}** for **${res}**`).catch(e => console.log(e.name));
		await member.kick(reason).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));
		message.reply(`Successfully kicked **${member.user.username}** for a reason **${res}**, by **${message.author.username}**.`);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;
			if (!log[message.guild.id]) return;
			const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
			if (!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor('Member Kicked', member.user.displayAvatarURL({ dynamic: true }))
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`Member: ${member.user.tag}`)
				.addFields(
					{ name: '**Kicked By**', value: message.author },
					{ name: '**Reason**', value: res },
				)
				.setTimestamp()
				.setFooter(`ID: ${member.user.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
	},
};