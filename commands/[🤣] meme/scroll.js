const { bot_prefix, img_username, img_password } = require('../../config.json');
const Discord = require('discord.js');
const prefixes = require('../../database/prefix.json');
const axios = require('axios');

module.exports = {
	name: 'scroll',
	category: '[🤣] meme',
	example: `${bot_prefix}scroll "<text 1>" "<text 2>"`,
	description: 'The scroll of truth meme generator',
	usage: '"<text 1>" "<text 2>"',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}scroll "<text1>" "<text2>"\`.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}scroll "<text1>" "<text2>"\`.`);

		const a = args.join(' ');
		const content = a.split('"');

		if (content[0] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}scroll "<text 1>" "<text2>"\`.`);
		if (content[4] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}scroll "<text 1>" "<text2>"\`.`);
		const m = await message.channel.send('Please wait...');

		axios({
			method: 'post',
			url: 'https://api.imgflip.com/caption_image',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				template_id: '123999232',
				username: img_username,
				password: img_password,
				text0: content[1],
				text1: content[3],
			},
		}).then(async response => {
			console.log(response);
			const attachment = new Discord.MessageAttachment(await response.data.data.url, '123999232.png');
			m.delete();
			message.channel.send(attachment);
		}).catch(err =>{
			message.channel.send('An error occurred. Please try again.');
			console.log(err);
		});

	},
};