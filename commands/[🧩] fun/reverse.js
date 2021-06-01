const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'reverse',
	description: 'Reverse a text',
	example: `${bot_prefix}reverse <text>`,
	usage: '<text>',
	category: '[🧩] fun',
	run: (client, message, args) => {
		if (args.length < 1) {
			message.reply('You must input text to be reversed!');
			return;
		}
		message.channel.send(args.join(' ').split('').reverse().join(''), { disableMentions: 'all' });


	},
};