const ytdlDiscord = require('discord-ytdl-core');
const Discord = require('discord.js');

module.exports = {
	async play(song, message) {
		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			queue.channel.leave();
			message.client.queue.delete(message.guild.id);
			return queue.textChannel.send(new Discord.MessageEmbed().setAuthor('Music queue ended', 'https://cdn.discordapp.com/emojis/683860864624885811.gif').setDescription('I have left the voice channel').setColor('RANDOM')).catch(console.error);
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
			return message.channel.send(`Error: ${error.message ? error.message : error}`);
		}

		queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));

		const type = song.url.includes('youtube.com') ? 'opus' : 'ogg/opus';
		const dispatcher = queue.connection
			.play(stream, { type: type })
			.on('finish', () => {

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
			})
			.on('error', (err) => {
				console.error(err);
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			});
		dispatcher.setVolumeLogarithmic(queue.volume / 100);

		try {
			queue.textChannel.send(new Discord.MessageEmbed().setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/733017035658756187.gif').setURL(song.url).addFields({ name: 'Title', value: song.title, inline: true }, { name: 'URL', value: song.url, inline: true }, { name: 'Description', value: song.description }, { name: 'Duration', value: song.duration }, { name: 'Created', value: song.created, inline: true }).setColor('RANDOM').setImage(song.image));
		}
		catch (error) {
			console.error(error);
		}
	},
};