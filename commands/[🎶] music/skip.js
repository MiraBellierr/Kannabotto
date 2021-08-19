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
const Discord = require('discord.js');

module.exports = {
	name: 'skip',
	category: '[🎶] music',
	description: 'Skip the currently playing song',
	example: `${bot_prefix}skip`,
	run: async (client, message) => {
		const queue = client.queue.get(message.guild.id);

		if (!queue) {return message.reply(`**${message.author.username}**, nothing is playing right now.`).catch(console.error);}
		if (!canModifyQueue(message.member)) return message.reply('You need to join the voice channel first');

		queue.playing = true;
		queue.connection._state.subscription.player.stop();
		queue.textChannel.send({ embeds: [new Discord.MessageEmbed().setDescription(`**${message.author.username}** skipped the song`).setColor('RANDOM')] }).catch(console.error);
	},
};