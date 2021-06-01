const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'support',
	description: 'Jasmine bot support discord server',
	category: '[✨] utility',
	example: `${bot_prefix}support`,
	run: async (client, message) => {
		message.channel.send('Our support server:\nhttps://discord.gg/s875Hry');
	},
};