const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'advice',
	category: '[🧩] fun',
	description: 'I\'ll give you some great advice, I\'m just too kind.',
	example: `${bot_prefix}advice`,
	run: (client, message) => {
		require('request')('http://api.adviceslip.com/advice', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				message.channel.send(`${JSON.parse(body).slip.advice}`);
			}
			else {
				message.channel.send('I couldn\'t think of any advice...');
			}
		});
	},
};