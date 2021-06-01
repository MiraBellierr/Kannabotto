const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'rate',
	description: 'Rates whatever you input as argument based on her mood',
	example: `${bot_prefix}rate <thing to rate>`,
	usage: '<thing to rate>',
	category: '[🧩] fun',
	run: (client, message, args) => {
		const answers = [
			// Postive
			'💯', 'Yes', 'me likey', '👀', '😍😍', 'he\'s cool yea', 'she\'s cool yea', 'uhhhh yes', 'indeed', 'would bang', 'my favorite', 'pretty good', 'music to my ears',
			'dreamy', 'Cool', 'at least it\'s not bad', 'not the best but still good', 'AMAZING', 'dude, that\'s like, awesome', `${client.emojis.cache.get('686924622637432902')}`,
			`they're cute ${client.emojis.cache.get('662970076781346837')}`, 'underrated',

			// Negative
			'how about no', 'yeah no', 'needs much improvement', 'barely ok, in short it\'s shit', '💩 basically', 'just horrible', 'never ask me to rate that again', 'overrated',
			'nobody wants to see that', 'i disapprove', 'i\'m not allowed to say', 'that\'s goodn\'t', 'oh no', 'very uhh, how do i say this without sounding rude', 'might as well throw it away',
			'this makes me wanna 🤮', 'what!! Lol', `you better be joking ${client.emojis.cache.get('703063200140230727')}`,
		];

		const answer = answers[Math.floor(Math.random() * answers.length)];

		if (args[0]) {
			message.channel.send(answer);
		}
		else {
			message.reply('Give me something to rate').then(m => m.delete(1500));
		}
	},
};