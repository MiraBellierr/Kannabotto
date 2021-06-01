const axios = require('axios');
const { discordlabs } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://bots.discordlabs.org/v2/bot/${client.user.id}/stats`,
		headers: {
			Authorization: discordlabs,
		},
		data: {
			'server_count': client.guilds.cache.size,
			'shard_count': client.shard.count,
		},
	}).then(() => {
		console.log('[LOG] discordlabs stats posted.');
	}).catch(err => {
		console.error(err);
	});
};