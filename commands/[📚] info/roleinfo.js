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

		const role = args.join(' ');
		if(!role) return message.reply('Specify a role!');
		const gRole = message.guild.roles.cache.get(role) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role)) || message.mentions.roles.first();
		if(!gRole) return message.reply('Couldn\'t find that role.');


		message.guild.members.fetch().then(members => {
			const memberCount = members.filter(member => member.roles.cache.has(gRole.id)).size;

			const status = {
				false: 'No',
				true: 'Yes',
			};

			const roleemebed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Role Information')
				.setDescription(`**• ID:** ${gRole.id}\n**• Name:** ${gRole.name}\n**• Mention:** ${gRole}\n**• Hex:** ${gRole.hexColor.toUpperCase()}\n**• Members with this role:** ${memberCount}\n**• Position:** ${gRole.position}\n**• Hoisted status:** ${[gRole.hoist]}\n**• Mentionable:** ${status[gRole.mentionable]}\n**• Managed:** ${status[gRole.managed]}`)
				.setColor('#00ff00')
				.setThumbnail(message.guild.iconURL)
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			message.channel.send(roleemebed);
		});
	},
};