const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { color } = require('../config.json');

module.exports = async (client, guild, user) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[guild.id]) {
		logsetting[guild.id] = {
			checker: 1,
		};
	}
	if(!log[guild.id]) return;
	const values = logsetting[guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = guild.channels.cache.get(`${log[guild.id].channel}`);
		if(!logChannel) return;

		const embed = new MessageEmbed()
			.setAuthor('Member Banned', guild.iconURL({ dynamic: true }))
			.setColor(color)
			.setDescription(`User: ${user.tag}`)
			.setTimestamp()
			.setFooter(`ID: ${user.id}`);

		logChannel.send(embed);
	}
};