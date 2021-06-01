const pollEmbed = require('discord.js-poll-embed');
const { bot_prefix } = require('../../config.json');
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'poll',
	category: '[✨] utility',
	description: 'Creates a poll',
	example: `${bot_prefix}poll "<title>" "<second>" "<thing1 thing2 thing3>"`,
	run: async (client, message, args) => {
		if (!args) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (!args[2]) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		const input = args.join(' ').split('"');

		console.log(input);

		if (input[0] !== '') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[2] !== ' ') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[4] !== ' ') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (input[6] !== '') return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);
		if (isNaN(input[3])) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		const title = input[1];
		const timeOut = parseInt(input[3]);
		const option = input[5].split(' ');

		console.log(title);
		console.log(timeOut);
		console.log(option);

		if (!option) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}poll "<title>" "<second>" "<thing1 thing2 thing3>"\`.`);

		if (message.deletable) {
			message.delete();
		}

		pollEmbed(message, title, option, timeOut);

	},
};