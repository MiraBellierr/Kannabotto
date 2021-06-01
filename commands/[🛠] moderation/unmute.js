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
		if (!message.member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('Sorry, you don\'t have `KICK_MEMBERS` permission to use this.').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have `MANAGE_ROLES` permission for me to be able to mute someone.').then(m => m.delete({ timeout: 5000 }));

		const toMute = getMember(message, args[0]);

		if (!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}unmute <mention | id | username> [reason]\`.`);
		if (!toMute) return message.channel.send('The user can\'t be found.');

		const role = message.guild.roles.cache.find(r => r.name === 'muted');

		if (!role || !toMute.roles.cache.has(role.id)) return message.channel.send('This user is not muted!');

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

		await toMute.roles.remove(role.id);
		message.channel.send(`${toMute.user.tag} has been unmuted for a reason ${res}!`);

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

			logChannel.send(embed);
		}
	},
};