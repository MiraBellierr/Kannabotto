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
	name: 'clap',
	description: 'clap actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}clap`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/bdddaedb6520858f32b155e326c5c832/tenor.gif?itemid=15245324', 'https://media1.tenor.com/images/ceef2812fb117532d74c95e0a224343a/tenor.gif?itemid=6502636', 'https://media1.tenor.com/images/7460a26a07ef24d696eaac0b0ff4d5bf/tenor.gif?itemid=16461487', 'https://media1.tenor.com/images/7ea5fbd96e5a87781f3ab54fe0f96a11/tenor.gif?itemid=15209555', 'https://media1.tenor.com/images/ef480a3671e758be51f02b06f040f15c/tenor.gif?itemid=14047162', 'https://media1.tenor.com/images/512c44c5935f4d77ac31b97624c4cb32/tenor.gif?itemid=17102646', 'https://media1.tenor.com/images/c0c809f93b4189e86223fe74c7918299/tenor.gif?itemid=15114479', 'https://media1.tenor.com/images/01d2a1f0fa8776f615f1d28db210a4da/tenor.gif?itemid=10260188', 'https://media1.tenor.com/images/70d0f70c733778ff202ece767722d28b/tenor.gif?itemid=7198772', 'https://media1.tenor.com/images/a2808bf5ab74e10f8d1a99c7972c15cc/tenor.gif?itemid=16026805'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} is clapping!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.reply({ embeds: [embed] });
	},
};