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
	name: 'shoot',
	description: 'Allows you to shoot your friends to show your disdain for them!',
	category: '[🤺] actions',
	example: `${bot_prefix}shoot <mention | id | username>`,
	usage: '<mention | id | username>',
	run: async (client, message, args) => {
		const slaps = ['https://media1.tenor.com/images/b60f30e85ec81e76b55472898cb2beaa/tenor.gif?itemid=16780763', 'https://media1.tenor.com/images/a72e086ddfa54dffcd6953488531a23a/tenor.gif?itemid=17216777', 'https://media1.tenor.com/images/ca77c398c7148b60808332ca794ea7e0/tenor.gif?itemid=13757300', 'https://media1.tenor.com/images/20f6fd5a7e221a8d916a6bc51431a632/tenor.gif?itemid=16329826', 'https://media1.tenor.com/images/132256ad8a3b4c067bd42ae52d16eb21/tenor.gif?itemid=16522851', 'https://media1.tenor.com/images/90a13dba11d0c4acf5761ccc82e976a2/tenor.gif?itemid=16663051', 'https://media1.tenor.com/images/87728ec556a81626afac6cd6c19f0cb5/tenor.gif?itemid=17001405', 'https://media1.tenor.com/images/810b049b35bf8724aada2078b9d09823/tenor.gif?itemid=12108171', 'https://media1.tenor.com/images/1cbefa7c1245d452658056823b149ed3/tenor.gif?itemid=13871976', 'https://media1.tenor.com/images/cfb7817a23645120d4baba2dcb9205e0/tenor.gif?itemid=5710495'];
		const slapR = slaps[Math.floor(Math.random() * slaps.length)];
		const personslap = await getMember(message, args.join(' '));

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}shoot <mention | id | username>\`.`);
			return;
		}

		if (personslap.user.id === message.author.id) {

			message.reply(`*shoots ${message.author.username}*`);
			return;
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} shoots ${personslap.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(slapR)
			.setColor('RANDOM');

		message.reply({ embeds: [embed] });
	},
};