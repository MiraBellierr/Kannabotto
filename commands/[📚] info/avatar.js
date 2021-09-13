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
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');

module.exports = {
	name: 'avatar',
	aliases: ['av'],
	category: '[📚] info',
	example: `${bot_prefix}avatar [mention]`,
	description: 'Returns user avatar',
	usage: '[mention]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' ')) || message.member;

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(`${member.user.username}'s Avatar`)
			.setColor('#CD1C6C')
			.setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		message.reply({ embeds: [embed] });
	},
};