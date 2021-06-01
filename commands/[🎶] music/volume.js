const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'volume',
	category: '[🎶] music',
	description: 'Change volume of currently playing music',
	example: `${bot_prefix}volume [0-100]`,
	run: async (client, message, args) => {
		const queue = client.queue.get(message.guild.id);

		if (!queue) return message.channel.send(`**${message.author.username}**, nothing is playing right now.`).catch(console.error);
		if (!canModifyQueue(message.member)) {return message.channel.send(`**${message.author.username}**, you need to join a voice channel first!`).catch(console.error);}

		if (!args[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`🔊 The current volume is: **${queue.volume}%**`).setColor('RANDOM')).catch(console.error);
		if (isNaN(args[0])) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}volume [0-100]\`.`).catch(console.error);
		if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0) {return message.channel.send(`**${message.author.username}**, please use a number between 0-100.`).catch(console.error);}

		queue.volume = args[0];
		queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

		return queue.textChannel.send(new Discord.MessageEmbed().setDescription(`Volume set to: **${args[0]}%**`).setColor('RANDOM')).catch(console.error);
	},
};