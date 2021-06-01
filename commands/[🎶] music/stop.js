const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'stop',
	aliases: ['leave', 'quit'],
	category: '[🎶] music',
	description: 'Stops the music',
	example: `${bot_prefix}stop`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);

		if (!queue) return message.channel.send(`**${message.author.username}**, nothing is playing right now.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		queue.songs = [];
		queue.connection.dispatcher.end();
		queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** stopped the music!`).setColor('RANDOM')).catch(console.error);
	},
};