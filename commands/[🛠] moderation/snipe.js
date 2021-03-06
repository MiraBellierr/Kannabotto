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
	name: 'snipe',
	description: 'Allows you to view the last deleted message in the server. Can assist in identifying ghost pingers.',
	category: '[🛠] moderation',
	example: `${bot_prefix}snipe`,
	run: (client, message, args) => {
		if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('Sorry you don\'t have manage messages permission to use this command');

		String.prototype.embedify = function() {
			return new Discord.MessageEmbed().setColor('#CD1C6C').setDescription(`${this}`);
		};

		const snipe = client.snipeMap.get(message.channel.id);

		if (!snipe) return message.reply('There\'s nothing to snipe!');

		if (args[0] == 'image') {
			if(!args[1]) return message.reply('Please provide a message to retrieve the image from!'.embedify());
			const image = snipe[args[1] - 1];
			if(!image[1]) return message.reply('That message does not have an attached (deleted) image!'.embedify());
			console.log(image[1]);
			return message.reply({ embeds: [new Discord.MessageEmbed().setColor('#CD1C6C').setImage(image[1])] });
		}
		message.reply({ embeds: [`${snipe.map(msg => `${msg[0].content ? `${msg[0].content}${!msg[1] ? '' : '\n[IMAGE WAS DELETED]'}` : (!msg[1] ? '' : '[IMAGE WAS DELETED]')}`).join('\n\n')}`.embedify().setAuthor(`${snipe.map(msg => msg[0].author.tag)}`, `${snipe.map(msg => msg[0].author.displayAvatarURL({ dynamic: true }))}`).setTimestamp().setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }))] });
	},
};