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

module.exports = {
	name: 'facepalm',
	description: 'facepalm actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}facepalm`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/142d74bbd13fc305aed5a4894c0c3f7f/tenor.gif?itemid=16642818', 'https://media1.tenor.com/images/b8e234ac4aa6aa64b582895911de2046/tenor.gif?itemid=12411488', 'https://media1.tenor.com/images/76d2ec47ec76fa36b2fce913331ba7e3/tenor.gif?itemid=5533025', 'https://media1.tenor.com/images/43f438c58296dabd4bd71f282987f44c/tenor.gif?itemid=10157360', 'https://media1.tenor.com/images/4782ebc79f08be0a17faaf19ed5221f3/tenor.gif?itemid=15580787', 'https://media1.tenor.com/images/d8d29f0d56957f209f42105baa4e00f1/tenor.gif?itemid=17236628'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} facepalms!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};