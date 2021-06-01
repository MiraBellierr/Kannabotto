const axios = require('axios');
const { botsfordiscord } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://botsfordiscord.com/api/bot/${client.user.id}`,
		headers: {
			Authorization: botsfordiscord,
			'Content-Type': 'application/json',
		},
		data: {
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] botsfordiscord stats posted.');
	}).catch(err => {
		console.error(err);
	});
};