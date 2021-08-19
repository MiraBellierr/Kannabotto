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
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'roleinfo',
	aliases: ['role'],
	category: '[📚] info',
	description: 'Returns role information',
	example: `${bot_prefix}roleinfo <role name>`,
	usage: '<role name>',
	run: async (client, message, args) => {

		let role = args.join(' ');
		if(!role) return message.reply('Specify a role!');
		role = message.guild.roles.cache.get(role) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role)) || message.mentions.roles.first();
		if(!role) return message.reply('Couldn\'t find that role.');


		const guildMembers = await role.guild.members.fetch();
		const memberCount = guildMembers.filter(member => member.roles.cache.has(role.id)).size;

		let permission;

		if (role.permissions.has('ADMINISTRATOR')) {
			permission = 'Administrator';
		}
		else if (!role.permissions.has('ADMINISTRATOR') && (role.permissions.has('KICK_MEMBERS') || role.permissions.has('BAN_MEMBERS') || role.permissions.has('MANAGE_CHANNELS') || role.permissions.has('MANAGE_GUILD') || role.permissions.has('MANAGE_MESSAGES') || role.permissions.has('MENTION_EVERYONE') || role.permissions.has('MUTE_MEMBERS') || role.permissions.has('DEAFEN_MEMBERS') || role.permissions.has('MOVE_MEMBERS') || role.permissions.has('MANAGE_NICKNAMES') || role.permissions.has('MANAGE_ROLES') || role.permissions.has('MANAGE_WEBHOOKS') || role.permissions.has('MANAGE_EMOJIS_AND_STICKERS'))) {
			permission = 'Moderator';
		}
		else {
			permission = 'Member';
		}

		const status = {
			false: 'No',
			true: 'Yes',
		};

		const roleemebed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Role Information')
			.setDescription(`**• ID:** ${role.id}\n**• Name:** ${role.name}\n**• Mention:** ${role}\n**• Hex:** ${role.hexColor.toUpperCase()}\n**• Members with this role:** ${memberCount}\n**• Position:** ${role.position}\n**• Hoisted status:** ${status[role.hoist]}\n**• Mentionable:** ${status[role.mentionable]}\n**• Permission:** ${permission}`)
			.setColor('#00ff00')
			.setThumbnail(role.guild.iconURL({ dynamic: true }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		message.reply({ embeds: [roleemebed] });
	},
};