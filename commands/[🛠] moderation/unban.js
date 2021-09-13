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
const prefixes = require('../../database/prefix.json');
const log = require('../../database/logging.json');
const logsetting = require('../../database/logonoff.json');
const Discord = require('discord.js');

module.exports = {
	name: 'unban',
	category: '[🛠] moderation',
	description: 'unban a member',
	example: `${bot_prefix}unban <id> [reason]`,
	usage: '<mention | id> [reason]',
	run: async (client, message, args) => {
		if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.reply('I don\'t have ban permission. Please enable it for me to be able to unban users.');
		if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('Sorry you don\'t have ban permission to use this command.');

		// MESSAGES
		if (!args[0]) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}unban <id> [reason]\`.`);

		const reason = args.slice(1).join(' ');
		const member = await client.users.fetch(args[0]);
		if (!member) return message.reply('I couldn\'t find this user.');
		const fetchBans = await message.guild.bans.fetch();
		const ban = fetchBans.find(b => b.user.id === member.id);

		if (!ban) return message.reply('This user is not banned.');

		if (!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		const values = logsetting[message.guild.id].checker;


		let res;
		if (!reason) {
			res = 'No reason given';
		}
		else {
			res = reason;
		}

		message.guild.members.unban(member).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));
		message.reply(`**${member.tag}** has been unbanned by **${message.author.username}** for a reason **${res}**`);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;
			if (!log[message.guild.id]) return;
			const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
			if(!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor(member.username, member.displayAvatarURL({ dynamic: true }))
				.setThumbnail(member.displayAvatarURL({ dynamic: true }))
				.setColor('#CD1C6C')
				.setTitle('Member Unbanned')
				.setDescription(`Member: ${member.tag}`)
				.addFields(
					{ name: '**Unbanned By**', value: message.author },
					{ name: '**Reason**', value: res },
				)
				.setTimestamp()
				.setFooter(`Unbanned member ID: ${member.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
	},
};