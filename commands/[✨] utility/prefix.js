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
		if (!prefixes[message.guild.id]) {
			prefixes[message.guild.id] = bot_prefix;
		}
		if (message.mentions.channels.size || message.mentions.everyone || message.mentions.roles.size || message.mentions.users.size) {
			prefixes[message.guild.id] = bot_prefix;

			return message.reply(`Prefix for this guild has been changed to **${prefixes[message.guild.id]}**!`);
		}
		if (!args[0]) return message.reply(`My prefix for this guild is **${prefixes[message.guild.id]}**. To change a prefix, do \`${prefixes[message.guild.id]}prefix <new prefix>\``);
		if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply(`**${message.author.username}**, Sorry you don't have manage server permission to use this command.`);

		prefixes[message.guild.id] = args[0];

		fs.writeFile('./database/prefix.json', JSON.stringify(prefixes, null, 2), (err) => {
			if (err) return message.reply(`An error occured: \`${err.name}\``);

			message.reply(`Prefix for this guild has been changed to **${prefixes[message.guild.id]}**!`);
		});
	},
};