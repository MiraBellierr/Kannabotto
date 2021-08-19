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
	name: 'unmute',
	category: '[🛠] moderation',
	description: 'unmute a member',
	example: `${bot_prefix}unmute <mention | id | username> [reason]`,
	usage: '<mention | id | username> [reason]',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('Sorry, you don\'t have `KICK_MEMBERS` permission to use this.').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.reply('I don\'t have `MANAGE_ROLES` permission for me to be able to mute someone.').then(m => m.delete({ timeout: 5000 }));

		const toMute = await getMember(message, args[0]);

		if (!args[0]) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}unmute <mention | id | username> [reason]\`.`);
		if (!toMute) return message.reply('The user can\'t be found.');

		const role = message.guild.roles.cache.find(r => r.name === 'muted');

		if (!role || !toMute.roles.cache.has(role.id)) return message.reply('This user is not muted!');

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

		await toMute.roles.remove(role.id).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));
		message.reply(`${toMute.user.tag} has been unmuted for a reason ${res}!`);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;
			if (!log[message.guild.id]) return;
			const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
			if(!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor('Member Unmuted', toMute.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`Member: ${toMute.user}`)
				.addFields(
					{ name: '**Unmuted By:**', value: message.author },
					{ name: '**Reason**', value: res },
				)
				.setTimestamp()
				.setFooter(`ID ${toMute.user.id}`);

			logChannel.send({ embeds: [embed] });
		}
	},
};