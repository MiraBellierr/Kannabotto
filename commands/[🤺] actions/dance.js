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
	name: 'dance',
	description: 'dance actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}dance`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/1a13c111736f868f9abab76e8ac9009d/tenor.gif?itemid=13462237', 'https://media1.tenor.com/images/47d5d52b84ca2117c336ab3de3978b3a/tenor.gif?itemid=13973731', 'https://media1.tenor.com/images/ed527e2e52c51a4138d91c8824530d3e/tenor.gif?itemid=12817361', 'https://media1.tenor.com/images/766599022416cc0b7b7b1bd2040eb2db/tenor.gif?itemid=12039886', 'https://media1.tenor.com/images/d250c06c34f6961087a83c6fd79d0711/tenor.gif?itemid=4718235', 'https://media1.tenor.com/images/aa9374ef547c871d4626a22d24042d1f/tenor.gif?itemid=10495378', 'https://media1.tenor.com/images/68514372455203bb299461159aa28056/tenor.gif?itemid=12503868', 'https://media1.tenor.com/images/f9a825b7d614cedda3fb2676a4ca0b68/tenor.gif?itemid=16127538', 'https://media1.tenor.com/images/a46ad100db83c0abb116d3855301c940/tenor.gif?itemid=4665031', 'https://media1.tenor.com/images/819d5bf445892350c842b9c5d700efdf/tenor.gif?itemid=16365990'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} is dancing!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};