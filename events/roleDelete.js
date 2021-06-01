const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, role) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[role.guild.id]) {
		logsetting[role.guild.id] = {
			checker: 1,
		};
	}
	if(!log[role.guild.id]) return;
	const values = logsetting[role.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = role.guild.channels.cache.get(`${log[role.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor('Role Deleted', role.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.setDescription(`Role: ${role.name}`)
			.setTimestamp()
			.setFooter(`ID: ${role.id}`);

		logChannel.send(embed);
	}
};