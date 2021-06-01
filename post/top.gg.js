const axios = require('axios');
const { topgg } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://top.gg/api/bots/${client.user.id}/stats`,
		headers: {
			Authorization: topgg,
		},
		data: {
			'shard_count': client.shard.count,
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] top.gg stats posted.');
	}).catch(err => {
		console.error(err);
	});
};