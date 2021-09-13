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
	name: 'servericon',
	aliases: ['si'],
	category: '[📚] info',
	example: `${bot_prefix}servericon`,
	description: 'Returns server icon',
	run: (client, message) => {
		const embeduser = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Server Icon')
			.setColor('#CD1C6C')
			.setImage(message.guild.iconURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embeduser] });
	},
};