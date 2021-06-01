const { bot_prefix } = require('../../config.json');
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'pixelate',
	description: 'apply a pixelation effect to the image',
	category: '[📷] image manipulation',
	example: `${bot_prefix}pixelate <number> [username | attachment]`,
	usage: '<number> [username | attachment]',
	run: async (client, message, args) => {
		const image = message.attachments.first() || getMember(message, args.slice(1).join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!args[0]) return message.reply(`please provide a size of the pixelate (number). For example, \`${prefixes[message.guild.id]}pixelate 12\`.`);
		if (isNaN(args[0])) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}pixelate <number> [username | attachment]\`.`);
		if (args[0] > 100 || args[0] < 1) return message.reply('you can only choose a number between 1-100');
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}pixelate <number> [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.pixelate(parseInt(args[0]))
					.write('./images/pixelate.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/pixelate.png'] }).then(() => m.delete());
	},
};