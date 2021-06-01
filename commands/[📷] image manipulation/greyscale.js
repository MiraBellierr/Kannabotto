const { bot_prefix } = require('../../config.json');
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'greyscale',
	description: 'remove colour from the image',
	category: '[📷] image manipulation',
	example: `${bot_prefix}greyscale [username | attachment]`,
	usage: '[username | attachment]',
	run: async (client, message, args) => {
		const image = message.attachments.first() || getMember(message, args.join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}greyscale [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.greyscale()
					.write('./images/greyscale.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/greyscale.png'] }).then(() => m.delete());
	},
};