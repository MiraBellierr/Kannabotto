const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'report',
	category: '[✨] utility',
	description: 'reporting a user if they are breaking our rules, reporting bugs also can be done by using this command',
	example: `${bot_prefix}report <report>`,
	usage: '<report>',
	run: async (client, message, args) => {
		const channel = client.channels.cache.find(c => c.id === '701711939440476191');
		const startUp = new MessageEmbed()
			.setAuthor('Report command')
			.setDescription(`Proper usage: \`${prefixes[message.guild.id]}report <your report>\``)
			.addField('__How to report a user__', 'Your report should contain:\n**• User ID:**\n**• Reason:**')
			.addField('__How to report bugs__', 'Your report should contain:\n**• Short description:**\n**• Command:**\n**• Steps to reproduce:**')
			.setTimestamp();

		if (!args[0]) return message.channel.send(startUp);
		message.delete();
		const embed = new MessageEmbed()
			.setTitle('New Report')
			.setDescription(`**User:** ${message.author.tag}\n**Report:** ${args.join(' ')}`)
			.setTimestamp();

		channel.send(embed);
		message.channel.send(`Thanks ${message.author.username} for your report! Your report has been sent!`);
	},
};