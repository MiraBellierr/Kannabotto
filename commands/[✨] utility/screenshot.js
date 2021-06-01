const captureWebsite = import('capture-website');
const { bot_prefix } = require('../../config.json');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'screenshot',
	aliases: ['ss'],
	category: '[✨] utility',
	description: 'screenshots a website',
	example: `${bot_prefix}screenshot <website>`,
	usage: '<website>',
	run: async (client, message, args) => {
		if (!args.length) return message.channel.send(`The right syntax is \`${bot_prefix}screenshot <website>\`.`);
		const m = await message.channel.send('*Taking a screenshot...*');


		const screenshot = await captureWebsite.buffer(args.join(' ')).catch((err) => {
			m.delete();
			console.log(err);
		});

		const attachment = new MessageAttachment(await screenshot, 'screenshot.png');
		m.delete();
		message.channel.send(attachment);
	},
};