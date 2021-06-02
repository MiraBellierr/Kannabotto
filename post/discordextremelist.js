const axios = require('axios');
const { discordextremelist } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://api.discordextremelist.xyz/v2/bot/${client.user.id}/stats`,
		headers: {
			Authorization: discordextremelist,
			'Content-Type': 'application/json',
		},
		data: {
			'guildCount':client.guilds.cache.size,
			'shardCount': client.shard.count,
		},
	}).then(() => {
		console.log('[LOG] discordextremelist stats posted.');
	}).catch(err => {
		console.error(err);
	});
};