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

require('colors');

function Paginate(client, message, pages, options = {
	time: 1000 * 60 * 3,
	onEnd: 'delete',
}, emojis = {
	backward: '852144316230926336',
	stop: '852144903289831485',
	forward: '852144304327229460',
}) {

	this.client = client;
	this.message = message;
	this.pages = pages;
	this.options = options;
	this.emojis = emojis;

	if (!this.message) throw new TypeError('Specify the message to be processed on.');
	if (!this.pages) throw new TypeError('Specify pages to be shown');
	if (!this.options.time) throw new TypeError('Specify a reaction time.');
	if (
		!this.emojis.backward ||
        !this.emojis.stop ||
        !this.emojis.forward
	) throw new TypeError('Specify emojis to skip the page, return to previous page and stop the process.');

	this.addPage = function(page) {
		if (!page) throw new TypeError('Specify the page to be added');
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
			throw new TypeError(err);
		}
	};

	this.editEmoji = function(name, value) {
		if (!name) throw new TypeError('Specify the emoji name to be edited');
		if (!value) throw new TypeError('Specify an emoji.');
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
			throw new TypeError('Specify a valid emoji name to be edited.');
		}
	};

	this.init = async function() {
		let page = 1;
		const msg = await this.message.channel.send(this.pages[page - 1]);


		await msg.react(this.emojis.backward).catch(() => {
			throw new TypeError('Specify a valid backward emoji');
		});

		setTimeout(async () => {
			await msg.react(this.emojis.stop).catch(() => {
				throw new TypeError('Specify a valid stop emoji');
			});
		}, 740);

		setTimeout(async () => {
			await msg.react(this.emojis.forward).catch(() => {
				throw new TypeError('Specify a valid forward emoji');
			});
		}, 740 * 2);

		const backwardFilter = (reaction, user) => reaction.emoji.id === this.emojis.backward && user.id === this.message.author.id;
		const stopFilter = (reaction, user) => reaction.emoji.id === this.emojis.stop && user.id === this.message.author.id;
		const forwardFilter = (reaction, user) => reaction.emoji.id === this.emojis.forward && user.id === this.message.author.id;

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
				await msg.reactions.removeAll();
			}
			else if (this.options.onEnd == 'delete') {
				backward.stop('ENDED');
				forward.stop('ENDED');
				stop.stop('ENDED');
				await msg.delete();
				return;
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
			if (reason != 'time' && reason != 'ENDED') throw new TypeError(reason);
		});

		stop.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new TypeError(reason);
		});

		forward.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new TypeError(reason);
		});

		return {
			backwardCollector: backward,
			stopCollector: stop,
			forwardCollector: forward,
		};
	};


}

module.exports = Paginate;