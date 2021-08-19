require('colors');
const { MessageActionRow, MessageButton } = require('discord.js');

function Paginate(client, message, pages, options = {
	time: 1000 * 60 * 3,
}, emojis = {
	backward: '869052152331509781',
	stop: '869052152260214794',
	forward: '869052152012746783',
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
		const row = new MessageActionRow()
			.addComponents([
				new MessageButton()
					.setCustomId('backward')
					.setLabel('Back')
					.setStyle('PRIMARY')
					.setEmoji(this.emojis.backward),
				new MessageButton()
					.setCustomId('stop')
					.setLabel('Stop')
					.setStyle('DANGER')
					.setEmoji(this.emojis.stop),
				new MessageButton()
					.setCustomId('forward')
					.setLabel('Next')
					.setStyle('PRIMARY')
					.setEmoji(this.emojis.forward),
			]);

		let msg;

		if (typeof this.pages[page - 1] == 'object') {
			msg = await this.message.reply({ embeds: [this.pages[page - 1]], components: [row] });
		}
		else {
			msg = await this.message.reply({ content: `${[this.pages[page - 1]]}`, components: [row] });
		}

		const backwardFilter = (inter) => inter.customId === 'backward' && inter.user.id === this.message.author.id;
		const stopFilter = (inter) => inter.customId === 'stop' && inter.user.id === this.message.author.id;
		const forwardFilter = (inter) => inter.customId === 'forward' && inter.user.id === this.message.author.id;

		const backward = msg.createMessageComponentCollector({
			filter: backwardFilter,
			time: this.options.time,
			type: 'BUTTON',
		});

		const stop = msg.createMessageComponentCollector({
			filter: stopFilter,
			time: this.options.time,
			componentType: 'BUTTON',
		});

		const forward = msg.createMessageComponentCollector({
			filter: forwardFilter,
			time: this.options.time,
			componentType: 'BUTTON',
		});

		backward.on('collect', async (i) => {

			if (page === 1) return;
			page--;

			if (typeof this.pages[page - 1] == 'object') {
				await i.update({
					embeds: [this.pages[page - 1]],
					components: [row],
				});
			}
			else {
				await i.update({
					content: this.pages[page - 1],
					components: [row],
				});
			}
		});

		stop.on('collect', async () => {

			backward.stop('ENDED');
			forward.stop('ENDED');
			stop.stop('ENDED');

			await msg.delete();
		});

		forward.on('collect', async (i) => {

			if (page === this.pages.length) return;
			page++;

			if (typeof this.pages[page - 1] == 'object') {
				await i.update({
					embeds: [this.pages[page - 1]],
					components: [row],
				});
			}
			else {
				await i.update({
					content: this.pages[page - 1],
					components: [row],
				});
			}
		});

		backward.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new TypeError(reason);
		});

		stop.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new Error(reason);
		});

		forward.on('end', (collected, reason) => {
			if (reason != 'time' && reason != 'ENDED') throw new Error(reason);
		});

		return {
			backwardCollector: backward,
			stopCollector: stop,
			forwardCollector: forward,
		};
	};


}

module.exports = Paginate;