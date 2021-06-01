const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, oldEmoji, newEmoji) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[oldEmoji.guild.id]) {
		logsetting[oldEmoji.guild.id] = {
			checker: 1,
		};
	}
	if(!log[oldEmoji.guild.id]) return;
	const values = logsetting[oldEmoji.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = oldEmoji.guild.channels.cache.get(`${log[oldEmoji.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor('Emoji Updated', oldEmoji.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.addField('Before', oldEmoji.name)
			.addField('After', newEmoji.name)
			.setTimestamp()
			.setFooter(`ID: ${newEmoji.id}`);

		logChannel.send(embed);
	}
};