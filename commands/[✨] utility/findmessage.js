const Discord = require('discord.js');
const prefix = require('../../database/prefix.json');
const { formatDate } = require('../../functions');
const { PaginateContent } = require('../../Pagination');
const { isUndefined } = require('util');

module.exports = {
	name: 'findmessage',
	aliases: ['findmsg'],
	category: '[✨] utility',
	description: 'Find old messages containing words or phrases in the channel',
	example: `${prefix}findmessage <words or phrases>`,
	usage: '<words or phrases>',
	run: async (client, message, args) => {
		const words = args.join(' ').toLowerCase();
		if (!args.length) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}findmessage <words or phrases>\`.`);
		const fetchMessages = await message.channel.messages.fetch();
		const fetchedMessages = await fetchMessages.map(m => {
			if (m.content.toLowerCase().includes(words) && !isUndefined(m.content.toLowerCase())) {
				return `**Author:** ${m.member.displayName}\n**Message Sent:** ${formatDate(m.createdAt)}\n**Message:** ${m.content.replace(words, `__${words}__`)}`;
			}
		}).slice(1, 11);

		const filterContent = [];
		for (let i = 0; i < fetchedMessages.length; i++) {
			if (!isUndefined(fetchedMessages[i])) {
				filterContent.push(fetchedMessages[i]);
			}
		}

		const paginatePages = [];
		for (let i = 0; i < filterContent.length; i++) {
			paginatePages.push(new Discord.MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true })).setTitle('This is what I found in this channel').setDescription(filterContent[i]).setFooter(`Page ${i + 1}/${filterContent.length}`).setColor('RANDOM'));
		}
		const paginated = new PaginateContent.DiscordJS(client, message, paginatePages);
		await paginated.init().catch(() => message.channel.send(`I didn't found anything with ${words} in this channel.`));
	},
};