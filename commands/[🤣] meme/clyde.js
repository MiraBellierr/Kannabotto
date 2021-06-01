const axios = require('axios');
const prefix = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'clyde',
	category: '[🤣] meme',
	description: 'clyde message generator',
	example: `${prefix}clyde <text>`,
	usage: '<text>',
	run: async (client, message, args) => {
		const text = args.join(' ');
		if (!text) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}clyde <text>\`.`);
		if (text.charAt(80)) return message.channel.send('The text can\'t exceed 80 characters.');
		const m = await message.channel.send('*Loading...*');

		axios({
			method: 'get',
			url: 'https://nekobot.xyz/api/imagegen?type=clyde',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				text: text,
			},
		}).then(async res => {
			const attachment = await new Discord.MessageAttachment(await res.data.message, 'clyde.png');
			message.channel.send(attachment);
			m.delete();
		}).catch((err) => {
			message.channel.send('An error occured, please try again later.');
			console.log(err);
			m.delete();
		});
	},
};