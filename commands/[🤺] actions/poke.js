const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'poke',
	aliases: ['beep', 'boop'],
	description: 'Allows you to poke your friends!',
	category: '[🤺] actions',
	example: `${bot_prefix}poke <mention | id | username>`,
	usage: '<mention | id | username>',
	run: (client, message, args) => {
		const personPoke = getMember(message, args.join(' '));
		const pokes = ['https://media1.tenor.com/images/ab936c887562756472f83850426bf6ef/tenor.gif?itemid=11956062', 'https://media1.tenor.com/images/d2b08ce502740221b978d8e5e876b6e2/tenor.gif?itemid=12872012', 'https://media1.tenor.com/images/cbf38a2e97a348a621207c967a77628a/tenor.gif?itemid=6287077', 'https://media1.tenor.com/images/e8b25e7d069c203ea7f01989f2a0af59/tenor.gif?itemid=12011027', 'https://media1.tenor.com/images/1e0ea8b241a7db2b9c03775133138733/tenor.gif?itemid=10064326', 'https://media1.tenor.com/images/1a64ac660387543c5b779ba1d7da2c9e/tenor.gif?itemid=12396068', 'https://media1.tenor.com/images/a4f116c4f61361e25ad5a0eb9d9ef38c/tenor.gif?itemid=14835795', 'https://media1.tenor.com/images/4f886a9db21b5398f2ad91178887ed4d/tenor.gif?itemid=12583168', 'https://media1.tenor.com/images/0757a79f42bad6cbdb5fbda7fca1b039/tenor.gif?itemid=16295203', 'https://media1.tenor.com/images/90f68d48795c51222c60afc7239c930c/tenor.gif?itemid=8701034'];
		const pokesR = pokes[Math.floor(Math.random() * pokes.length)];

		if (!args[0]) {

			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}poke <mention | id | username>\`.`);
			return;
		}

		if (personPoke.user.id === message.author.id) {

			message.channel.send(`*pokes ${message.author.username}*`);
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} pokes ${personPoke.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(pokesR)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};