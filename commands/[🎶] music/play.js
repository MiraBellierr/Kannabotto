const { play } = require('../../include/play');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const yts = require('yt-search');
const Discord = require('discord.js');

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
		if (!channel) return message.channel.send(`**${message.author.username}**, you need to join a voice channel first!`).catch(err => message.channel.send(`An error occurred\n\`${err}\``));
		if (serverQueue && channel !== message.guild.me.voice.channel) {return message.channel.send(`**${message.author.username}**, you must be in the same channel as me.`).catch(err => message.channel.send(`An error occurred\n\`${err}\``));}

		if (!args.length) {
			return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}play <YouTube URL>\``)
				.catch(console.error);
		}

		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {return message.channel.send(`**${message.author.username}**, I'm missing \`CONNECT\` permission.`);}
		if (!permissions.has('SPEAK')) {return message.channel.send(`**${message.author.username}**, I'm missing \`SPEAK\` permission.`);}
		const m = await message.channel.send('*Please wait...*');
		yts(args.join(' '), async (err, res) => {
			if (err) return message.channel.send('No video found.');
			console.log(res.videos[0]);

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
				m.delete();
				return serverQueue.textChannel
					.send(new Discord.MessageEmbed().setAuthor('Added To Queue', 'https://cdn.discordapp.com/emojis/679796248819138561.gif').setDescription(song.title).setColor('RANDOM').setImage(song.image))
					.catch(console.error);
			}

			queueConstruct.songs.push(song);
			client.queue.set(message.guild.id, queueConstruct);

			try {
				queueConstruct.connection = await channel.join();

				play(queueConstruct.songs[0], message);
				m.delete();
			}
			catch (error) {
				console.error(`Could not join voice channel: ${error}`);
				message.client.queue.delete(message.guild.id);
				await channel.leave();
				return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
			}
		});
	},
};