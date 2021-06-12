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
	name: 'pat',
	description: 'pat emotions command',
	category: '[🤺] actions',
	example: `${bot_prefix}pat <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const link = ['https://media1.tenor.com/images/da8f0e8dd1a7f7db5298bda9cc648a9a/tenor.gif?itemid=12018819', 'https://media1.tenor.com/images/d9b480bcd392d05426ae6150e986bbf0/tenor.gif?itemid=9332926', 'https://media1.tenor.com/images/116fe7ede5b7976920fac3bf8067d42b/tenor.gif?itemid=9200932', 'https://media1.tenor.com/images/c2232aec426d8b5e85e026cbca410463/tenor.gif?itemid=11648944', 'https://media1.tenor.com/images/6151c42c94df654b1c7de2fdebaa6bd1/tenor.gif?itemid=16456868', 'https://media1.tenor.com/images/755b519f860ef65a4b9f889aece000fe/tenor.gif?itemid=16085284', 'https://media1.tenor.com/images/daa885ec8a9cfa4107eb966df05ba260/tenor.gif?itemid=13792462', 'https://media1.tenor.com/images/54722063c802bac30d928db3bf3cc3b4/tenor.gif?itemid=8841561', 'https://media1.tenor.com/images/c234cdcb3af7bed21ccbba2293470b8c/tenor.gif?itemid=11648897', 'https://media1.tenor.com/images/fad9a512808d29f6776e7566f474321c/tenor.gif?itemid=16917926'];
		const random = link[Math.floor(Math.random() * link.length)];
		const person = await getMember(message, args.join(' '));
		const quote = ['Adorable~', 'There there.', 'Pat Pat'];
		const quoter = quote[Math.floor(Math.random() * quote.length)];

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}pat <mention | id | username>\`.`);
			return;
		}

		if (person.user.id === message.author.id) {

			message.channel.send(`*pats ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} pats ${person.user.username}! ${quoter}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};