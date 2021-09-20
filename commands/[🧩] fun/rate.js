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
	name: 'rate',
	description: 'Rates whatever you input as argument based on her mood',
	example: `${bot_prefix}rate <thing to rate>`,
	usage: '<thing to rate>',
	category: '[🧩] fun',
	run: (client, message, args) => {
		const answers = [
			// Postive
			'💯', 'Yes', 'me likey', '👀', '😍😍', 'he\'s cool yea', 'she\'s cool yea', 'uhhhh yes', 'indeed', 'would bang', 'my favorite', 'pretty good', 'music to my ears',
			'dreamy', 'Cool', 'at least it\'s not bad', 'not the best but still good', 'AMAZING', 'dude, that\'s like, awesome', `${client.emojis.cache.get('872598470089912361')}`,
			`they're cute ${client.emojis.cache.get('889465826254659654')}`, 'underrated',

			// Negative
			'how about no', 'yeah no', 'needs much improvement', 'barely ok, in short it\'s shit', '💩 basically', 'just horrible', 'never ask me to rate that again', 'overrated',
			'nobody wants to see that', 'i disapprove', 'i\'m not allowed to say', 'that\'s goodn\'t', 'oh no', 'very uhh, how do i say this without sounding rude', 'might as well throw it away',
			'this makes me wanna 🤮', 'what!! Lol', `you better be joking ${client.emojis.cache.get('889465826032377897')}`,
		];

		const answer = answers[Math.floor(Math.random() * answers.length)];

		if (args[0]) {
			message.reply(`${answer}`);
		}
		else {
			message.reply('Give me something to rate').then(m => m.delete(1500));
		}
	},
};