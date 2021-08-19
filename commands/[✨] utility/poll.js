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

const pollEmbed = require('../../poll-embed/index');
const { bot_prefix } = require('../../config.json');
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'poll',
	category: '[✨] utility',
	description: 'Creates a poll',
	example: `${bot_prefix}poll <title> | <option1> | <option2> | [option3]`,
	run: async (client, message, args) => {
		if (!args) return message.reply(`The right syntax is \`${prefix[message.guild.id]}poll <title> | <option1> | <option2> | [option3]\`.`);
		if (!args[2]) return message.reply(`The right syntax is \`${prefix[message.guild.id]}poll <title> | <option1> | <option2> | [option3]\`.`);

		const title = args.join(' ').split('|').map(a => a.trim());
		const options = title.splice(1);

		if (!options) return message.reply(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		if (message.deletable) {
			message.delete();
		}

		pollEmbed(message, title, options);
	},
};