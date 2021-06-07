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
	name: 'ban',
	category: '[🛠] moderation',
	description: 'ban a member',
	example: `${bot_prefix}ban <mention> [reason]`,
	usage: '<mention | id | username> [reason]',
	run: async (client, message, args) => {
		if(!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('Sorry you don\'t have ban permission to use this command.').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have ban permission. Please enable it for me to be able to ban members').then(m => m.delete({ timeout: 5000 }));
		if(!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}ban <mention | id | username> [reason]\`.`);

		const member = getMember(message, args[0]);

		if (!member) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}ban <mention | id | username> [reason]\`.`);
		if (!member.bannable) return message.channel.send('Seems like I can\'t ban this user. Please make sure my role is higher than any members');
		if (member.user.id === '275989071774351360') return message.channel.send('Seems like I can\'t ban my owner!');
		if (member.user.id === client.user.id) return message.channel.send('Seems like I can\'t ban myself');
		if (member.user.id === message.author.id) return message.channel.send('Seems like you can\'t ban yourself');
		if (member.roles.highest.position > message.member.roles.highest.position && message.guild.owner.user.id !== message.author.id) return message.channel.send('Please make sure your role is higher than the person you want to ban.');

		if (!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		const values = logsetting[message.guild.id].checker;


		const reason = args.slice(1).join(' ');

		let res;
		if (!reason) {
			res = 'No reason given';
		}
		else {
			res = reason;
		}

		await member.ban({ reason: reason, days: 7 }).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));
		message.channel.send(`Successfully banned **${member.user.username}** for a reason **${res}**, by **${message.author.username}**.`);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;
			if (!log[message.guild.id]) return;
			const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
			if(!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor('Member Banned', member.user.displayAvatarURL({ dynamic: true }))
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`Member: ${member.user.tag}`)
				.addFields(
					{ name: '**Banned by**', value: message.author },
					{ name: '**Reason**', value: res },
				)
				.setTimestamp()
				.setFooter(`ID: ${member.user.id}`);

			logChannel.send(embed);
		}
	},
};