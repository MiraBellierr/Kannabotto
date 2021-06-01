const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'resume',
	aliases: ['r'],
	category: '[🎶] music',
	description: 'Resume currently playing music',
	example: `${bot_prefix}resume`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is nothing playing.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		if (!queue.playing) {
			queue.playing = true;
			queue.connection.dispatcher.resume();
			queue.connection.dispatcher.pause();
			queue.connection.dispatcher.resume();
			return queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** resumed the music!`).setColor('RANDOM')).catch(console.error);
		}

		return message.channel.send(`**${message.author.username}**, the queue is not paused.`).catch(console.error);
	},
};