const axios = require('axios');
const { blist } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://blist.xyz/api/v2/bot/${client.user.id}/stats/`,
		headers: {
			Authorization: blist,
		},
		data: {
			'server_count':client.guilds.cache.size,
			'shard_count': client.shard.count,
		},
	}).then(() => {
		console.log('[LOG] dblist stats posted.');
	}).catch(err => {
		console.error(err);
	});
};