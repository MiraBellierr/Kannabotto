const { MessageEmbed, splitMessage, escapeMarkdown } = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'queue',
	aliases: ['q'],
	category: '[🎶] music',
	description: 'Show the music queue and now playing.',
	example: `${bot_prefix}queue`,
	run: (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is nothing playing.`).catch(console.error);

		const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)} - ${song.duration}`);

		const queueEmbed = new MessageEmbed()
			.setTitle(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`__Queue List:__\n${description}`)
			.setColor('RANDOM')
			.setTimestamp()
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));

		const splitDescription = splitMessage(description, {
			maxLength: 2048,
			char: '\n',
			prepend: '',
			append: '',
		});

		splitDescription.forEach(async (m) => {
			queueEmbed.setDescription(`__Queue List:__\n${m}`);
			message.channel.send(queueEmbed);
		});
	},
};