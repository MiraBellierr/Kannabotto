const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');
const { getMember } = require('../../functions');

module.exports = {
	name: 'comment',
	description: 'youtube comment image overlay',
	category: '[📷] image manipulation',
	example: `${bot_prefix}youtube <username | id | mentions> <text>`,
	usage: '[mention | attachment] <text>',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}comment <username | id | mention> <text>\`.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}comment <username | id | mention> <text>\`.`);
		const image = getMember(message, args[0]).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.channel.send('User not found.');
		const username = getMember(message, args[0]).displayName || message.member.displayName;
		const m = await message.channel.send('*Please wait..*');
		const comment = args.slice(1).join(' ');
		console.log(comment);
		const url = `https://some-random-api.ml/canvas/youtube-comment?avatar=${image}&username=${username}&comment=${comment}`;
		const attachment = new Discord.MessageAttachment(await encodeURI(url), 'youtube.png');
		message.channel.send(attachment).then(() => m.delete());
	},
};