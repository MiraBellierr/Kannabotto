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
const file = require('../../database/welcome.json');
const { welcomeAndLeaveMessageCollector } = require('../../functions');
const command = {
	commandName: 'Welcome',
	command: 'setwelcome',
};

module.exports = {
	name: 'setwelcome',
	aliases: ['sw'],
	category: '[✨] utility',
	description: 'Welcome Message Configuration',
	example: `${bot_prefix}setwelcome <#channel | on | off>`,
	usage: '<#channel | on | off>',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('You don\'t have `MANAGE_CHANNELS` permission to run this command.');

		if (message.mentions.channels.first()) {
			await welcomeAndLeaveMessageCollector(client, message, command, file);
		}
		else if (args[0] === 'on') {
			if (!file[message.guild.id]) return message.reply('You haven\'t set up a welcome message yet.');

			file[message.guild.id].switch = 'on';

			fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.reply('An error occured!');

				message.reply('Welcome message has been turned on');
			});
		}
		else if (args[0] === 'off') {
			if (!file[message.guild.id]) return message.reply('You haven\'t set up a welcome message yet.');

			file[message.guild.id].switch = 'off';

			fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.reply('An error occured!');

				message.reply('Welcome message has been turned off');
			});
		}
		else {
			return message.reply(`The right syntax is \`${bot_prefix}setwelcome <#channel | on | off>\``);
		}
	},
};