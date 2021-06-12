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
	name: 'kill',
	aliases: ['wasted', 'die'],
	description: 'wasted actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}kill <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const link = ['https://media1.tenor.com/images/d3f0893d296d19b1fb6201a30619206c/tenor.gif?itemid=7256224', 'https://media1.tenor.com/images/ff2dcd44504000e320c21ae5682b5369/tenor.gif?itemid=5749160', 'https://media1.tenor.com/images/3918ab9203b15b16cfc872f5540bfedc/tenor.gif?itemid=5958526'];
		const random = link[Math.floor(Math.random() * link.length)];
		const person = await getMember(message, args.join(' '));

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}kill <mention | id | username>\`.`);
			return;
		}

		if (person.user.id === message.author.id) {

			message.channel.send(`*kills ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} kills ${person.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};