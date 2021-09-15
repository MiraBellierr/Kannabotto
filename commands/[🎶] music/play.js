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
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: 'play',
	aliases: ['p'],
	category: '[🎶] music',
	description: 'Plays audio from YouTube',
	example: `${bot_prefix}play <YouTube URL>`,
	usage: '<YouTube URL>',
	run: async (client, message, args) => {
		const m = await message.reply('*Please wait...*');
		const { channel } = message.member.voice;
		const queue = client.queue.get(message.guild.id);

		if (!channel) return message.reply('You need to join a voice channel first.');
		if (queue && channel !== message.guild.me.voice.channel) return message.reply('You must be in the same channel as me.');
		if (!channel.permissionsFor(client.user).has('CONNECT') || !channel.permissionsFor(client.user).has('SPEAK')) return message.reply('I don\'t have enough permission to speak or connect to that channel.');


		if (!args.length) {
			return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}play <YouTube URL>\``);
		}

		yts(args.join(' '), async (err, res) => {
			if (err) return message.reply('No song found.');

			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: channel,
				connection: null,
				resource: null,
				player: null,
				songs: [],
				position: 0,
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
			catch(e) {
				console.log(e);
				return message.reply(`${e.message}. please report to the support server.`);
			}

			if (queue) {
				queue.songs.push(song);

				m.delete();
				return queue.textChannel
					.send({ embeds: [new Discord.MessageEmbed().setAuthor('Added To Queue', 'https://cdn.discordapp.com/emojis/679796248819138561.gif').setDescription(song.title).setColor('#CD1C6C').setImage(song.image)] })
					.catch(console.error);
			}
			else {
				queueConstruct.songs.push(song);
				queueConstruct.connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});

				client.queue.set(message.guild.id, queueConstruct);

				try {
					m.delete();
					play(queueConstruct.songs[queueConstruct.position], message);
				}
				catch (e) {
					const postQueue = client.queue.get(message.guild.id);

					postQueue.connection.destroy();
					client.queue.delete(message.guild.id);

					console.log(e);

					return message.reply(`${e.message}`);
				}
			}

		});
	},
};