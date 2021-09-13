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
const moderation = require('../../database/moderation.json');
const Discord = require('discord.js');
const ms = require('ms');
const fs = require('fs');

module.exports = {
	name: 'mute',
	category: '[🛠] moderation',
	description: 'mute a member',
	example: `${bot_prefix}mute <mention | id | username> <duration> [reason]`,
	usage: '<mention | id | username> <duration> [reason]',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('Sorry, you don\'t have kick members permission to use this command.');
		if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.reply('I don\'t have manage roles permission. Please enable it for me to be able to mute members.');
		if (!args.length) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}mute <mention | id | username> <duration> [reason]\`.`);

		const tomute = await getMember(message, args[0]);

		if (!tomute) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}mute <mention | id | username> <duration> [reason]\`.`);
		if (tomute.permissions.has('KICK_MEMBERS')) return message.reply('I cant mute this user');
		if (tomute.user.id === message.author.id) return message.reply('You can\'t mute yourself!');
		let muterole = message.guild.roles.cache.find(r => r.name === 'muted');

		if (!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		const values = logsetting[message.guild.id].checker;


		if (!muterole) {
			try{
				muterole = await message.guild.roles.create({
					data: {
						name: 'muted',
						color: '#000000',
						permissions:[],
					},
				});
				message.guild.channels.cache.forEach(async (channel) => {
					await channel.overwritePermissions(muterole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
					});
				});
			}
			catch(e) {
				console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`);
			}
		}

		const mutetime = args[1];
		if (!args[1]) return message.reply('You didn\'t specify a duration!');
		const splitArgs = mutetime.split('');
		if (isNaN(splitArgs[0])) return message.reply('please specify the correct duration. For example, 10m, 1h');


		const reason = args.slice(2).join(' ');
		let res;
		if (!reason) {
			res = 'no reason given';
		}
		else {
			res = reason;
		}

		const timeOut = ms(mutetime);
		if (!moderation[tomute.user.id]) {
			moderation[tomute.user.id] = {
				mute: null,
			};
		}

		const muteTime = await moderation[tomute.user.id].mute;

		if ((muteTime !== null && timeOut - (Date.now() - muteTime) > 0) || tomute.roles.cache.has(muterole.id)) return message.reply('This user has already been muted.');

		moderation[tomute.user.id].mute = Date.now();

		await (tomute.roles.add(muterole.id)).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));

		message.reply(`**${tomute.user.username}** has been muted for ${ms(ms(mutetime))} by ${message.author.username} for a reason ${res}`);

		fs.writeFile('./database/moderation.json', JSON.stringify(moderation, null, 2), (err) => {
			if (err) return message.reply(`An error occurred: \`${err}\``);
		});

		setTimeout(function() {
			tomute.roles.remove(muterole.id).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));

			if (values === undefined) return;
			if (values === 0) return;
			if (values === 1) {
				if (!log) return;
				if (!log[message.guild.id]) return;
				const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
				if(!logChannel) return;

				const embed = new Discord.MessageEmbed()
					.setAuthor('Member Unmuted', tomute.user.displayAvatarURL({ dynamic: true }))
					.setDescription(`Member: ${tomute.user}`)
					.addFields(
						{ name: '**Unmuted By**', value: client.user },
						{ name: '**Reason**', value: 'Duration ended' },
					)
					.setColor('#CD1C6C')
					.setTimestamp()
					.setFooter(`ID: ${tomute.user.id}`);

				logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
			}
		}, timeOut);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;

			const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
			if(!logChannel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor('Member Muted', tomute.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Member: ${tomute.user}`)
				.addFields(
					{ name: '**Muted By**', value: message.author },
					{ name: '**Duration**', value: ms(ms(mutetime)) },
					{ name: '**Reason**', value: res },
				)
				.setColor('#CD1C6C')
				.setTimestamp()
				.setFooter(`ID: ${tomute.user.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
	},
};