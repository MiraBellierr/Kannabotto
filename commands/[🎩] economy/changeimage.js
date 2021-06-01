const images = require('../../database/images.json');
const fs = require('fs');

module.exports = {
	name: 'changeimage',
	aliases: ['ci'],
	description: 'Custom image for patron',
	example: '<id> <link>',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args.length) return message.channel.send('<id> <link>');
		const id = args[0];
		const image = args[1];

		if (!images[id]) {
			images[id] = [
				{
					name: 'Default',
					image: null,
					count: 1,
				},
			];
		}

		images[id][0].image = image;
		fs.writeFile('./database/images.json', JSON.stringify(images, null, 2), (err) => {
			if (err) return console.error;
			return message.channel.send('Custom image has successfully been set.');
		});
	},
};