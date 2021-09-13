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

module.exports = {
	name: 'emote',
	category: '[✨] utility',
	description: 'convert an emoji to an image form',
	options: [{
		name: 'emote',
		description: 'emote to be converted',
		type: 3,
		required: true,
	}],
	run: (client, interaction) => {
		try {
			const wordArr = interaction.options.getString('emote').split('');
			const emojiArr = wordArr.slice(-19, -1);
			const emojiID = emojiArr.join('');

			const embed = new MessageEmbed()
				.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
				.setColor('#CD1C6C')
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			if (wordArr[1] === 'a') {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.gif`);
			}
			else {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.png`);
			}

			interaction.reply({ embeds: [embed] });
		}
		catch (e) {
			interaction.reply('Emoji can\'t be found :c\n\n**NOTE**:\n- Unicode\'s emojis can\'t be retrieved (default emojis).\n- Please use this command with the right syntax `/emote <emoji>`.');
		}


	},
};