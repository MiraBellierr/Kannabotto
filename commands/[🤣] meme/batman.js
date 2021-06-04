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
	name: 'batman',
	category: '[🤣] meme',
	example: `${bot_prefix}batman "<text 1>" "<text 2>"`,
	description: 'Batman slapping Robin meme generator',
	usage: '"<text 1>" "<text 2>"',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}batman "<text1>" "<text2>"\`.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}batman "<text1>" "<text2>"\`.`);

		const a = args.join(' ');
		const content = a.split('"');

		if (content[0] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}batman "<text 1>" "<text2>"\`.`);
		if (content[4] !== '') return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}batman "<text 1>" "<text2>"\`.`);
		const m = await message.channel.send('Please wait...');

		axios({
			method: 'post',
			url: 'https://api.imgflip.com/caption_image',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				template_id: '438680',
				username: img_username,
				password: img_password,
				text0: content[1],
				text1: content[3],
			},
		}).then(async response => {
			console.log(response);
			const attachment = new Discord.MessageAttachment(await response.data.data.url, '438680.png');
			m.delete();
			message.channel.send(attachment);
		}).catch(err =>{
			message.channel.send('An error occurred. Please try again.');
			console.log(err);
		});

	},
};