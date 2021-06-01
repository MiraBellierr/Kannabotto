const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, channel) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if (channel.type === 'dm') return;

	if(!logsetting[channel.guild.id]) {
		logsetting[channel.guild.id] = {
			checker: 1,
		};
	}
	if(!log[channel.guild.id]) return;
	const values = logsetting[channel.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = channel.guild.channels.cache.get(`${log[channel.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor('Channel Created', channel.guild.iconURL)
			.setColor('RANDOM')
			.setDescription(`**Channel:** <#${channel.id}>`)
			.setTimestamp()
			.setFooter(`ID: ${channel.id}`);

		logChannel.send(embed);
	}
};