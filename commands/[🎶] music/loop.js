const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'loop',
	category: '[🎶] music',
	description: 'Toggle music loop',
	example: `${bot_prefix}loop`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is nothing playing.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.channel.send('You need to join the voice channel first');

		queue.loop = !queue.loop;
		return queue.textChannel
			.send(new Discord.MessageEmbed().setDescription(`<a:kitty_catch_love:719099040494518285> Loop is now ${queue.loop ? '**on**' : '**off**'}`).setColor('RANDOM'))
			.catch(console.error);
	},
};