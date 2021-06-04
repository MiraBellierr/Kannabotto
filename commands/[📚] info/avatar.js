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
	run: (client, message, args) => {
		if (!args[0]) {
			const embeduser = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Your avatar')
				.setColor('RANDOM')
				.setImage(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));
			return message.channel.send(embeduser);
		}

		const user = getMember(message, args.join(' '));

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(`${user.user.username}'s Avatar`)
			.setColor('RANDOM')
			.setImage(user.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	},
};