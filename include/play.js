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

const ytdlDiscord = require('discord-ytdl-core');
const Discord = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});


module.exports = {
	async play(song, message) {
		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			queue.connection.destroy();

			message.client.queue.delete(message.guild.id);

			return queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setAuthor('Music queue ended', 'https://cdn.discordapp.com/emojis/683860864624885811.gif').setDescription('I have left the voice channel').setColor('RANDOM')] }).catch(console.error);
		}

		let stream = null;

		try {
			if (song.url.includes('youtube.com')) {
				stream = await ytdlDiscord(song.url, { filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'] });
			}
		}
		catch (error) {
			if (queue) {
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			}

			console.error(error);

			return message.reply(`Error: ${error.message ? error.message : error}`);
		}

		queue.connection.on(VoiceConnectionStatus.Disconnected, () => message.client.queue.delete(message.guild.id));

		const type = song.url.includes('youtube.com') ? 'opus' : 'ogg/opus';

		const resource = createAudioResource(stream, { inputType: type, inlineVolume: true });
		player.play(resource);

		const dispatcher = queue.connection
			.subscribe(player)
			.player.on(AudioPlayerStatus.Idle, () => {
				if (queue.loop) {
				// if loop is on, push the song back at the end of the queue
				// so it can repeat endlessly
					const lastSong = queue.songs.shift();
					queue.songs.push(lastSong);
					module.exports.play(queue.songs[0], message);
				}
				else {
				// Recursively play the next song
					queue.songs.shift();
					module.exports.play(queue.songs[0], message);
				}
			}).on('unsubscribe', () => {
				message.client.queue.delete(message.guild.id);
			}).on('error', (err) => {
				console.error(err);
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			});

		dispatcher._state.resource.volume.setVolume(queue.volume / 100);

		try {
			queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/733017035658756187.gif').setURL(song.url).addFields({ name: 'Title', value: `${song.title}`, inline: true }, { name: 'URL', value: `${song.url}`, inline: true }, { name: 'Description', value: `${song.description}` }, { name: 'Duration', value: `${song.duration}` }, { name: 'Created', value: `${song.created}`, inline: true }).setColor('RANDOM').setImage(song.image)] });
		}
		catch (error) {
			console.error(error);
		}
	},
};