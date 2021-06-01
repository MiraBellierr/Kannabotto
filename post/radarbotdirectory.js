const axios = require('axios');
const { radarbotdirectory } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://radarbotdirectory.xyz/api/bot/${client.user.id}/stats`,
		headers: {
			Authentication: radarbotdirectory,
		},
		data: {
			'shards': client.shard.count,
			'guilds': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] radarbotdirectory stats posted.');
	}).catch(err => {
		console.error(err);
	});
};