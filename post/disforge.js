const axios = require('axios');
const { disforge } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://disforge.com/api/botstats/${client.user.id}`,
		headers: {
			Authorization: disforge,
		},
		data: {
			servers: client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] disforge stats posted.');
	}).catch(err => {
		console.error(err);
	});
};