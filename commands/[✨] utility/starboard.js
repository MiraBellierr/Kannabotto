const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const fs = require('fs');
const starboard = require('../../database/starboard.json');

module.exports = {
	name: 'starboard',
	category: '[✨] utility',
	description: 'A :star: starboard channel for the server',
	example: `${bot_prefix}starboard`,
	run: async (client, message, args) => {
		const prefix = prefixes[message.guild.id];
		const option = args.join(' ');
		if (!starboard[message.guild.id]) {
			starboard[message.guild.id] = {
				channel: 'none',
				checker: 0,
				count: 1,
			};
		}
		if (!option) {
			const embed1 = new Discord.MessageEmbed()
				.setAuthor(`${client.user.username} Starboard`, client.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`
**Proper Usage:**
• ${prefix}starboard set \`#tagchannel\`
• ${prefix}starboard star \`number\` (stars needed for the message to be posted in the starboard channel, default = 1)
• ${prefix}starboard on
• ${prefix}starboard off
**Example:**
• ${prefix}starboard set \`#hall-of-fame\`
**After do that, do again:**
• ${prefix}starboard on
`)
				.setFooter('Starboard Channel')
				.setTimestamp();
			message.channel.send(embed1);
		}
		else if (option.match('set')) {
			if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, CheckOwner: true })) return message.reply(`**${message.author.username}**, Sorry, You need \`MANAGE_CHANNELS\` permission to use this command!`);
			const inputmessage = message.mentions.channels.first();
			if (!inputmessage) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefix}starboard set <channel>\`.`);
			if (!message.guild.me.permissionsIn(inputmessage).has('SEND_MESSAGES')) return message.channel.send('I do not have a permission to send a message in that channel.');

			if (args[0]) {
				starboard[message.guild.id].channel = inputmessage.id;
				fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
					if (err) console.log(err);
				});

				const embed2 = new Discord.MessageEmbed()
					.setColor('RANDOM')
					.setDescription(`Starboard channel set to: ${inputmessage}`)
					.setTimestamp().setFooter('Starboard channel', client.user.displayAvatarURL({ dynamic: true }));
				message.channel.send(embed2);
			}
		}
		else if (option.match('star')) {
			if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, CheckOwner: true })) return message.reply(`**${message.author.username}**, Sorry, You need \`MANAGE_CHANNELS\` permission to use this command!`);
			const inputmessage = parseInt(args[1]);
			if (!args[1]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefix}starboard star <number>\`.`);
			if (!inputmessage) return message.channel.send(`**${message.author.username}**, please enter a valid number`);
			if (isNaN(inputmessage)) return message.channel.send(`**${message.author.username}**, please enter a valid number`);
			if (inputmessage < 1) return message.channel.send(`**${message.author.username}**, please enter a valid number`);
			if (args[0]) {
				starboard[message.guild.id].count = inputmessage;
				fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
					if (err) console.log(err);
				});

				const embed2 = new Discord.MessageEmbed()
					.setColor('RANDOM')
					.setDescription(`Starboard star set to: ${inputmessage}`)
					.setTimestamp().setFooter('Starboard star', client.user.displayAvatarURL({ dynamic: true }));
				message.channel.send(embed2);
			}

		}

		if (option.match('on')) {
			if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, CheckOwner: true })) return message.reply(`**${message.author.username}**, Sorry, You need \`MANAGE_CHANNELS\` permission to use this command!`);
			if (starboard[message.guild.id].channel === 'none') return message.channel.send(`**${message.author.username}**, The channel has not been set yet for this guild.`);
			starboard[message.guild.id].checker = 1;
			fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
				console.error(err);
			});
			const embed3 = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setDescription('Starboard has been set **on**.')
				.setTimestamp()
				.setFooter('Starboard enable', client.user.displayAvatarURL({ dynamic: true }));

			message.channel.send(embed3);
		}
		if (option.match('off')) {
			if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, CheckOwner: true })) return message.reply(`**${message.author.username}**, Sorry, You need \`MANAGE_CHANNELS\` permission to use this command!`);
			if (starboard[message.guild.id].channel === 'none') return message.channel.send(`**${message.author.username}**, The channel has not been set yet for this guild.`);
			starboard[message.guild.id].checker = 0;
			fs.writeFile('./database/starboard.json', JSON.stringify(starboard, null, 2), (err) => {
				console.error(err);
			});
			const embed4 = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setDescription('Starboard has been set **off**.')
				.setTimestamp()
				.setFooter('Starboard disable', client.user.displayAvatarURL({ dynamic: true }));

			message.channel.send(embed4);
		}
	},
};