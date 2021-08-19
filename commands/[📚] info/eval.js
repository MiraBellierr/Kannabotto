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
// eslint-disable-next-line no-unused-vars
const characters = require('../../database/characters.json');

module.exports = {
	name: 'eval',
	aliases: ['e'],
	description: 'Evaluates the code you put in',
	example: `${bot_prefix}eval <code to eval>`,
	usage: '<code to eval>',
	run: async (client, message, args) => {
		const clientApplication = await client.application.fetch(client.user.id);
		const owner = clientApplication.owner.id;

		if (message.author.id !== owner) {
			return message.reply('You\'re not the owner of me!!')
				.then(m => m.delete(5000));
		}

		if (!args[0]) {
			message.reply('You need to evaluate _**SOMETHING**_, please?')
				.then(m => m.delete(5000));
		}

		const clean = text => {
			if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
			else {return text;}
		};

		try {
			const code = args.join(' ');
			let evaled = await eval(code);

			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}

			message.reply(clean(evaled), { split: true, code:'xl' });
		}
		catch (err) {
			message.reply(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
};