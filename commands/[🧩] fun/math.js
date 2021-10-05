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

const { create, all } = require('mathjs');
const math = create(all);
const { Util } = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'math',
	category: '[🧩] fun',
	description: 'Math functions',
	example: `${bot_prefix}math <expressions>`,
	usage: '<expressions>',
	run: async (client, message, args) => {

		if (!args[0]) return message.reply(`**${message.author.username}**, Please enter an expressions!`);
		const limitedEvaluate = math.evaluate;
		math.import({
			createUnit: function() { throw new Error('Function createUnit is disabled'); },
			parse: function() { throw new Error('Function parse is disabled'); } },
		{ override: true });

		const argument = args.join(' ');

		if (argument.split('').includes(':')) {
			const split = argument.split(':');
			if (parseInt(split[0]) > 99 || parseInt(split[1]) > 99) return message.reply('Error: Ineffective mark-compacts near heap limit Allocation failed');
			if (split[2]) {
				if (parseInt(split[2]) > 99) return message.reply('Error: Ineffective mark-compacts near heap limit Allocation failed');
			}
		}

		try {
			const result = limitedEvaluate(argument);

			const description = Util.splitMessage(`${result}`, {
				maxLength: 1024,
				char: '',
			});

			return message.reply(`📝 ${argument} = **${description[0]}**`).catch(() => message.reply('Sorry, I couldn\'t calculate it for you'));

		}
		catch(e) {
			return message.reply(e.toString());
		}

	},
};