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
	name: 'cuddle',
	description: 'cuddle emotions command',
	category: '[🤺] actions',
	example: `${bot_prefix}cuddle <mention| id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const cuddles = ['https://media1.tenor.com/images/8f8ba3baeecdf28f3e0fa7d4ce1a8586/tenor.gif?itemid=12668750', 'https://media1.tenor.com/images/3b205574d0352d4d61687f835276566d/tenor.gif?itemid=12669039', 'https://media1.tenor.com/images/d16a9affe8915e6413b0c1f1d380b2ee/tenor.gif?itemid=12669052', 'https://media1.tenor.com/images/7edded2757934756fdc240019d956cb3/tenor.gif?itemid=16403937', 'https://media1.tenor.com/images/50e1eb3f727a2cf0598eaaf3c1fc46f3/tenor.gif?itemid=12668887', 'https://media1.tenor.com/images/3d62384321435408f50823ae6f5ca033/tenor.gif?itemid=12270770', 'https://media1.tenor.com/images/4179058caa9eef3e7c6b21b8888b9cc9/tenor.gif?itemid=12955956', 'https://media1.tenor.com/images/13be52a4a4a26b0c9e479df6644d6de5/tenor.gif?itemid=12668752', 'https://media1.tenor.com/images/ec938c17b78033bf368cacea844d03af/tenor.gif?itemid=7250422', 'https://media1.tenor.com/images/96d28f5ef7ab317d8cdf6dbafcc6877b/tenor.gif?itemid=16539432'];
		const cuddleR = cuddles[Math.floor(Math.random() * cuddles.length)];
		const personcuddle = await getMember(message, args.join(' '));
		const quote = ['Adorable!', 'Cute!'];
		const quoter = quote[Math.floor(Math.random() * quote.length)];

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}cuddle <mention | id | username>\`.`);
			return;
		}

		if (personcuddle.id === message.author.id) {

			message.reply(`*cuddles ${message.author.username}*`);
			return;
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} cuddles ${personcuddle.username}! ${quoter}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(cuddleR)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};