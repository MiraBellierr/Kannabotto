const { bot_prefix } = require('../../config.json');
const Models = require('../../create-model');
const characters = require('../../database/characters.json');
const fs = require('fs');

module.exports = {
	name: 'overwriteimage',
	aliases: ['oi'],
	description: 'overwrite all image in the players inventory, player with the old image url and the boss image with a new one',
	example: `${bot_prefix}overwrite "<name>" "<image_url>" "<old_image_url>"`,
	usage: '"<name>" "<image_url>" "<old_image_url>"',
	run: async (client, message, args) => {
		if (message.author.id !== '548050617889980426') return;
		if (!args.length) return message.reply('"<name>" "<image_url>" "<old_image_url>"');
		if (!args[1]) return message.reply('"<name>" "<image_url>" "<old_image_url>"');
		const input = args.join(' ').split('"');

		if (input[0] !== '') return message.reply('"<name>" "<image_url>" "<old_image_url>"');
		if (input[2] !== ' ') return message.reply('"<name>" "<image_url>" "<old_image_url>"');
		if (input[4] !== ' ') return message.reply('"<name>" "<image_url>" "<old_image_url>"');
		if (input[6] !== '') return message.reply('"<name>" "<image_url>" "<old_image_url>"');

		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;
		const Players = Models.Player();
		const players = await Players.findAll();

		for (const i in characters) {
			if (characters[i].image === input[5]) {
				characters[i].image = input[3];
			}
		}
		fs.writeFile('./database/characters.json', JSON.stringify(characters, null, 2), (err) => {
			console.error(err);
			message.reply('Boss characters is overwritten.');
		});

		for (const i in players) {
			if (players[i].dataValues.image === input[5]) {
				await Players.update({ image: input[3] }, { where: { userId: players[i].dataValues.userId } });
			}
		}

		for (const i in images) {
			images[i].forEach(image => {
				if (image.name === input[1]) {
					image.image = input[3];
				}
			});
		}

		await Images.update({ data: images }, { where: { id: 1 } });
		message.reply('The image has been overwritten.');
	},
};