const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, invite) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[invite.guild.id]) {
		logsetting[invite.guild.id] = {
			checker: 1,
		};
	}
	if(!log[invite.guild.id]) return;
	const values = logsetting[invite.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = invite.guild.channels.cache.get(`${log[invite.guild.id].channel}`);
		if(!logChannel) return;

		if (invite.maxUses === 0) invite.maxUses = 'Unlimited';
		if (invite.maxAge === 0) invite.maxAge = 'Never';

		const embed = new Discord.MessageEmbed()
			.setAuthor('Invite Created', invite.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.setDescription(`inviter: ${invite.inviter}\nCode: ${invite.code}\nChannel: ${invite.channel}\nMax Uses: ${invite.maxUses}\nExpired After: ${invite.maxAge / 30} Minutes\nTemporary: ${invite.temporary ? 'On' : 'Off'}`)
			.setTimestamp();

		logChannel.send(embed);
	}
};