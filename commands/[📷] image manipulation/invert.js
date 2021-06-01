const { bot_prefix } = require('../../config.json');
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'invert',
	description: 'invert the image colours',
	category: '[📷] image manipulation',
	example: `${bot_prefix}invert [username | attachment]`,
	usage: '[username | attachment]',
	run: async (client, message, args) => {
		const image = message.attachments.first() || getMember(message, args.join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}invert [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.invert()
					.write('./images/invert.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/invert.png'] }).then(() => m.delete());
	},
};