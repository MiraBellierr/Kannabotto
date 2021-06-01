const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'triggered',
	aliases: ['trigger'],
	description: 'triggered image overlay',
	category: '[📷] image manipulation',
	example: `${bot_prefix}triggered [username | attachment]`,
	usage: '[username | attachment]',
	run: async (client, message, args) => {
		let image = message.attachments.first() || getMember(message, args.join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}triggered [username | attachment]\`.`);
		if (image === message.attachments.first()) {
			image = message.attachments.first().url;
		}
		const m = await message.channel.send('*Please wait..*');
		const attachment = new Discord.MessageAttachment(await `https://some-random-api.ml/canvas/triggered?avatar=${image}`, 'triggered.gif');
		message.channel.send(attachment).then(() => m.delete());
	},
};