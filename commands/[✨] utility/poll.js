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

const pollEmbed = require('discord.js-poll-embed');
const { bot_prefix } = require('../../config.json');
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'poll',
	category: '[✨] utility',
	description: 'Creates a poll',
	example: `${bot_prefix}poll "<title>" "<second>" "<thing1 thing2 thing3>"`,
	run: async (client, message, args) => {
		if (!args) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (!args[2]) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		const input = args.join(' ').split('"');

		console.log(input);

		if (input[0] !== '') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[2] !== ' ') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[4] !== ' ') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[6] !== '') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (isNaN(input[3])) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		const title = input[1];
		const timeOut = parseInt(input[3]);
		const option = input[5].split(' ');

		console.log(title);
		console.log(timeOut);
		console.log(option);

		if (!option) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		if (message.deletable) {
			message.delete();
		}

		pollEmbed(message, title, option, timeOut);

	},
};