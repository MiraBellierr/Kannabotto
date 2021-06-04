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
const prefixes = require('../../database/prefix.json');
const images = require('../../database/images.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'setimage',
	description: 'Set an image for your character',
	category: '[👹] rpg',
	example: `${bot_prefix}setimage <name>`,
	usage: '<name>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Player = Models.Player();

		const player = await Player.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);
		if (!images[message.author.id]) {
			images[message.author.id] = [
				{
					name: 'Default',
					image: player.get('image'),
					count: 1,
				},
			];
		}
		const input = args.join(' ');
		const image = player.get('image');
		if (!args.length) return message.channel.send(`**${message.author.username}**, please include a character name.`);
		for (let i = 0; i < images[message.author.id].length; i++) {
			if (input.toLowerCase() === images[message.author.id][i].name.toLowerCase()) {
				if (images[message.author.id][i].image === player.get('image')) {
					return message.channel.send(`**${message.author.username}**, You have already equipped this image.`);
				}
				await Player.update({ image: images[message.author.id][i].image }, { where: { userId: user } });
			}
		}
		const player2 = await Player.findOne({ where: { userId: user } });
		if (player2.get('image') === image) {
			return message.channel.send(`**${message.author.username}**, You don't have this character image or you type it wrong. Do \`${prefixes[message.guild.id]}images\` to see your image collection.`);
		}
		message.channel.send(`**${message.author.username}**, Your character image has been set!`);
	},
};