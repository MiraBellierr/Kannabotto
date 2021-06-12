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
	name: 'kiss',
	description: 'kiss emotions command',
	category: '[🤺] actions',
	example: `${bot_prefix}kiss <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const link = ['https://media1.tenor.com/images/f5167c56b1cca2814f9eca99c4f4fab8/tenor.gif?itemid=6155657', 'https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865', 'https://media1.tenor.com/images/ea9a07318bd8400fbfbd658e9f5ecd5d/tenor.gif?itemid=12612515', 'https://media1.tenor.com/images/02d9cae34993e48ab5bb27763d5ca2fa/tenor.gif?itemid=4874618', 'https://media1.tenor.com/images/4b5d5afd747fe053ed79317628aac106/tenor.gif?itemid=5649376', 'https://media1.tenor.com/images/1306732d3351afe642c9a7f6d46f548e/tenor.gif?itemid=6155670', 'https://media1.tenor.com/images/bc5e143ab33084961904240f431ca0b1/tenor.gif?itemid=9838409', 'https://media1.tenor.com/images/a390476cc2773898ae75090429fb1d3b/tenor.gif?itemid=12837192', 'https://media1.tenor.com/images/d307db89f181813e0d05937b5feb4254/tenor.gif?itemid=16371489', 'https://media1.tenor.com/images/ef4a0bcb6e42189dc12ee55e0d479c54/tenor.gif?itemid=12143127'];
		const random = link[Math.floor(Math.random() * link.length)];
		const person = await getMember(message, args.join(' '));

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}kiss <mention | id | username>\`.`);
			return;
		}

		if (person.user.id === message.author.id) {

			message.channel.send(`*kisses ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} kisses ${person.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};