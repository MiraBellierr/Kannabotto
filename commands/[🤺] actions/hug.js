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

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'hug',
	description: 'Allows you to hug your friends!',
	category: '[🤺] actions',
	example: `${bot_prefix}hug <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const hugs = ['https://media1.tenor.com/images/e58eb2794ff1a12315665c28d5bc3f5e/tenor.gif?itemid=10195705', 'https://media1.tenor.com/images/969f0f462e4b7350da543f0231ba94cb/tenor.gif?itemid=14246498', 'https://media1.tenor.com/images/1069921ddcf38ff722125c8f65401c28/tenor.gif?itemid=11074788', 'https://media1.tenor.com/images/7db5f172665f5a64c1a5ebe0fd4cfec8/tenor.gif?itemid=9200935', 'https://media1.tenor.com/images/daffa3b7992a08767168614178cce7d6/tenor.gif?itemid=15249774', 'https://media1.tenor.com/images/bb9c0c56769afa3b58b9efe5c7bcaafb/tenor.gif?itemid=16831471', 'https://media1.tenor.com/images/3ce31b15c2326831a8de9f0b693763ff/tenor.gif?itemid=16787485', 'https://media1.tenor.com/images/c9e2e21f4eedd767a72004e4ab521c9d/tenor.gif?itemid=13576064', 'https://media1.tenor.com/images/1a73e11ad8afd9b13c7f9f9bb5c9a834/tenor.gif?itemid=13366388', 'https://media1.tenor.com/images/7ca5f791d767630c8317025951eb1a7f/tenor.gif?itemid=16852734'];
		const hugR = hugs[Math.floor(Math.random() * hugs.length)];
		const personhug = await getMember(message, args.join(' '));
		const quote = ['Adorable!', 'Cute!'];
		const quoter = quote[Math.floor(Math.random() * quote.length)];

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}hug <mention | id | username>\`.`);
			return;
		}

		if (personhug.user.id === message.author.id) {

			const embed = new Discord.MessageEmbed()
				.setAuthor(`${client.user.username} hugs ${personhug.user.username}! ${quoter}!`, message.author.displayAvatarURL({ dynamic: true }))
				.setImage(hugR)
				.setColor('#CD1C6C');

			message.reply({ embeds: [embed] });
			return;
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} hugs ${personhug.user.username}! ${quoter}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(hugR)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};