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

const starboard = require('../database/starboard.json');
const Discord = require('discord.js');

module.exports = async (client, reaction) => {
	if (!starboard[reaction.message.guild.id]) {
		starboard[reaction.message.guild.id] = {
			channel: 'none',
			checker: 0,
			count: 1,
		};
	}
	const message = reaction.message;
	if (starboard[message.guild.id].channel !== 'none') {

		if (starboard[message.guild.id].checker === 1) {
			if (reaction.emoji.name === '⭐') {
				const starChannel = message.guild.channels.cache.get(starboard[message.guild.id].channel);
				const fetch = await starChannel.messages.fetch();
				const stars = fetch.find(m => m.content.startsWith('⭐') && m.content.endsWith(message.id));
				if (stars) {
					// eslint-disable-next-line no-useless-escape
					const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.content);
					const foundStar = stars.embeds[0];
					const embed = new Discord.MessageEmbed()
						.setColor(foundStar.color)
						.setDescription(foundStar.description)
						.setThumbnail(foundStar.thumbnail.url)
						.addField(foundStar.fields[0].name, foundStar.fields[0].value, true)
						.addField(foundStar.fields[1].name, foundStar.fields[1].value, true)
						.setTimestamp(foundStar.timestamp);
					if (foundStar.fields[2]) embed.addField(foundStar.fields[2].name, foundStar.fields[2].value);
					if (foundStar.image) embed.setImage(foundStar.image.url);


					const starMsg = await starChannel.messages.fetch(stars.id);
					await starMsg.edit(`⭐ ${parseInt(star[1]) - 1} | ${message.id}`, embed);
				}
			}
		}
	}
	else {
		return;
	}
};

