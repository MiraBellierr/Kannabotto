const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'skipto',
	aliases: ['st'],
	category: '[🎶] music',
	description: 'Skip to the selected queue number',
	example: `${bot_prefix}skipto <queue number>`,
	usage: '<queue number>',
	run: async (client, message, args) => {
		if (!args.length) return message.channel.send(`**${message.author.username}**, the right syntax is ${prefixes[message.guild.id]}skipto <Queue Number>`);

		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is no queue.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		queue.playing = true;
		queue.songs = queue.songs.slice(args[0] - 2);
		queue.connection.dispatcher.end();
		queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** skipped ${args[0] - 1} songs`).setColor('RANDOM')).catch(console.error);
	},
};