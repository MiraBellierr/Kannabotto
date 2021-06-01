const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'shuffle',
	category: '[🎶] music',
	description: 'Shuffle queue',
	example: `${bot_prefix}shuffle`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is no queue.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		const songs = queue.songs;
		for (let i = songs.length - 1; i > 1; i--) {
			const j = 1 + Math.floor(Math.random() * i);
			[songs[i], songs[j]] = [songs[j], songs[i]];
		}
		queue.songs = songs;
		message.client.queue.set(message.guild.id, queue);
		queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** shuffled the queue`).setColor('RANDOM')).catch(console.error);
	},
};