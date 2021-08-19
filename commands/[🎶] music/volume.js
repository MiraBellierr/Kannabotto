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

const { canModifyQueue } = require('../../utils/util');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'volume',
	category: '[🎶] music',
	description: 'Change volume of currently playing music',
	example: `${bot_prefix}volume [0-100]`,
	run: async (client, message, args) => {
		const queue = client.queue.get(message.guild.id);

		if (!queue) return message.reply(`**${message.author.username}**, nothing is playing right now.`).catch(console.error);
		if (!canModifyQueue(message.member)) {return message.reply(`**${message.author.username}**, you need to join a voice channel first!`).catch(console.error);}

		if (!args[0]) return message.reply(new Discord.MessageEmbed().setDescription(`🔊 The current volume is: **${queue.volume}%**`).setColor('RANDOM')).catch(console.error);
		if (isNaN(args[0])) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}volume [0-100]\`.`).catch(console.error);
		if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0) {return message.reply(`**${message.author.username}**, please use a number between 0-100.`).catch(console.error);}

		queue.volume = args[0];
		queue.connection._state.resource.volume.setVolume(args[0] / 100);

		return queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setDescription(`Volume set to: **${args[0]}%**`).setColor('RANDOM')] }).catch(console.error);
	},
};