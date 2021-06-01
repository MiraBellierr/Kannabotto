const axios = require('axios');
const { discordbots } = require('../config.json');
module.exports = client => {

	axios({
		method: 'post',
		url: `https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`,
		headers: {
			Authorization: discordbots,
			'Content-Type': 'application/json',
		},
		data: {
			'shardCount': client.shard.count,
			'guildCount': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] discord.bots stats posted.');
	}).catch(err => {
		console.error(err);
	});
};