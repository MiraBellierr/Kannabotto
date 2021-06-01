const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'slap',
	description: 'Allows you to slap your friends to show your disdain for them!',
	category: '[🤺] actions',
	example: `${bot_prefix}slap <mention | id | username>`,
	usage: '<mention | id | username>',
	run: (client, message, args) => {
		const slaps = ['https://media1.tenor.com/images/9ea4fb41d066737c0e3f2d626c13f230/tenor.gif?itemid=7355956', 'https://media1.tenor.com/images/477821d58203a6786abea01d8cf1030e/tenor.gif?itemid=7958720', 'https://media1.tenor.com/images/153b2f1bfd3c595c920ce60f1553c5f7/tenor.gif?itemid=10936993', 'https://media1.tenor.com/images/1ba1ea1786f0b03912b1c9138dac707c/tenor.gif?itemid=5738394', 'https://media1.tenor.com/images/4fa82be21ffd18c99a9708ba209d56ad/tenor.gif?itemid=5318916', 'https://media1.tenor.com/images/c25d3286056d127b1eeeb1ff657b0580/tenor.gif?itemid=17314633', 'https://media1.tenor.com/images/299366efafc95bc46bfd2f9c9a46541a/tenor.gif?itemid=16819981', 'https://media1.tenor.com/images/d21e86018af6d2db1a718a717c827b77/tenor.gif?itemid=17423280', 'https://media1.tenor.com/images/539979b4850ea21702d0f865398c62a6/tenor.gif?itemid=15631717', 'https://media1.tenor.com/images/5ab22ca640af20cd3b479694bde9e25c/tenor.gif?itemid=4961067'];
		const slapR = slaps[Math.floor(Math.random() * slaps.length)];
		const personslap = getMember(message, args.join(' '));
		const quote = ['Oof', 'Ouch', 'That hurt', 'Wow', 'LOL', 'Yeet'];
		const quoter = quote[Math.floor(Math.random() * quote.length)];

		if (!args[0]) {


			message.reply(`Use this command to your friend! The syntax is \`${prefixes[message.guild.id]}slap <mention | id | username>\`.`);
			return;
		}

		if (personslap.user.id === message.author.id) {

			message.channel.send(`*slaps ${message.author.username}*`);
			return;
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} slaps ${personslap.user.username}! ${quoter}!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(slapR)
			.setColor('RANDOM');

		message.channel.send(embed);
	},
};