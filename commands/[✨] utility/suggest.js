const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'suggest',
	category: '[✨] utility',
	description: 'You can suggest anything that you think are good for this bot to have',
	example: `${bot_prefix}suggest <suggestion>`,
	usage: '<suggestion>',
	run: async (client, message, args) => {
		const channel = client.channels.cache.find(c => c.id === '711214528595230820');
		if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}suggest <suggestion>\``);
		message.delete();
		const embed = new MessageEmbed()
			.setTitle('New Suggestion')
			.setDescription(`**User:** ${message.author.tag}\n**Suggestion:** ${args.join(' ')}`)
			.setTimestamp();

		channel.send(embed);
		message.channel.send(`Thanks ${message.author.username} for your suggestion! Your suggestion "**${args.join(' ')}**" has been sent!`);
	},
};