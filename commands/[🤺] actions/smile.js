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
	name: 'smile',
	description: 'smile actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}smile`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/c5fad21f9828d19044a58f8b84a6e14b/tenor.gif?itemid=6013419', 'https://media1.tenor.com/images/4e0a400d7621b5452854bcae00d9a98e/tenor.gif?itemid=5723668', 'https://media1.tenor.com/images/ba7c28c45c0123e95fbdf0854cbc7861/tenor.gif?itemid=12869746', 'https://media1.tenor.com/images/7676a956e0dda07ec7f55d3eacbf353b/tenor.gif?itemid=16072068', 'https://media1.tenor.com/images/d627d2facd06abb496f97c5943b2f9ae/tenor.gif?itemid=11346577', 'https://media1.tenor.com/images/55dde6c4f1eaca6b1e52626b980c0074/tenor.gif?itemid=13576447', 'https://media1.tenor.com/images/9411ce1ef75d43771bf0f305e7eb6487/tenor.gif?itemid=12793368', 'https://media1.tenor.com/images/82b39c323ca376e9bb5844a54973fc42/tenor.gif?itemid=16596386', 'https://media1.tenor.com/images/94cd0ea149daf82c6e6af8c444c40eb4/tenor.gif?itemid=8933103', 'https://media1.tenor.com/images/8a549e6d7066bbc0aeb63d7c69a42c27/tenor.gif?itemid=4838963'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} smiles!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};