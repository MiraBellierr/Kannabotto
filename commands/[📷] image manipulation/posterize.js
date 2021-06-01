const { bot_prefix } = require('../../config.json');
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'posterize',
	description: 'apply a posterization effect with <number> level',
	category: '[📷] image manipulation',
	example: `${bot_prefix}posterize <number> [username | attachment]`,
	usage: '<number> [username | attachment]',
	run: async (client, message, args) => {
		const image = message.attachments.first() || getMember(message, args.slice(1).join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!args[0]) return message.reply(`please provide a level of the posterization (number). For example, \`${prefixes[message.guild.id]}posterize 5\`.`);
		if (isNaN(args[0])) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}posterize <number> [username | attachment]\`.`);
		if (args[0] > 100 || args[0] < 1) return message.reply('you can only choose a number between 1-100');
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}posterize <number> [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.posterize(parseInt(args[0]))
					.write('./images/posterize.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/posterize.png'] }).then(() => m.delete());
	},
};