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