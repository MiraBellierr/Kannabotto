/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'roll',
	description: 'Rolls a specified number of dice with a specified number of sides.',
	example: `${bot_prefix}roll <number of dice> <sides per dice>`,
	usage: '<number of dice> <sides per dice>',
	category: '[🧩] fun',
	run: (client, message, args) => {

		const dice = args[0];
		const sides = args[1];

		if ((isNaN(dice)) || (isNaN(sides))) return message.reply(`\nPlease roll in an accepted format\n\`${prefixes[message.guild.id]}roll <# of dice> <# of sides per die>\``);
		if (dice > 15 || sides > 120) return message.reply('Please provide a valid amount of dice and sides. (no more than 15 die and/or 120 sides)');
		if (dice <= 0 || sides <= 0) return message.reply('Can\'t roll non-existent die with/or non-existent sides');

		function roll(dice, sides) {
			const results = [];

			for (i = 0; i < dice; i++) {
				results.push(Math.floor((Math.random() * sides) + 1));
			}
			console.log(dice + ' dice and sides ' + sides);
			resDel = results.join(', ');
			newResult = resDel.toString();
			newResults = newResult.replace(/,(?=[^,]*$)/, ' and');

			const embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription('You rolled:  ' + newResults);

			message.channel.send(embed);
		}
		roll(dice, sides);
	},
};