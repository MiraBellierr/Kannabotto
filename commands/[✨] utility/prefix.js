const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const fs = require('fs');

module.exports = {
	name: 'prefix',
	description: 'To change a prefix for your server',
	category: '[✨] utility',
	example: `${bot_prefix}prefix <new prefix>`,
	usage: '<new prefix>',
	run: async (client, message, args) => {
		const regex = new RegExp('<@[0-9]{18}>');
		const regex2 = new RegExp('<@[0-9]{19}>');
		const regex3 = new RegExp('<@[0-9]{20}>');
		const regex4 = new RegExp('<#[0-9]{18}>');
		const regex5 = new RegExp('<#[0-9]{19}>');
		const regex6 = new RegExp('<#[0-9]{20}>');
		const regex7 = new RegExp('<@&[0-9]{18}>');
		const regex8 = new RegExp('<@&[0-9]{19}>');
		const regex9 = new RegExp('<@&[0-9]{20}>');
		if (!prefixes[message.guild.id]) {
			prefixes[message.guild.id] = bot_prefix;
		}
		if (!args[0]) return message.channel.send(`My prefix for this guild is **${prefixes[message.guild.id]}**. To change a prefix, do \`${prefixes[message.guild.id]}prefix <new prefix>\``);
		if (!message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true })) return message.channel.send(`**${message.author.username}**, You don't have \`MANAGE_SERVER\` permission to use this command.`);
		if (regex.test(args[0]) || regex2.test(args[0]) || regex3.test(args[0]) || regex4.test(args[0]) || regex5.test(args[0]) || regex6.test(args[0]) || regex7.test(args[0]) || regex8.test(args[0]) || regex9.test(args[0]) || args[0] === '@everyone' || args[0] === '@here' || args[0] === '@!everyone' || args[0] === '@!everyone') return message.channel.send('I am unable to change to that prefix.');

		prefixes[message.guild.id] = args[0];
		fs.writeFile('./database/prefix.json', JSON.stringify(prefixes, null, 2), (err) => {
			if (err) return message.channel.send(`An error occured: \`${err}\``);
			message.channel.send(`Prefix for this guild has been changed to **${prefixes[message.guild.id]}**!`);
		});
	},
};