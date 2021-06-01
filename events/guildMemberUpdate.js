const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { color } = require('../config.json');

module.exports = async (client, oldMember, newMember) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	const newRoles = newMember.roles.cache
		.filter(r => r.id !== newMember.guild.id)
		.map(r => r).join(', ') || 'none';
	const oldRoles = oldMember.roles.cache
		.filter(r => r.id !== oldMember.guild.id)
		.map(r => r).join(', ') || 'none';

	if(!logsetting[newMember.guild.id]) {
		logsetting[newMember.guild.id] = {
			checker: 1,
		};
	}
	if(!log[newMember.guild.id]) return;
	const values = logsetting[newMember.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = newMember.guild.channels.cache.get(`${log[newMember.guild.id].channel}`);
		if(!logChannel) return;

		if (newMember.displayName !== oldMember.displayName) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Member Nickname Updated', newMember.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Member: ${newMember}`)
				.addField('Before', oldMember.displayName)
				.addField('After', newMember.displayName)
				.setFooter(`ID: ${newMember.id}`).setTimestamp();

			logChannel.send(embed);
		}
		else if (newRoles !== oldRoles) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Member Roles Updated', newMember.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Member: ${newMember}`)
				.addField('Before', `${oldRoles}`)
				.addField('After', `${newRoles}`)
				.setFooter(`ID: ${newMember.id}`).setTimestamp();

			logChannel.send(embed);
		}
	}
};