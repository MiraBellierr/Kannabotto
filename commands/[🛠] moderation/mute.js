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
		if (!message.member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('Sorry, you don\'t have `KICK_MEMBERS` permission to use this!').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have `MANAGE_ROLES` permission for me to be able to mute someone.').then(m => m.delete({ timeout: 5000 }));

		if(!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		if(!log[message.guild.id]) return;
		const values = logsetting[message.guild.id].checker;

		const tomute = getMember(message, args[0]);

		if (!tomute) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}mute <mention | id | username> <duration> [reason]\`.`);
		if (tomute.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('I cant mute this user');
		if (tomute.user.id === message.author.id) return message.channel.send('You can\'t mute yourself!');
		let muterole = message.guild.roles.cache.find(r => r.name === 'muted');

		if(!muterole) {
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
				console.log(e.stack);
			}
		}

		const mutetime = args[1];
		if(!args[1]) return message.channel.send('You didn\'t specify a duration!');
		const splitArgs = mutetime.split('');
		if (isNaN(splitArgs[0])) return message.channel.send('please specify the correct duration. For example, 10m, 1h');


		const reason = args.slice(2).join(' ');
		let res;
		if(!reason) {
			res = 'No reason given';
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
		if ((muteTime !== null && timeOut - (Date.now() - muteTime) > 0) || tomute.roles.cache.has(muterole.id)) return message.channel.send('This user has already been muted.');
		moderation[tomute.user.id].mute = Date.now();
		await (tomute.roles.add(muterole.id));
		message.channel.send(`**${tomute.user.username}** has been muted for ${ms(ms(mutetime))} by ${message.author.username} for a reason ${res}`);
		fs.writeFile('./database/moderation.json', JSON.stringify(moderation, null, 2), (err) => {
			if (err) return message.channel.send(`An error occurred: \`${err}\``);
		});

		setTimeout(function() {
			tomute.roles.remove(muterole.id);

			if(values === undefined) return;
			if(values === 0) return;
			if(values === 1) {
				if (!log) return;

				const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
				if(!logChannel) return;

				const embed = new Discord.MessageEmbed()
					.setAuthor('Member Unmuted', tomute.user.displayAvatarURL({ dynamic: true }))
					.setDescription(`Member: ${tomute.user}`)
					.addFields(
						{ name: '**Unmuted By**', value: client.user },
						{ name: '**Reason**', value: 'Duration ended' },
					)
					.setColor('RANDOM')
					.setTimestamp()
					.setFooter(`ID: ${tomute.user.id}`);

				logChannel.send(embed);
			}
		}, timeOut);

		if(values === undefined) return;
		if(values === 0) return;
		if(values === 1) {
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
				.setColor('RANDOM')
				.setTimestamp()
				.setFooter(`ID: ${tomute.user.id}`);

			logChannel.send(embed);
		}
	},
};