// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
			return message.reply(`The right syntax is \`${prefixes[message.guild.id]}weather <location>\`.`);
		}
		else {
			w.find({ search: loc, degreeType: 'C', resCount: 1 }, function(err, result) {
				if (err) {
					console.error(err);
				}

				const area = result[0];

				const embed = new discord.MessageEmbed()
					.setAuthor(message.author.username, client.user.avatarURL({ dynamic: true }))
					.addField('Weather Information', `**• Name:** ${area.location.name}\n**• Temperature:** ${area.current.temperature}°C\n**• Feels Like:** ${area.current.feelslike}°C\n**• Clouds:** ${area.current.skytext}\n**• Humidity:** ${area.current.humidity}%\n**• Wind Speed:** ${area.current.winddisplay}\n**• Day:** ${area.current.day}\n**• Date:** ${area.current.date}`)
					.setImage(`${area.current.imageUrl}`)
					.setTimestamp()
					.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

				message.reply({ embeds: [embed] });
			});
		}

	} };