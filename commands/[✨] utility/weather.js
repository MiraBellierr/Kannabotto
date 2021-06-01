const discord = require('discord.js');
const w = require('weather-js2');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'weather',
	description: 'Send an information about a weather',
	example: `${bot_prefix}weather <location>`,
	category: '[✨] utility',
	usage: '<location>',
	run: (client, message) => {
		const loc = message.content.split(' ');
		if (!loc) {
			message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}weather <location>\`.`);
			return;
		}
		else {
			w.find({ search: loc, degreeType: 'C', resCount: 1 }, function(err, result) {
				if (err) {
					message.channel.send(err);
					message.channel.send(JSON.stringify(result, null, 2));
				}
				const area = result[0];

				const embed = new discord.MessageEmbed()
					.setAuthor(message.author.username, client.user.avatarURL({ dynamic: true }))
					.addField('Weather Information', `**• Name:** ${area.location.name}\n**• Temperature:** ${area.current.temperature}°C\n**• Feels Like:** ${area.current.feelslike}°C\n**• Clouds:** ${area.current.skytext}\n**• Humidity:** ${area.current.humidity}%\n**• Wind Speed:** ${area.current.winddisplay}\n**• Day:** ${area.current.day}\n**• Date:** ${area.current.date}`)
					.setImage(`${area.current.imageUrl}`)
					.setTimestamp()
					.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

				message.channel.send(embed);
				return;
			});
		}

	} };