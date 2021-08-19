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
			parse: function() { throw new Error('Function parse is disabled'); },
			simplify: function() { throw new Error('Function simplify is disabled'); },
			derivative: function() { throw new Error('Function derivative is disabled'); } },
		{ override: true });

		const argument = args.join(' ');
		try {
			const result = limitedEvaluate(argument);
			return message.reply(`📝 ${argument} = **${result}**`).catch(err => console.log(err));

		}
		catch(e) {
			return message.reply(e.toString());
		}

	},
};