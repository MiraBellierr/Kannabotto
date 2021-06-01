const axios = require('axios');
const { discordbotlist } = require('../config.json');

module.exports = client => {
	axios({
		method: 'post',
		url: `https://discordbotlist.com/api/v1/bots/${client.user.id}/stats`,
		headers: {
			Authorization: discordbotlist,
		},
		data: {
			'guilds': client.guilds.cache.size,
			'users': client.users.cache.size,
		},
	}).then(() => {
		console.log('[LOG] discordbotlist stats posted.');
	}).catch(err => {
		console.error(err);
	});
};