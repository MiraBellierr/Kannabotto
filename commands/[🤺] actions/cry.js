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
	name: 'cry',
	description: 'cry emotions command',
	category: '[🤺] actions',
	example: `${bot_prefix}cry`,
	run: (client, message) => {
		const cries = ['https://media1.tenor.com/images/4b5e9867209d7b1712607958e01a80f1/tenor.gif?itemid=5298257', 'https://media1.tenor.com/images/67df1dca3260e0032f40048759a967a5/tenor.gif?itemid=5415917', 'https://media1.tenor.com/images/09b085a6b0b33a9a9c8529a3d2ee1914/tenor.gif?itemid=5648908', 'https://media1.tenor.com/images/b88fa314f0f172832a5f41fce111f359/tenor.gif?itemid=13356071', 'https://media1.tenor.com/images/a53f4017a15753ff10e42770e89ce1d0/tenor.gif?itemid=4555995', 'https://media1.tenor.com/images/213ec50caaf02d27d358363016204d1d/tenor.gif?itemid=4553386', 'https://media1.tenor.com/images/cff668938903f9942991f54b031043b7/tenor.gif?itemid=4952247', 'https://media1.tenor.com/images/44d764c6ffe09bd165643aae33aa98f9/tenor.gif?itemid=7329079', 'https://media1.tenor.com/images/86402d3ef7b5980fb695a7a9a2189be0/tenor.gif?itemid=17180894', 'https://media1.tenor.com/images/116d0a5803986793951cf6a506ad0c22/tenor.gif?itemid=14147599'];
		const criesR = cries[Math.floor(Math.random() * cries.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} is crying!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(criesR)
			.setColor('#CD1C6C');

		message.reply({ embeds: [embed] });
	},
};