const axios = require('axios');
const { botlistme } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://botlist.me/api/v1/bots/${client.user.id}/stats`,
		headers: {
			authorization: botlistme,
		},
		data: {
			'shard_count': client.shard.count,
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] botlist.me stats posted.');
	}).catch(err => {
		console.error(err);
	});
};