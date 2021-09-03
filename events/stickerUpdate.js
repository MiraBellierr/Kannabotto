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

const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client, oldSticker, newSticker) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[oldSticker.guildId]) {
		logsetting[oldSticker.guildId] = {
			checker: 1,
		};
	}
	if(!log[oldSticker.guild.id]) return;
	const values = logsetting[oldSticker.guildId].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = oldSticker.guild.channels.cache.get(`${log[oldSticker.guildId].channel}`);
		if(!logChannel) return;

		if (newSticker.description !== oldSticker.description) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Sticker Description Updated', newSticker.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.addField('Before', oldSticker.description)
				.addField('After', newSticker.description)
				.setTimestamp()
				.setFooter(`Sticker: ${newSticker.name}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}

		if (newSticker.name !== oldSticker.name) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Sticker Name Updated', newSticker.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.addField('Before', oldSticker.name)
				.addField('After', newSticker.name)
				.setTimestamp()
				.setFooter(`ID: ${newSticker.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
		if (newSticker.tags !== oldSticker.tags) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Sticker Tags Updated', newSticker.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.addField('Before', oldSticker.tags.join(', '))
				.addField('After', newSticker.tags.join(', '))
				.setTimestamp()
				.setFooter(`Sticker: ${newSticker.name}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
	}
};