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

const prefixes = require('../../database/prefix.json');
const { bot_prefix } = require('../../config.json');
const redirect = require('../../database/redirect.json');
const fs = require('fs');

module.exports = {
	name: 'redirect',
	category: '[👹] rpg',
	description: 'redirect the spawner to the specific channel',
	example: `${bot_prefix}redirect <#channel>`,
	usage: '<#channel>',
	run: async (client, message, args) => {
		if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, checkOwner: true })) return message.channel.send(`**${message.author.username}**, You don't have \`MANAGE_CHANNELS\` permission to use this command.`);

		if (!redirect[message.guild.id]) {
			redirect[message.guild.id] = {
				channel: 'none',
			};
		}
		if (args.length > 0) {
			if (args[0].toLowerCase() === 'off') {
				redirect[message.guild.id].channel = 'none';
				fs.writeFile('./database/redirect.json', JSON.stringify(redirect, null, 2), (err) => {
					if (err) return message.channel.send(`An error occured:\`${err}\``);
					message.channel.send('The redirect channel has been turned off');
				});
				return;
			}
		}
		if (!message.mentions.channels.first()) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}redirect <#channel>\`. To turn off the redirect channel, do \`${prefixes[message.guild.id]}redirect off`);
		redirect[message.guild.id].channel = message.mentions.channels.first().id;
		fs.writeFile('./database/redirect.json', JSON.stringify(redirect, null, 2), (err) => {
			if (err) return message.channel.send(`An error occured:\`${err}\``);
			message.channel.send(`The boss spawner has been redirected to ${message.mentions.channels.first()}`);
		});
	},
};