const count = require('../../database/voiceCount.json');

module.exports = {
	name: 'voicecount',
	run: async (client, message) => {
		if (message.author.id !== '275989071774351360') return;
		if (!count.connect) {
			count.connect = 0;
		}
		message.channel.send(`Voice Count: ${count.connect}`);

	},
};