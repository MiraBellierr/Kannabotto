const axios = require('axios');
const { paradisebots } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://paradisebots.net/api/v1/bot/${client.user.id}`,
		headers: {
			Authorization: paradisebots,
			'Content-Type': 'application/json',
		},
		data: {
			'shard_count': client.shard.count,
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] paradisebots stats posted.');
	}).catch(err => {
		console.error(err);
	});
};