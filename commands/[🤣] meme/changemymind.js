const { bot_prefix, img_username, img_password } = require('../../config.json');
const Discord = require('discord.js');
const axios = require('axios');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'changemymind',
	aliases: ['cmm'],
	category: '[🤣] meme',
	example: `${bot_prefix}changemymind <text 1>`,
	description: 'change my mind meme generator',
	usage: '<text 1>',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}changemymind <text1>\`.`);


		const m = await message.channel.send('Please wait...');

		axios({
			method: 'post',
			url: 'https://api.imgflip.com/caption_image',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				template_id: '129242436',
				username: img_username,
				password: img_password,
				text0: args.join(' '),
			},
		}).then(async response => {
			console.log(response);
			const attachment = new Discord.MessageAttachment(await response.data.data.url, '129242436.png');
			m.delete();
			message.channel.send(attachment);
		}).catch(err =>{
			message.channel.send('An error occurred. Please try again.');
			console.log(err);
		});

	},
};