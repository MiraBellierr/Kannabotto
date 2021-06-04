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

const { bot_prefix, color } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'emote',
	aliases: ['emoji'],
	category: '[✨] utility',
	description: 'convert an emoji to an image form',
	example: `${bot_prefix}emote <emote>`,
	usage: '<emote>',
	run: (client, message, args) => {

		if (!args.length) return message.channel.send(`Please use this command with an emoji. \`${prefixes[message.guild.id]}emote <emoji>\`.`);
		if (args.length > 1) return message.channel.send('I only can convert one emoji at a time. Sorry if i\'m disappointed you :c');

		try {
			const wordArr = message.content.split('').slice(8);
			const emojiArr = wordArr.slice(-19, -1);
			const emojiID = emojiArr.join('');

			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setColor(color)
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			if (wordArr[1] === 'a') {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.gif`);
			}
			else {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.png`);
			}

			message.channel.send(embed);
		}
		catch (e) {
			message.channel.send(`Emoji can't be found :c\n\n**NOTE**:\n- Unicode's emojis can't be retrieved (default emojis).\n- Please use this command with the right syntax \`${prefixes[message.guild.id]}emote <emoji>\`.`);
		}


	},
};