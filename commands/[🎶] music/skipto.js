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
	name: 'skipto',
	aliases: ['st'],
	category: '[🎶] music',
	description: 'Skip to the selected queue number',
	example: `${bot_prefix}skipto <queue number>`,
	usage: '<queue number>',
	run: async (client, message, args) => {
		if (!args.length) return message.reply(`**${message.author.username}**, the right syntax is ${prefixes[message.guild.id]}skipto <Queue Number>`);

		const queue = client.queue.get(message.guild.id);

		if (isNaN(args[0])) return message.reply('This command only accept a number as an argument.');

		if (parseInt(args[0]) < 1) return message.reply('The argument only accept number bigger than 2');

		if (!queue) return message.reply(`**${message.author.username}**, there is no queue.`).catch(console.error);
		if (!canModifyQueue(message.member)) return message.reply('You need to join the voice channel first');

		queue.playing = true;
		queue.position = parseInt(args[0]) - 2;

		if (!queue.songs[queue.position]) return message.reply(`There is no song with the queue of #${args[0]}`);

		queue.player.stop(true);
		queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setDescription(`**${message.author.username}** playing queue song #${args[0]}`).setColor('#CD1C6C')] }).catch(console.error);
	},
};