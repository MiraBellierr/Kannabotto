const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'blush',
	description: 'blush emotions command',
	category: '[🤺] actions',
	example: `${bot_prefix}blush`,
	run: (client, message) => {
		const action = [
			'https://media1.tenor.com/images/a8d262bea6aa70742b393b08f02c5710/tenor.gif?itemid=12830507', 'https://media1.tenor.com/images/b00fe041997afa8fff0734a1fb8dd2a4/tenor.gif?itemid=13768377', 'https://media1.tenor.com/images/5ea40ca0d6544dbf9c0074542810e149/tenor.gif?itemid=14841901', 'https://media1.tenor.com/images/274fc34d3add3ce4cbb5716cb4f94f4f/tenor.gif?itemid=5841198', 'https://media1.tenor.com/images/09d75740089598b54342df3641dbbffc/tenor.gif?itemid=5615361', 'https://media1.tenor.com/images/9eba52d0506b552b7ef6a1981c0cfcff/tenor.gif?itemid=8680309', 'https://media1.tenor.com/images/f62cae32b30d364bf0a8a1e7432c2ddf/tenor.gif?itemid=10198325', 'https://media.tenor.com/images/ec68d88a7a6605e17395fc67a132d83e/tenor.gif', 'https://media1.tenor.com/images/e8f3c6c5ddbd1637f536c4fe45479894/tenor.gif?itemid=12348314', 'https://media1.tenor.com/images/fdd56c120f59f899f8c34605165896a8/tenor.gif?itemid=12348305'];

		const actionR = action[Math.floor(Math.random() * action.length)];

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.username} is blushing!`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(actionR)
			.setColor('RANDOM');


		message.channel.send(embed);
	},
};