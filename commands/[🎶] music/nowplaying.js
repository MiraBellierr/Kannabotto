const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'nowplaying',
	aliases: ['np'],
	category: '[🎶] music',
	description: 'Show now playing song',
	example: `${bot_prefix}nowplaying`,
	run: (client, message) => {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(`**${message.author.username}**, there is nothing playing.`).catch(console.error);
		const song = queue.songs[0];

		const nowPlaying = new MessageEmbed().setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/679796248819138561.gif').setURL(song.url).addFields({ name: 'Title', value: song.title, inline: true }, { name: 'URL', value: song.url, inline: true }, { name: 'Description', value: song.description, inline: true }, { name: 'Duration', value: song.duration, inline: true }, { name: 'Created', value: song.created, inline: true }).setColor('RANDOM').setImage(song.image);

		return message.channel.send(nowPlaying);
	},
};