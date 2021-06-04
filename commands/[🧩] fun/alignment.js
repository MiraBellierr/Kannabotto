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
	name: 'alignment',
	description: 'Choose a random alignment based on the persons id',
	category: '[🧩] fun',
	example: `${bot_prefix}alignment`,
	run(client, msg) {
		const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
		const id = parseInt(msg.author.id);
		const choice = id % alignments.length;
		const embed = new Discord.MessageEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setColor(client.color)
			.setDescription(`📜 ${msg.member.displayName}, you are **${alignments[choice]}**!`)
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		msg.channel.send(embed);
	},
};