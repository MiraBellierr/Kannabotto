const gis = require('g-i-s');
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { PaginateContent } = require('../../Pagination');
function capitalize(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'image',
	aliases: ['img'],
	category: '[✨] utility',
	description: 'Search images',
	example: `${bot_prefix}image <image to search>`,
	run: async (client, message, args) => {
		if (!message.channel.nsfw) return message.channel.send(`**${message.author.username}**, This command only can be used in nsfw channel.`);
		if (!args.length) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}image <image to search>\`.`);
		const m = await message.channel.send('*Loading...*');
		const search = args.join(' ');
		const opts = {
			searchTerm: search,
			queryStringAddition: '&tbs=ic',
			filterOutDomains: [
				'lookaside.fbsbx.com',
			],
		};

		gis(opts, async (err, res) => {
			if (err) return message.channel.send('I couldn\'t find it.. Sorry :c');
			const title = capitalize(search);
			const pages = [];
			for (let i = 0; i < res.length; i++) {
				const values = new Discord.MessageEmbed()
					.setTitle(title)
					.setColor('RANDOM')
					.setImage(res[i].url)
					.setFooter(`Page ${i + 1}/${res.length}`);

				pages.push(values);
			}
			const paginated = new PaginateContent.DiscordJS(client, message, pages);
			m.delete();
			await paginated.init();
		});
	},
};