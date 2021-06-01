const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'laugh',
	description: 'laugh actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}laugh`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/2775948586d6a24811726ce4dc681d47/tenor.gif?itemid=13786657', 'https://media1.tenor.com/images/615dc6190b6438d911f366944a917ede/tenor.gif?itemid=9388677', 'https://media1.tenor.com/images/26df2182fc943676dc6cc51371efc04b/tenor.gif?itemid=8932912', 'https://media1.tenor.com/images/3be8aa0228169cf5748e21eb972ffa1d/tenor.gif?itemid=12252557', 'https://media1.tenor.com/images/c468ca0162b2757b45a751870e753c64/tenor.gif?itemid=8453319', 'https://media1.tenor.com/images/0944ac9bc62026c81078217f68b77c19/tenor.gif?itemid=5292401'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} is laughing!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};