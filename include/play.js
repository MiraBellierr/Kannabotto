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

const { StreamType, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdlDiscord = require('discord-ytdl-core');
const Discord = require('discord.js');

module.exports = {
	async play(song, message) {
		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			try {
				queue.connection.destroy();
				queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setAuthor('Music queue ended', 'https://cdn.discordapp.com/emojis/683860864624885811.gif').setDescription('I have left the voice channel').setColor('#CD1C6C')] });

			}
			catch (e) {
				console.log(e);
			}

			return message.client.queue.delete(message.guild.id);
		}

		let stream = null;

		try {
			stream = ytdlDiscord(song.url, { filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'] });
		}
		catch(e) {
			console.log(e);

			return message.reply(`${e.message}. Please report to the support server.`);
		}

		queue.resource = createAudioResource(stream, {
			inputType: StreamType.Opus,
			inlineVolume: true,
		});
		queue.resource.volume.setVolume(queue.volume / 100);

		queue.player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		queue.player.play(queue.resource);
		queue.connection.subscribe(queue.player);

		queue.player.on(AudioPlayerStatus.Idle, () => {
			if (queue.loop) {
				const lastSong = queue.songs[queue.position];

				return module.exports.play(lastSong, message);
			}
			else {
				queue.position++;
				return module.exports.play(queue.songs[queue.position], message);
			}
		});

		queue.player.on('error', error => {
			console.log(error);
			if (queue.loop) {
				const lastSong = queue.songs[queue.position];

				return module.exports.play(lastSong, message);
			}
			else {
				queue.position++;
				return module.exports.play(queue.songs[queue.position], message);
			}
		});

		try {
			const description = Discord.Util.splitMessage(`${song.description}`, {
				maxLength: 1024,
				char: '',
			});

			queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/733017035658756187.gif').setURL(song.url).addFields({ name: 'Title', value: `${song.title}`, inline: true }, { name: 'URL', value: `${song.url}`, inline: true }, { name: 'Description', value: `${description[0]}` }, { name: 'Duration', value: `${song.duration}` }, { name: 'Created', value: `${song.created}`, inline: true }).setColor('#CD1C6C').setImage(song.image)] });
		}
		catch (e) {
			console.log(e);
		}
	},
};