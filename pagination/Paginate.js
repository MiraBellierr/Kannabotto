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

const { SuperError } = require('../Error');
require('colors');

function Paginate(client, message, pages, options = {
	time: 1000 * 60 * 3,
	onEnd: 'delete',
}, emojis = {
	backward: '⏪',
	stop: '🛑',
	forward: '⏩',
}) {

	this.client = client;
	this.message = message;
	this.pages = pages;
	this.options = options;
	this.emojis = emojis;

	if (!this.message) throw new SuperError('Specify the message to be processed on.', 'DeficiencyError');
	if (!this.pages) throw new SuperError('Specify pages to be shown', 'DeficiencyError');
	if (!this.options.time) throw new SuperError('Specify a reaction time.', 'TimeError');
	if (
		!this.emojis.backward ||
        !this.emojis.stop ||
        !this.emojis.forward
	) throw new SuperError('Specify emojis to skip the page, return to previous page and stop the process.', 'EmojiError');

	this.addPage = function(page) {
		if (!page) throw new SuperError('Specify the page to be added', 'DeficiencyError');
		try {
			if (Array.isArray(page)) {
				this.pages = this.pages.concat(page);
			}
			else {
				this.pages.push(page);
			}
			return { pages: this.pages };
		}
		catch(err) {
			throw new SuperError(err, 'UnknownError');
		}
	};

	this.editEmoji = function(name, value) {
		if (!name) throw new SuperError('Specify the emoji name to be edited', 'DeficiencyError');
		if (!value) throw new SuperError('Specify an emoji.', 'DeficiencyError');
		switch (name) {
		case 'backward':
			this.emojis[name] = value;
			break;
		case 'stop':
			this.emojis[name] = value;
			break;
		case 'forward':
			this.emojis[name] = value;
			break;
		default:
			throw new SuperError('Specify a valid emoji name to be edited.', 'DeficiencyError');
		}
	};

	this.init = async function() {
		let page = 1;
		const msg = await this.message.channel.send(this.pages[page - 1]);

		await msg.react(this.emojis.backward).catch(() => {
			throw new SuperError('Specify a valid backward emoji', 'EmojiError');
		});
		await msg.react(this.emojis.stop).catch(() => {
			throw new SuperError('Specify a valid stop emoji', 'EmojiError');
		});
		await msg.react(this.emojis.forward).catch(() => {
			throw new SuperError('Specify a valid forward emoji', 'EmojiError');
		});

		const backwardFilter = (reaction, user) => reaction.emoji.name === this.emojis.backward && user.id === this.message.author.id;
		const stopFilter = (reaction, user) => reaction.emoji.name === this.emojis.stop && user.id === this.message.author.id;
		const forwardFilter = (reaction, user) => reaction.emoji.name === this.emojis.forward && user.id === this.message.author.id;

		const backward = msg.createReactionCollector((backwardFilter), {
			time: this.options.time,
		});

		const stop = msg.createReactionCollector((stopFilter), {
			time: this.options.time,
		});

		const forward = msg.createReactionCollector((forwardFilter), {
			time: this.options.time,
		});

		backward.on('collect', async () => {

			if (page === 1) return;
			page--;

			if (typeof this.pages[page - 1] == 'object') {
				await msg.edit({
					content: null,
					embed: this.pages[page - 1],
				});
			}
			else {
				await msg.edit({
					content: this.pages[page - 1],
					embed: null,
				});
			}
		});

		stop.on('collect', async () => {

			if (this.options.onEnd == 'removeAll') {
				await msg.delete();
			}
			else if (this.options.onEnd == 'delete') {
				await msg.delete();
			}

			backward.stop('ENDED');
			forward.stop('ENDED');
			stop.stop('ENDED');
		});

		forward.on('collect', async () => {

			if (page === this.pages.length) return;
			page++;

			if (typeof this.pages[page - 1] == 'object') {
				await msg.edit({
					content: null,
					embed: this.pages[page - 1],
				});
			}
			else {
				await msg.edit({
					content: this.pages[page - 1],
					embed: null,
				});
			}
		});

		backward.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new SuperError(reason, 'UnknownError');
		});

		stop.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new SuperError(reason, 'UnknownError');
		});

		forward.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new SuperError(reason, 'UnknownError');
		});

		return {
			backwardCollector: backward,
			stopCollector: stop,
			forwardCollector: forward,
		};
	};


}

module.exports = Paginate;