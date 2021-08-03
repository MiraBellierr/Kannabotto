const fetch = require('node-fetch');
const base = 'https://discord.com/api/v9';
const TOKEN = process.env.TOKEN;

async function getBotGuilds() {
	const response = await fetch(`${base}/users/@me/guilds`, {
		method: 'GET',
		headers: {
			Authorization: `Bot ${TOKEN}`,
		},
	});
	return response.json();
}

module.exports = { getBotGuilds };