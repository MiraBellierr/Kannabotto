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
	name: '8ball',
	description: 'Send a random answer',
	category: '[🧩] fun',
	example: `${bot_prefix}8ball <question>`,
	usage: '<question>',
	run: (client, message, args) => {

		const responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Sign point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it', 'my reply is no.', 'My source say no.', 'Outlook not so good.', 'Very doubtful.'];

		const randomIndex = Math.floor(Math.random() * responses.length);


		if (!args.length) {
			message.reply('Gimme a question!');
		}
		else {
			message.channel.send(responses[randomIndex]);
		}

	},
};