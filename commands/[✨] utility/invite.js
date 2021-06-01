const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'invite',
	category: '[✨] utility',
	description: 'Invite this bot to your server',
	example: `${bot_prefix}invite`,
	run: async (client, message) => {

		message.channel.send('You can invite me using this link:\nhttps://www.jasminebot.xyz/invite/');

	},
};