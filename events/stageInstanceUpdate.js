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

module.exports = (client, oldStageInstance, newStageInstance) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[oldStageInstance.guildId]) {
		logsetting[oldStageInstance.guildId] = {
			checker: 1,
		};
	}
	if(!log[oldStageInstance.guildId]) return;
	const values = logsetting[oldStageInstance.guildId].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = oldStageInstance.guild.channels.cache.get(`${log[oldStageInstance.guildId].channel}`);
		if(!logChannel) return;

		if (newStageInstance.discoverableDisabled !== oldStageInstance.discoverableDisabled) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Stage Instance Discoverable updated', newStageInstance.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`Dicoverable: ${newStageInstance.discoverableDisabled}`)
				.setTimestamp()
				.setFooter(`ID: ${newStageInstance.channelId}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}

		if (newStageInstance.privacyLevel !== oldStageInstance.privacyLevel) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Stage Instance Privacy Level updated', newStageInstance.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`Privacy Level: ${newStageInstance.privacyLevel}`)
				.setTimestamp()
				.setFooter(`ID: ${newStageInstance.channelId}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}

		if (newStageInstance.topic !== oldStageInstance.topic) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Stage Instance Topic updated', newStageInstance.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.addField('Before', oldStageInstance.topic)
				.addField('After', newStageInstance.topic)
				.setTimestamp()
				.setFooter(`ID: ${newStageInstance.channelId}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
	}
};