const axios = require('axios');
const { botlistspace } = require('../config.json');
module.exports = client => {

	axios({
		method: 'post',
		url: `https://api.botlist.space/v1/bots/${client.user.id}`,
		headers: {
			Authorization: botlistspace,
			'Content-Type': 'application/json',
		},
		data: {
			'shards': [client.guilds.cache.size],
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] botlist.space stats posted.');
	}).catch(err => {
		console.error(err);
	});
};