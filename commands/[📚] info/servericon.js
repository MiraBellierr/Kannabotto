const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'servericon',
	aliases: ['si'],
	category: '[📚] info',
	example: `${bot_prefix}servericon`,
	description: 'Returns server icon',
	run: (client, message) => {
		const embeduser = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Server Icon')
			.setColor('RANDOM')
			.setImage(message.guild.iconURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));
		return message.channel.send(embeduser);
	},
};