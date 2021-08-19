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
const { getMember, formatDate } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'whois',
	aliases: ['who', 'user'],
	category: '[📚] info',
	description: 'Returns user information',
	example: `${bot_prefix}whois [username | id | mention]`,
	usage: '[username | id | mention]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' ')) || message.member;

		const premiumSince = formatDate(member.premiumSince);
		const joined = formatDate(member.joinedAt);
		const roles = member.roles.cache
			.filter(r => r.id !== message.guild.id)
			.map(r => r).join(', ') || 'None';

		// User variables
		const created = formatDate(member.user.createdTimestamp);

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
			.addField('User Information:', `**• Avatar URL:** [Link](${member.user.displayAvatarURL({ dynamic: true, size: 4096 })})\n**• ID:** ${member.user.id}\n**• Discriminator:** ${member.user.discriminator}\n**• Username**: ${member.user.username}\n**• Tag:** ${member.user.tag}\n**• Mention:** ${member.user}\n**• Account Type:** ${member.user.bot ? 'Bot' : 'Human'}\n**• Account created at**: ${created}`, true)
			.addField('Member Information:', `**• Nickname:** ${member.nickname === null ? 'None' : member.nickname}\n**• Display Name:** ${member.displayName}\n**• Display Hex Color:** ${member.displayHexColor.toUpperCase()}\n**• Manageable by this bot:** ${member.manageable ? 'Yes' : 'No'}\n**• bannable by this bot:** ${member.bannable ? 'Yes' : 'No'}\n**• Kickable by this bot:** ${member.kickable ? 'Yes' : 'No'}\n**• Nitro Booster Since:** ${member.premiumSince === null ? 'Not a Nitro Booster' : premiumSince}\n**• Joined At:** ${joined}`, true)
			.addField('**Roles**', roles);


		message.reply({ embeds: [embed] });
	},
};