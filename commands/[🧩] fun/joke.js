const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'joke',
	category: '[🧩] fun',
	description: 'Get a random joke',
	example: `${bot_prefix}joke`,
	run: async (client, message) => {
		axios({
			method: 'get',
			url: 'https://official-joke-api.appspot.com/jokes/random',
		}).then(res => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${res.data.type}'s joke`, client.user.avatarURL())
				.setDescription(`${res.data.setup}\n${res.data.punchline}`)
				.setColor('RANDOM')
				.setTimestamp();

			message.channel.send(embed);
		}).catch(err => message.channel.send(`An error occurred \`${err}\``));
	},
};