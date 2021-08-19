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

const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const fs = require('fs');

module.exports = {
	name: 'prefix',
	description: 'To change a prefix for your server',
	category: '[✨] utility',
	example: `${bot_prefix}prefix <new prefix>`,
	usage: '<new prefix>',
	run: async (client, message, args) => {
		const regex = new RegExp('<@[0-9]{18}>');
		const regex2 = new RegExp('<@[0-9]{19}>');
		const regex3 = new RegExp('<@[0-9]{20}>');
		const regex4 = new RegExp('<#[0-9]{18}>');
		const regex5 = new RegExp('<#[0-9]{19}>');
		const regex6 = new RegExp('<#[0-9]{20}>');
		const regex7 = new RegExp('<@&[0-9]{18}>');
		const regex8 = new RegExp('<@&[0-9]{19}>');
		const regex9 = new RegExp('<@&[0-9]{20}>');

		if (!prefixes[message.guild.id]) {
			prefixes[message.guild.id] = bot_prefix;
		}

		if (!args[0]) return message.reply(`My prefix for this guild is **${prefixes[message.guild.id]}**. To change a prefix, do \`${prefixes[message.guild.id]}prefix <new prefix>\``);
		if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply(`**${message.author.username}**, You don't have \`MANAGE_SERVER\` permission to use this command.`);
		if (regex.test(args[0]) || regex2.test(args[0]) || regex3.test(args[0]) || regex4.test(args[0]) || regex5.test(args[0]) || regex6.test(args[0]) || regex7.test(args[0]) || regex8.test(args[0]) || regex9.test(args[0]) || args[0] === '@everyone' || args[0] === '@here' || args[0] === '@!everyone' || args[0] === '@!everyone') return message.reply('I am unable to change to that prefix.');

		prefixes[message.guild.id] = args[0];

		fs.writeFile('./database/prefix.json', JSON.stringify(prefixes, null, 2), (err) => {
			if (err) return message.reply(`An error occured: \`${err.name}\``);

			message.reply(`Prefix for this guild has been changed to **${prefixes[message.guild.id]}**!`);
		});
	},
};