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

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const axios = require('axios');
const moment = require('moment');

module.exports = {
	name: 'search',
	category: '[❤️] anime',
	description: 'Search for an Anime, character or Manga',
	example: `${bot_prefix}search <name> [--anime | --character | --manga]`,
	usage: '<name> [--anime | --character | --manga]',
	run: async (client, message, args) => {
		if (!message.channel.nsfw) return message.reply('This command only can be used in nsfw channel.');
		if (!args.length) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}search <name> [--anime | --character | --manga]\``);

		const content = args.join(' ').split('--');
		const query = encodeURIComponent(content[0]);
		let type = 'anime';

		if (content[1]) type = content[1];

		axios({
			method: 'get',
			url: `https://api.jikan.moe/v3/search/${type}?q=${query}`,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async response => {
			if (type === 'anime') {
				const m = await message.reply('*please wait...*');
				const anime = response.data.results[0];
				const startDate = moment(anime.start_date).format('dddd, MMMM Do YYYY, h:mm:ss a');
				const endDate = moment(anime.end_date).format('dddd, MMMM Do YYYY, h:mm:ss a');

				const embed = new Discord.MessageEmbed()
					.setAuthor('Anime Search', message.author.displayAvatarURL({ dynamic: true }))
					.setTitle(anime.title)
					.setURL(anime.url)
					.setThumbnail(client.user.displayAvatarURL())
					.setDescription(anime.synopsis)
					.addFields([
						{
							name: 'Type', value: `${anime.type}`, inline: true,
						},
						{
							name: 'Episodes', value: anime.episodes === 0 ? '???' : `${anime.episodes}`, inline: true,
						},
						{
							name: 'Score', value: `${anime.score}`, inline: true,
						},
						{
							name: 'Start Date', value: `${startDate}`, inline: true,
						},
						{
							name: 'End Date', value: anime.end_date === null ? '???' : `${endDate}`, inline: true,
						},
						{
							name: 'Members', value: `${anime.members.toLocaleString()}`, inline: true,
						},
						{
							name: 'Rated', value: `${anime.rated}`, inline: true,
						},
					])
					.setColor('RANDOM')
					.setImage(anime.image_url)
					.setTimestamp()
					.setFooter(`ID: ${anime.mal_id}`);

				m.delete();

				return message.reply({ embeds: [embed] });
			}
			else if (type === 'character') {
				const m = await message.reply('*please wait...*');
				const character = response.data.results[0];
				const altNames = character.alternative_names.map((charname) => `${charname}`).join(', ');
				const anime = character.anime.splice(0, 5).map(anime2 => `${anime2.name}`).join(', ');
				const manga = character.manga.splice(0, 5).map(manga2 => `${manga2.name}`).join(', ');

				const embed = new Discord.MessageEmbed()
					.setAuthor('Character Search', message.author.displayAvatarURL({ dynamic: true }))
					.setTitle(character.name)
					.setURL(character.url)
					.setThumbnail(client.user.displayAvatarURL())
					.addFields([
						{
							name: 'Alternative_name', value: `${altNames}`,
						},
						{
							name: 'Anime', value: `${anime}`,
						},
						{
							name: 'Manga', value: `${manga}`,
						},
					])
					.setColor('RANDOM')
					.setImage(character.image_url)
					.setTimestamp()
					.setFooter(`ID: ${character.mal_id}`);

				m.delete();

				return message.reply({ embeds: [embed] });
			}
			else if (type === 'manga') {
				const m = await message.reply('*please wait...*');
				const manga = response.data.results[0];
				const startDate = moment(manga.start_date).format('dddd, MMMM Do YYYY, h:mm:ss a');
				const endDate = moment(manga.end_date).format('dddd, MMMM Do YYYY, h:mm:ss a');

				const embed = new Discord.MessageEmbed()
					.setAuthor('Manga Search', message.author.displayAvatarURL({ dynamic: true }))
					.setTitle(manga.title)
					.setURL(manga.url)
					.setThumbnail(client.user.displayAvatarURL())
					.setDescription(manga.synopsis)
					.addFields([
						{
							name: 'Type', value: `${manga.type}`, inline: true,
						},
						{
							name: 'Chapters', value: manga.chapters === 0 ? '???' : `${manga.chapters}`, inline: true,
						},
						{
							name: 'Volumes', value: manga.volumes === 0 ? '???' : `${manga.volumes}`, inline: true,
						},
						{
							name: 'Score', value: `${manga.score}`, inline: true,
						},
						{
							name: 'Start Date', value: `${startDate}`, inline: true,
						},
						{
							name: 'End Date', value: manga.end_date === null ? '???' : `${endDate}`, inline: true,
						},
						{
							name: 'Members', value: `${manga.members.toLocaleString()}`, inline: true,
						},
					])
					.setColor('RANDOM')
					.setImage(manga.image_url)
					.setTimestamp()
					.setFooter(`ID: ${manga.mal_id}`);

				m.delete();

				return message.reply({ embeds: [embed] });
			}
			else {
				return message.reply(`The right syntax is \`${prefixes[message.guild.id]}search <name> [--anime | --character | --manga]\``);
			}

		}).catch(err =>{
			console.log(err);

			return message.reply('I didn\'t find any result');
		});
	},
};