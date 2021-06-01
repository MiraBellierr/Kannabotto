const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'donate',
	description: 'Donate to get extra perks',
	category: '[✨] utility',
	example: `${bot_prefix}donate`,
	run: async (client, message) => {


		message.channel.send('Donate any amount you want! It helps a creator afford a faster server for Jasmine! As a return, you will receive benefits!\nLink: https://www.patreon.com/jasminebot');
	},
};