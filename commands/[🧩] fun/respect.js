const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'respect',
	aliases: ['f'],
	description: 'pay the respect',
	example: `${bot_prefix}respect`,
	category: '[🧩] fun',
	run: (client, message) => {
		message.channel.send(`${message.author.username} has paid their respects 💙`);
	},
};