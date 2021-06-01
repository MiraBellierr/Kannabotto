const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'alignment',
	description: 'Choose a random alignment based on the persons id',
	category: '[🧩] fun',
	example: `${bot_prefix}alignment`,
	run(client, msg) {
		const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
		const id = parseInt(msg.author.id);
		const choice = id % alignments.length;
		const embed = new Discord.MessageEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setColor(client.color)
			.setDescription(`📜 ${msg.member.displayName}, you are **${alignments[choice]}**!`)
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		msg.channel.send(embed);
	},
};