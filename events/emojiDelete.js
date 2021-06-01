const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, emoji) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[emoji.guild.id]) {
		logsetting[emoji.guild.id] = {
			checker: 1,
		};
	}
	if(!log[emoji.guild.id]) return;
	const values = logsetting[emoji.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = emoji.guild.channels.cache.get(`${log[emoji.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor('Emoji Deleted', emoji.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.setDescription(`Emoji: ${emoji}`)
			.setTimestamp()
			.setFooter(`ID: ${emoji.id}`);

		logChannel.send(embed);
	}
};