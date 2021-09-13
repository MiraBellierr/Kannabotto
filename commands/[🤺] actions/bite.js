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
	name: 'bite',
	description: 'bite actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}bite <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const link = ['https://media1.tenor.com/images/432a41a6beb3c05953c769686e8c4ce9/tenor.gif?itemid=4704665', 'https://media1.tenor.com/images/1169d1ab96669e13062c1b23ce5b9b01/tenor.gif?itemid=9035033', 'https://media1.tenor.com/images/418a2765b0bf54eb57bab3fde5d83a05/tenor.gif?itemid=12151511', 'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585', 'https://media1.tenor.com/images/f308e2fe3f1b3a41754727f8629e5b56/tenor.gif?itemid=12390216', 'https://media1.tenor.com/images/6ab39603ef0dd6dbfc78ba20885b991f/tenor.gif?itemid=8220087', 'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753', 'https://media1.tenor.com/images/34a08d324868d33358e0a465040f210e/tenor.gif?itemid=11961581', 'https://media1.tenor.com/images/7cc64070f618bdf171b0e45a57cf1b12/tenor.gif?itemid=17054824', 'https://media1.tenor.com/images/2735c3a10b0b09871cd5d6bded794f0d/tenor.gif?itemid=14399284'];
		const random = link[Math.floor(Math.random() * link.length)];
		const person = await getMember(message, args.join(' '));

		if (!args[0]) {

			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}bite <mention | id | username>\`.`);
			return;
		}

		if (person.user.id === message.author.id) {

			message.reply(`*bites ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} bites ${person.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};