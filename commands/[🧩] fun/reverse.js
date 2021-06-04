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
	name: 'reverse',
	description: 'Reverse a text',
	example: `${bot_prefix}reverse <text>`,
	usage: '<text>',
	category: '[🧩] fun',
	run: (client, message, args) => {
		if (args.length < 1) {
			message.reply('You must input text to be reversed!');
			return;
		}
		message.channel.send(args.join(' ').split('').reverse().join(''), { disableMentions: 'all' });


	},
};