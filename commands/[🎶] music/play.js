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

const { play } = require('../../include/play');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const yts = require('yt-search');
const Discord = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'play',
	aliases: ['p'],
	category: '[🎶] music',
	description: 'Plays audio from YouTube',
	example: `${bot_prefix}play <YouTube URL>`,
	usage: '<YouTube URL>',
	run: async (client, message, args) => {
		if (message.deletable) {
			message.delete();
		}

		const { channel } = message.member.voice;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!channel) return message.reply(`**${message.author.username}**, you need to join a voice channel first!`).catch(err => message.reply(`An error occurred\n\`${err}\``));
		if (serverQueue && channel !== message.guild.me.voice.channel) {return message.reply(`**${message.author.username}**, you must be in the same channel as me.`).catch(err => message.reply(`An error occurred\n\`${err}\``));}

		if (!args.length) {
			return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}play <YouTube URL>\``)
				.catch(console.error);
		}

		const permissions = channel.permissionsFor(message.client.user);

		if (!permissions.has('CONNECT')) {return message.reply(`**${message.author.username}**, I'm missing \`CONNECT\` permission.`);}
		if (!permissions.has('SPEAK')) {return message.reply(`**${message.author.username}**, I'm missing \`SPEAK\` permission.`);}

		message.reply('*Please wait...*').catch(e => console.log(e));

		yts(args.join(' '), async (err, res) => {
			if (err) return message.reply('No video found.');

			const queueConstruct = {
				textChannel: message.channel,
				channel,
				connection: null,
				songs: [],
				loop: false,
				volume: 100,
				playing: true,
			};

			let song = null;

			try {
				song = {
					title: res.videos[0].title,
					url: res.videos[0].url,
					duration: res.videos[0].timestamp,
					image: res.videos[0].image,
					description: res.videos[0].description,
					views: res.videos[0].views,
					created: res.videos[0].ago,
				};
			}
			catch (error) {
				console.error(error);
				message.reply(error.message).catch(console.error);
				return;
			}

			if (serverQueue) {
				serverQueue.songs.push(song);
				return serverQueue.textChannel
					.send({ embeds: [new Discord.MessageEmbed().setAuthor('Added To Queue', 'https://cdn.discordapp.com/emojis/679796248819138561.gif').setDescription(song.title).setColor('RANDOM').setImage(song.image)] })
					.catch(console.error);
			}

			queueConstruct.songs.push(song);
			client.queue.set(message.guild.id, queueConstruct);

			try {
				joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});

				queueConstruct.connection = getVoiceConnection(channel.guild.id);

				play(queueConstruct.songs[0], message);

			}
			catch (error) {
				console.error(`Could not join voice channel: ${error}`);

				const queue = message.client.queue.get(message.guild.id);

				queue.connection._state.subscription.player.stop();

				message.client.queue.delete(message.guild.id);


				return message.reply(`Could not join the channel: ${error}`).catch(console.error);
			}
		});
	},
};