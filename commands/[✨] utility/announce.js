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
const { announceMessageCollector } = require('../../functions');

module.exports = {
	name: 'announce',
	category: '[✨] utility',
	example: `${bot_prefix}announce <channel>`,
	description: 'Sends an announcement to the channel',
	usage: '<channel>',
	run: async (client, message, args) => {
		if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply({ content: 'Sorry you don\'t have manage channels permission to use this command.', allowedMentions: { repliedUser: true } });
		if (!args[0]) return message.reply({ content: `The right syntax is \`${prefixes[message.guild.id]}announce <channel>\`.`, allowedMentions: { repliedUser: true } });

		try {
			await announceMessageCollector(client, message);
		}
		catch (e) {
			console.log(e);
			message.reply(`Error: ${e.message}`);
		}
	},
};