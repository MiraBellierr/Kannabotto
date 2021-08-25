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

module.exports = (client, oldRole, newRole) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[newRole.guild.id]) {
		logsetting[newRole.guild.id] = {
			checker: 1,
		};
	}
	if(!log[newRole.guild.id]) return;
	const values = logsetting[newRole.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = newRole.guild.channels.cache.get(`${log[newRole.guild.id].channel}`);
		if(!logChannel) return;

		if (newRole.name !== oldRole.name) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Role Name Updated', newRole.guild.iconURL({ dynamic: true }))
				.setDescription(`Role: ${newRole}`)
				.addField('Before', oldRole.name)
				.addField('After', newRole.name)
				.setTimestamp()
				.setFooter(`ID: ${newRole.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
		if (newRole.hexColor !== oldRole.hexColor) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Color Role Updated', newRole.guild.iconURL({ dynamic: true }))
				.setDescription(`Role: ${newRole}`)
				.addField('Before', oldRole.hexColor)
				.addField('After', newRole.hexColor)
				.setTimestamp()
				.setFooter(`ID: ${newRole.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
		else if (newRole.hoist !== oldRole.hoist) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Role Hoist Updated', newRole.guild.iconURL({ dynamic: true }))
				.setDescription(`Role: ${newRole}`)
				.addField('Before', oldRole.hoist ? 'Hoisted' : 'Not Hoisted')
				.addField('After', newRole.hoist ? 'Hoisted' : 'Not Hoisted')
				.setTimestamp()
				.setFooter(`ID: ${newRole.id}`);

			logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		}

	}
};