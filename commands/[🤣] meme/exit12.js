const { bot_prefix, img_username, img_password } = require('../../config.json');
const Discord = require('discord.js');
const axios = require('axios');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'exit12',
	category: '[🤣] meme',
	example: `${bot_prefix}exit12 "<text 1>" "<text 2>" "<text 3>"`,
	description: 'Left exit 12 off ramp meme generator',
	usage: '"<text 1>" "<text 2>" "<text 3>"',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);

		const a = args.join(' ');
		const content = a.split('"');

		if (content[0] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);
		if (content[2] !== ' ') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);
		if (content[4] !== ' ') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);
		if (content[6] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}exit12 "<text 1>" "<text 2>" "<text 3>"\`.`);

		const m = await message.channel.send('Please wait...');

		axios({
			method: 'post',
			url: 'https://api.imgflip.com/caption_image',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				template_id: '124822590',
				username: img_username,
				password: img_password,
				'boxes[0][text]': content[1],
				'boxes[1][text]': content[3],
				'boxes[2][text]': content[5],
			},
		}).then(async response => {
			console.log(response);
			const attachment = new Discord.MessageAttachment(await response.data.data.url, '124822590.png');
			m.delete();
			message.channel.send(attachment);
		}).catch(err =>{
			message.channel.send('An error occurred. Please try again.');
			console.log(err);
		});

	},
};