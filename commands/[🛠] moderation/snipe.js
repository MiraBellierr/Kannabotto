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
		if (!message.member.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have a `MANAGE_MESSAGES` permission to use this command');

		String.prototype.embedify = function() {
			return new Discord.MessageEmbed().setColor('RANDOM').setDescription(this);
		};

		const snipe = client.snipeMap.get(message.channel.id);

		if (!snipe) return message.channel.send('There\'s nothing to snipe!');

		if (args[0] == 'image') {
			if(!args[1]) return message.channel.send('Please provide a message to retrieve the image from!'.embedify());
			const image = snipe[args[1] - 1];
			if(!image[1]) return message.channel.send('That message does not have an attached (deleted) image!'.embedify());
			console.log(image[1]);
			return message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setImage(image[1]));
		}
		message.channel.send(`${snipe.map(msg => `${msg[0].content ? `${msg[0].content}${!msg[1] ? '' : '\n[IMAGE WAS DELETED]'}` : (!msg[1] ? '' : '[IMAGE WAS DELETED]')}`).join('\n\n')}`.embedify().setAuthor(`${snipe.map(msg => msg[0].author.tag)}`, `${snipe.map(msg => msg[0].author.displayAvatarURL({ dynamic: true }))}`).setTimestamp().setFooter(client.user.tag, client.user.avatarURL({ dynamic: true })));
	},
};