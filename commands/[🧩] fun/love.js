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
const { getMember } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');
const love = require('../../database/love.json');
const fs = require('fs');

module.exports = {
	name: 'love',
	aliases: ['affinity'],
	category: '[🧩] fun',
	description: 'Calculates the love affinity you have for another person.',
	example: `${bot_prefix}love [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		// Get a member from mention, id, or username
		let person = await getMember(message, args.join());

		if (!person || message.author.id === person.id) {
			person = message.guild.members.cache
				.filter(m => m.id !== message.author.id)
				.random();
		}

		if (!love[message.author.id]) {
			love[message.author.id] = {};
		}

		if (!love[message.author.id][person.user.id]) {
			const loveMeter = Math.floor(Math.random() * 100);
			const loveIndex = Math.floor(loveMeter / 10);
			const loveLevel = '💖'.repeat(loveIndex) + '🖤'.repeat(10 - loveIndex);


			love[message.author.id][person.user.id] = loveMeter;

			fs.writeFile('./database/love.json', JSON.stringify(love, null, 2), (err) => {
				if (err) console.log(err);
			});

			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }))
				.setColor('#ffb6c1')
				.addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
					`💟 ${Math.floor(loveMeter)}%\n\n${loveLevel}`);

			return message.reply({ embeds: [embed] });
		}

		const loveMeter = love[message.author.id][person.user.id];
		const loveIndex = Math.floor(loveMeter / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '🖤'.repeat(10 - loveIndex);

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }))
			.setColor('#ffb6c1')
			.addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
				`💟 ${Math.floor(loveMeter)}%\n\n${loveLevel}`);

		message.reply({ embeds: [embed] });
	},
};