const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const log = require('../../database/logging.json');
const logsetting = require('../../database/logonoff.json');
const Discord = require('discord.js');

module.exports = {
	name: 'unban',
	category: '[🛠] moderation',
	description: 'unban a member',
	example: `${bot_prefix}unban <mention | id> [reason]`,
	usage: '<mention | id> [reason]',
	run: async (client, message, args) => {
		if (!message.guild.me.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('i don\'t have ban permission for me to unban this user').then(m => m.delete({ timeout: 5000 }));
		if (!message.member.permissions.has('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have ban permission to use this command.').then(m => m.delete({ timeout: 5000 }));

		const unbanned = message.mentions.users.first() || client.users.cache.get(args[0]);
		const reason = args.slice(1).join(' ');

		const member = await client.users.fetch(unbanned.id);
		console.log(member);
		const ban = await message.guild.fetchBans();

		// MESSAGES
		if (!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}unban [reason]\`.`);
		if (!unbanned) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}unban [reason]\`.`);

		if (!ban.get(member.id)) return message.channel.send('This user is not banned.');

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

		message.guild.members.unban(member);
		message.channel.send(`**${member.tag}** has been unbanned by **${message.author.username}** for a reason **${res}**`);

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
				.setColor('RANDOM')
				.setTitle('Member Unbanned')
				.setDescription(`Member: ${member.tag}`)
				.addFields(
					{ name: '**Unbanned By**', value: message.author },
					{ name: '**Reason**', value: res },
				)
				.setTimestamp()
				.setFooter(`Unbanned member ID: ${member.id}`);

			logChannel.send(embed);
		}
	},
};