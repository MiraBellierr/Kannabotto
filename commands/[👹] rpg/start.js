const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'start',
	description: 'This is the beginning of the story',
	category: '[👹] rpg',
	example: `${bot_prefix}start <class>`,
	usage: '<class>',
	run: async (client, message, args) => {
		const user = message.author.id;
		const Player = Models.Player();

		if (!args[0]) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Hello ${message.author.username}`)
				.setColor('RANDOM')
				.setDescription(`To begin play, please choose one of these class with the \`${prefixes[message.guild.id]}start <class>\`.`)
				.setColor('RANDOM')
				.addFields(
					{ name: 'Warrior', value: '```js\n• Level: 1\n• Health: 5\n• Physical Attack: 5\n• Magical Attack: 1\n• physical Resistance: 6\n• Magical Resistance: 3\n• Speed: 1```' },
					{ name: 'Monk', value: '```js\n• Level: 1\n• Health: 2\n• Physical Attack: 10\n• Magical Attack: 1\n• physical Resistance: 5\n• Magical Resistance: 2\n• Speed: 1```' },
					{ name: 'Mage', value: '```js\n• Level: 1\n• Health: 2\n• Physical Attack: 1\n• Magical Attack: 10\n• physical Resistance: 2\n• Magical Resistance: 5\n• Speed: 1```' },
				)
				.setTimestamp()
				.setImage('https://cdn.discordapp.com/attachments/716107950032420897/726607719653703780/rpg.png');

			message.channel.send(embed);
		}
		else if (args[0].toLowerCase() === 'warrior') {
			try {
				await Player.create({
					userId: user,
					start: 1,
					name: 'Your Character',
					class: 'Warrior',
					level: 1,
					totalXp: 500,
					health: 5,
					physicalAttack: 5,
					magicalAttack: 1,
					physicalResistance: 6,
					magicalResistance: 3,
					speed: 1,
					image: 'https://cdn.discordapp.com/attachments/716107950032420897/726074544988749924/unnamed.png',
				});
				message.channel.send(`You have selected \`Warrior\`. Do \`${prefixes[message.guild.id]}profile\` to see your character profile.`);
			}
			catch(e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.channel.send(`**${message.author.username}**, You have already selected your class. do \`${prefixes[message.guild.id]}profile\` to see your character profile`);
				}
				return message.channel.send(`An error occurred: \`${e}\``);
			}
		}
		else if (args[0].toLowerCase() === 'monk') {
			try {
				await Player.create({
					userId: user,
					start: 1,
					name: 'Your Character',
					class: 'Monk',
					level: 1,
					totalXp: 500,
					health: 2,
					physicalAttack: 10,
					magicalAttack: 1,
					physicalResistance: 5,
					magicalResistance: 2,
					speed: 1,
					image: 'https://cdn.discordapp.com/attachments/716107950032420897/726074540471615588/unnamed_1.png',
				});
				message.channel.send(`You have selected \`Monk\`. Do \`${prefixes[message.guild.id]}profile\` to see your character profile.`);
			}
			catch(e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.channel.send(`**${message.author.username}**, You have already selected your class. do \`${prefixes[message.guild.id]}profile\` to see your character profile`);
				}
				return message.channel.send(`An error occurred: \`${e}\``);
			}
		}
		else if (args[0].toLowerCase() === 'mage') {
			try {
				await Player.create({
					userId: user,
					start: 1,
					name: 'Your Character',
					class: 'Mage',
					level: 1,
					totalXp: 500,
					health: 2,
					physicalAttack: 1,
					magicalAttack: 10,
					physicalResistance: 2,
					magicalResistance: 5,
					speed: 1,
					image: 'https://cdn.discordapp.com/attachments/716107950032420897/726074525967581184/unnamed_2.png',
				});
				message.channel.send(`You have selected \`Mage\`. Do \`${prefixes[message.guild.id]}profile\` to see your character profile.`);
			}
			catch(e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.channel.send(`**${message.author.username}**, You have already selected your class. do \`${prefixes[message.guild.id]}profile\` to see your character profile`);
				}
				return message.channel.send(`An error occurred: \`${e}\``);
			}
		}
		else {
			message.channel.send(`**${message.author.username}**, That class is not in the list.`);
		}
	},
};