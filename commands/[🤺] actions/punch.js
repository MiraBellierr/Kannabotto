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
	name: 'punch',
	description: 'punch actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}punch <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const link = ['https://media1.tenor.com/images/31686440e805309d34e94219e4bedac1/tenor.gif?itemid=4790446', 'https://media1.tenor.com/images/4f3603010f0071227affbf2f732d79be/tenor.gif?itemid=10769541', 'https://media1.tenor.com/images/ee3f2a6939a68df9563a7374f131fd96/tenor.gif?itemid=14210784', 'https://media1.tenor.com/images/517f63ce5ffc6426bddd17d7413ebaca/tenor.gif?itemid=5247335', 'https://media1.tenor.com/images/2487a7679b3d7d23cadcd51381635467/tenor.gif?itemid=11451829', 'https://media1.tenor.com/images/b2db2a7fe0b9f68f2869b4e0d11a9490/tenor.gif?itemid=8932977', 'https://media1.tenor.com/images/0d0afe2df6c9ff3499a81bf0dab1d27c/tenor.gif?itemid=15580060', 'https://media1.tenor.com/images/965fabbfcdc09ee0eb4d697e25509f34/tenor.gif?itemid=7380310', 'https://media1.tenor.com/images/c621075def6ca41785ef4aaea20cc3a2/tenor.gif?itemid=7679409', 'https://media1.tenor.com/images/7d30b4368d3e7657c9a3de17ac9eb0fb/tenor.gif?itemid=17075114'];
		const random = link[Math.floor(Math.random() * link.length)];
		const person = await getMember(message, args.join(' '));

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}punch <mention | id | username>\`.`);
			return;
		}

		if (person.user.id === message.author.id) {

			message.reply(`*punches ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} punches ${person.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.reply({ embeds: [embed] });
	},
};