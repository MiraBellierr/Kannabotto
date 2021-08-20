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

module.exports = {
	name: 'purge',
	aliases: ['clear', 'nuke'],
	category: '[🛠] moderation',
	description: 'Clears the chat',
	example: `${bot_prefix}purge <number of messages>`,
	usage: '<number of messages>',
	run: async (client, message, args) => {
		if (message.deletable) {
			await message.delete();
		}

		// Member doesn't have permissions
		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			return message.reply('Sorry you don\'t have manage messages permission to use this command.');
		}

		// Check if args[0] is a number
		if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
			return message.reply('Yeah.... That\'s not a number? I also can\'t delete 0 messages btw.');
		}

		// Maybe the bot can't delete messages
		if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
			return message.reply('Sorry... I can\'t delete messages. Make sure to check my `MANAGE_MESSAGES` permission');
		}

		let deleteAmount;

		if (parseInt(args[0]) > 100) {
			deleteAmount = 100;
		}
		else {
			deleteAmount = parseInt(args[0]);
		}

		message.channel.bulkDelete(deleteAmount, true)
			.then(async deleted => {
				const m = await message.reply(`I deleted \`${deleted.size}\` messages.`);
				setTimeout(function() {
					m.delete();
				}, 1000);
			}).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));
	},
};