const axios = require('axios');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'lolis',
	aliases: ['loli'],
	description: 'Hidden command shhhh. Lolis pics',
	example: `${bot_prefix}lolis`,
	run: async (client, message) => {
		if (!message.channel.nsfw) return message.channel.send(`**${message.author.username}**, This command only can be used in nsfw channel.`);

		axios({
			method: 'get',
			url: 'https://api.lolis.life/random?category=kawaii',
		}).then(res => message.channel.send({ embed: { image: { url: res.data.url } } })).catch(err => console.log(err));
	},
};