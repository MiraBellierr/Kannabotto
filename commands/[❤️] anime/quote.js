const axios = require('axios');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'quote',
	category: '[❤️] anime',
	description: 'Quote from the Anime character',
	example: `${bot_prefix}quote`,
	run: async (client, message) => {

		axios({
			method: 'get',
			url: 'https://animechan.vercel.app/api/random',
		}).then(res => {
			return message.channel.send(`"${res.data.quote}"\n\n*${res.data.character} - ${res.data.anime}*`);
		});
	},
};