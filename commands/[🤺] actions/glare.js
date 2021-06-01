const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'glare',
	description: 'glare actions command',
	category: '[🤺] actions',
	example: `${bot_prefix}glare`,
	run: (client, message) => {
		const link = ['https://media1.tenor.com/images/4908729f7fb720d3b1e3655348cb3345/tenor.gif?itemid=15060978', 'https://media1.tenor.com/images/0c9f9723bb85f6c22e4cbaee6d87c68e/tenor.gif?itemid=16563939', 'https://media1.tenor.com/images/6884c2aee4a1036465f8984aa52c9664/tenor.gif?itemid=5254221', 'https://media1.tenor.com/images/f1f0d9bb36380b8c6e37213949b69a80/tenor.gif?itemid=14210689', 'https://media1.tenor.com/images/97cd5f9ca2ac274356f4609d1aac1b40/tenor.gif?itemid=5630500', 'https://media1.tenor.com/images/856ceaea3e84561af61e0ee20c914b65/tenor.gif?itemid=10528179', 'https://media1.tenor.com/images/e435cc7096ce7952a9b14cb09f9e002f/tenor.gif?itemid=16999116', 'https://media1.tenor.com/images/a3e24882454d9c487070a7326b17d795/tenor.gif?itemid=17305035', 'https://media1.tenor.com/images/dd985add00726f0ea1e257ce8cc8b31e/tenor.gif?itemid=15954423', 'https://media1.tenor.com/images/de8ad38e7e02798761b3285f0935c6b0/tenor.gif?itemid=14560628'];
		const random = link[Math.floor(Math.random() * link.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} glares!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(random)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};