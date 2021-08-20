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
const fs = require('fs');
const file = require('../../database/leave.json');
const { welcomeAndLeaveMessageCollector } = require('../../functions');
const command = {
	commandName: 'Leave',
	command: 'setleave',
};

module.exports = {
	name: 'setleave',
	aliases: ['sl'],
	category: '[✨] utility',
	description: 'Leave Message Configuration',
	example: `${bot_prefix}setleave <#channel | on | off>`,
	usage: '<#channel | on | off>',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('Sorry you don\'t have manage channels permission to use this command.');

		if (message.mentions.channels.first()) {
			await welcomeAndLeaveMessageCollector(client, message, command, file);
		}
		else if (args[0] === 'on') {
			if (!file[message.guild.id]) return message.reply('You haven\'t set up a leave message yet.');

			file[message.guild.id].switch = 'on';

			fs.writeFile('./database/leave.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.reply('An error occured!');

				message.reply('Leave message has been turned on');
			});
		}
		else if (args[0] === 'off') {
			if (!file[message.guild.id]) return message.reply('You haven\'t set up a leave message yet.');

			file[message.guild.id].switch = 'off';

			fs.writeFile('./database/leave.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.reply('An error occured!');

				message.reply('Leave message has been turned off');
			});
		}
		else {
			return message.reply(`The right syntax is \`${bot_prefix}setleave <#channel | on | off>\``);
		}
	},
};