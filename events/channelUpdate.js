/* eslint-disable no-case-declarations */
const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, oldChannel, newChannel) => {

	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if (oldChannel.type === 'dm') return;

	if(!logsetting[oldChannel.guild.id]) {
		logsetting[oldChannel.guild.id] = {
			checker: 1,
		};
	}
	if(!log[oldChannel.guild.id]) return;
	const values = logsetting[oldChannel.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if(!log) return;

		const logChannel = oldChannel.guild.channels.cache.get(`${log[oldChannel.guild.id].channel}`);
		if(!logChannel) return;

		if (newChannel.name !== oldChannel.name) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Channel Name Updated', newChannel.guild.iconURL({ dynamic: true }))
				.addField('Before', `#${oldChannel.name}`)
				.addField('After', `#${newChannel.name}`)
				.setTimestamp()
				.setFooter(`ID: ${newChannel.id}`);

			logChannel.send(embed);
		}
		else if (newChannel.topic !== oldChannel.topic) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Channel Topic Updated', newChannel.guild.iconURL({ dynamic: true }))
				.setDescription(`Channel: ${newChannel}`)
				.addField('Before', oldChannel.topic)
				.addField('After', newChannel.topic)
				.setTimestamp()
				.setFooter(`ID: ${newChannel.id}`);

			logChannel.send(embed);
		}
		else if (newChannel.nsfw !== oldChannel.nsfw) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Channel NSFW Updated', newChannel.guild.iconURL({ dynamic: true }))
				.setDescription(`Channel: ${newChannel}`)
				.addField('Before', oldChannel.nsfw ? 'true' : 'false')
				.addField('After', newChannel.nsfw ? 'true' : 'false')
				.setTimestamp()
				.setFooter(`ID: ${newChannel.id}`);

			logChannel.send(embed);
		}
		else if (newChannel.bitrate !== oldChannel.bitrate) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Channel Bitrate Updated', newChannel.guild.iconURL({ dynamic: true }))
				.setDescription(`Channel: ${newChannel}`)
				.addField('Before', `${oldChannel.bitrate} kbps`)
				.addField('After', `${newChannel.bitrate} kpbs`)
				.setTimestamp()
				.setFooter(`ID: ${newChannel.id}`);

			logChannel.send(embed);
		}

	}
};