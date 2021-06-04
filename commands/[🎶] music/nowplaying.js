// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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