const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const axios = require('axios');

module.exports = {
	name: 'top',
	category: '[❤️] anime',
	description: 'Top 10 Anime, Characters or Manga',
	example: `${bot_prefix}top [anime | characters | manga]`,
	usage: '[anime | character | manga]',
	run: async (client, message, args) => {
		let type = 'anime';

		if (args.length > 0) type = args[0];

		axios({
			method: 'get',
			url: `https://api.jikan.moe/v3/top/${type}`,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async response => {
			const m = await message.channel.send('*please wait...*');
			const top = response.data.top.splice(0, 10);
			const board = top.map((anime, i) => `**[${i + 1}] - [${anime.title}](${anime.url})**`).join('\n');

			const embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle(`Top 10 ${type.toLowerCase()}`)
				.setDescription(board)
				.setColor('RANDOM')
				.setTimestamp();

			m.delete();
			return message.channel.send(embed);
		}).catch(err =>{
			console.log(err);
			return message.channel.send('Request failed. An error occurs. Please check your spelling.');
		});
	},
};