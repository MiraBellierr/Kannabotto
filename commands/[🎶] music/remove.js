const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'remove',
	category: '[🎶] music',
	description: 'Remove song from the queue',
	example: `${bot_prefix}remove <queue number>`,
	usage: '<queue number>',
	run: async (client, message, args) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send('There is no queue.').catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		if (!args.length) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}remove <Queue Number>\``);
		if (isNaN(args[0])) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}remove <Queue Number>\``);

		const song = queue.songs.splice(args[0] - 1, 1);
		queue.textChannel.send(new Discord.MessageEmbed().setDescription(`**${message.author.username}** removed **${song[0].title}** from the queue.`).setColor('RANDOM'));
	},
};