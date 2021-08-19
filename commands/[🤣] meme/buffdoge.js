// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { bot_prefix, img_username, img_password } = require('../../config.json');
const Discord = require('discord.js');
const axios = require('axios');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'buffdoge',
	aliases: ['cheems'],
	category: '[🤣] meme',
	example: `${bot_prefix}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"`,
	description: 'Buff Doge vs. Cheems meme generator',
	usage: '"<text 1>" "<text 2>" "<text 3>" "<text 4>"',
	run: async (client, message, args) => {
		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);
		if (!args[1]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);

		const a = args.join(' ');
		const content = a.split('"');

		if (content[0] !== '') return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);
		if (content[2] !== ' ') return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);
		if (content[4] !== ' ') return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);
		if (content[6] !== ' ') return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);
		if (content[8] !== '') return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buffdoge "<text 1>" "<text 2>" "<text 3>" "<text 4>"\`.`);

		const m = await message.reply('Please wait...');

		axios({
			method: 'post',
			url: 'https://api.imgflip.com/caption_image',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				template_id: '247375501',
				username: img_username,
				password: img_password,
				'boxes[0][text]': content[1],
				'boxes[1][text]': content[3],
				'boxes[2][text]': content[5],
				'boxes[3][text]': content[7],
			},
		}).then(async response => {
			const attachment = new Discord.MessageAttachment(await response.data.data.url, '247375501.png');
			m.delete();
			message.reply({ files: [attachment] });
		}).catch(err =>{
			message.reply('An error occurred. Please try again.');
			console.log(err);
		});

	},
};