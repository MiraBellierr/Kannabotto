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
		if (!message.member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('Sorry you don\'t have `KICK_MEMBERS` permission to use this!').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have `KICK_MEMBERS` permission to kick members.').then(m => m.delete({ timeout: 5000 }));
		if (!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}kick <mention | id | username> [reason]\`.`);

		const member = getMember(message, args[0]);

		if (!member) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}kick <mention | id | username> [reason]\`.`);
		if (!member.kickable) return message.channel.send('Seems like I can\'t kick that user or I don\'t have a kick permission');
		if (member.user.id === '275989071774351360') return message.channel.send('Seems like I can\'t kick my owner!');
		if (member.user.id === message.author.id) return message.channel.send('Seems like you can\'t kick yourself');
		if (member.user.id === client.user.id) return message.channel.send('Seems like I can\'t kick myself');
		if (member.roles.highest.position > message.member.highest.position) return message.channel.send('Please make sure your role is higher than the person you want to kick.');

		if (!logsetting[message.guild.id]) {
			logsetting[message.guild.id] = {
				checker: 1,
			};
		}
		if (!log[message.guild.id]) return;
		const values = logsetting[message.guild.id].checker;


		const reason = args.slice(1).join(' ');

		let res;
		if (!reason) {
			res = 'No reason given';
		}
		else {
			res = reason;
		}

		await member.kick(reason).catch(() => message.channel.send('Sorry, I\'m unable to kick this person. Please make sure I have a kick permission and my role is higher than the person you want to kick'));

		message.channel.send(`Successfully kicked **${member.user.username}** for a reason **${res}**, by **${message.author.username}**.`);

		if (values === undefined) return;
		if (values === 0) return;
		if (values === 1) {
			if (!log) return;

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

			logChannel.send(embed);
		}
	},
};