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

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { color } = require('../config.json');

module.exports = async (client, oldGuild, newGuild) => {
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	const verlvl = {
		NONE: 'None',
		LOW: 'Low',
		MEDIUM: 'Medium',
		HIGH: '(╯°□°）╯︵ ┻━┻',
		VERY_HIGH: '(ノಠ益ಠ)ノ彡┻━┻',
	};
	const verlvl2 = {
		DISABLED: 'disabled',
		MEMBERS_WITHOUT_ROLES: 'Apply to members without roles only',
		ALL_MEMBERS: 'Apply to all members',
	};

	if(!logsetting[newGuild.id]) {
		logsetting[newGuild.id] = {
			checker: 1,
		};
	}
	if(!log[newGuild.id]) return;
	const values = logsetting[newGuild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = newGuild.channels.cache.get(`${log[newGuild.id].channel}`);
		if(!logChannel) return;

		if (newGuild.icon !== oldGuild.icon) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild Icon Updated', newGuild.iconURL({ dynamic: true }))
				.setDescription(`[Old Icon](${oldGuild.iconURL({ dynamic: true })}) -> [New Icon](${newGuild.iconURL({ dynamic: true })})`)
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
		else if (newGuild.name !== oldGuild.name) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild Name Updated', newGuild.iconURL({ dynamic: true }))
				.addField('Before', oldGuild.name)
				.addField('After', newGuild.name)
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
		else if (newGuild.owner.user.id !== oldGuild.owner.user.id) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild Owner Updated', newGuild.iconURL({ dynamic: true }))
				.addField('Before', oldGuild.owner.user)
				.addField('After', newGuild.owner.user)
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
		else if(newGuild.region !== oldGuild.region) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild region Updated', newGuild.iconURL({ dynamic: true }))
				.addField('Before', oldGuild.region)
				.addField('After', newGuild.region)
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
		else if (newGuild.explicitContentFilter !== oldGuild.explicitContentFilter) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild Explicit Content Filter Updated', newGuild.iconURL({ dynamic: true }))
				.addField('Before', verlvl2[oldGuild.explicitContentFilter])
				.addField('After', verlvl2[newGuild.explicitContentFilter])
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
		else if (newGuild.verificationLevel !== oldGuild.verificationLevel) {
			const embed = new MessageEmbed()
				.setColor(color)
				.setAuthor('Guild Verification Level Updated', newGuild.iconURL({ dynamic: true }))
				.addField('Before', verlvl[oldGuild.verificationLevel])
				.addField('After', verlvl[newGuild.verificationLevel])
				.setFooter(`ID: ${newGuild.id}`).setTimestamp();

			logChannel.send({ embeds: [embed] });
		}
	}
};