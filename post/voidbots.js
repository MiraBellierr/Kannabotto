const axios = require('axios');
const { voidbots } = require('../config.json');

module.exports = async client => {

	axios({
		method: 'post',
		url: 'https://api.voidbots.net/bot/stats/636748567586930728',
		headers: {
			Authorization: voidbots,
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({
			'server_count': client.guilds.cache.size,
			'shard_count': client.shard.count,
		}),
	}).then(() => {
		console.log('[LOG] voidbots stats posted.');
	}).catch(err => {
		console.error(err);
	});
};