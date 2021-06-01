const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'pause',
	category: '[🎶] music',
	description: 'Pause the currently playing music',
	example: `${bot_prefix}pause`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is nothing playing.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		if (queue.playing) {
			queue.playing = false;
			queue.connection.dispatcher.pause(true);
			return queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** paused the music.`).setColor('RANDOM')).catch(console.error);
		}
	},
};