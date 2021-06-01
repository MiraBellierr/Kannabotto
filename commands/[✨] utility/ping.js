const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	category: '[✨] utility',
	description: 'Returns latency and API ping',
	example: `${bot_prefix}ping`,
	run: async (client, message) => {
		const msg = await message.channel.send('🏓 Pinging....');

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('RANDOM')
			.setTitle('🏓 Pong')
			.addField('Latency', `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
			.addField('API Latency', `${Math.round(client.ws.ping)}ms`)
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));


		message.channel.send(embed).then(msg.delete());
	},
};