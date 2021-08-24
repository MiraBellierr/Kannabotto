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
const Models = require('../../create-model.js');
const { getUserDataAndCreate, checkPlayerExist, createAllDataForNewUser } = require('../../functions');

module.exports = {
	name: 'setimage',
	description: 'Set an image for your character',
	category: '[👹] rpg',
	example: `${bot_prefix}setimage <name>`,
	usage: '<name>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Player = Models.Player();
		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;

		await createAllDataForNewUser(user);

		const player = await getUserDataAndCreate(Player, user);

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

		if (!args.length) return message.reply(`**${message.author.username}**, please include a character name.`);

		for (let i = 0; i < images[message.author.id].length; i++) {
			if (input.toLowerCase() === images[message.author.id][i].name.toLowerCase()) {
				if (images[message.author.id][i].image === player.get('image')) {
					return message.reply(`**${message.author.username}**, You have already equipped this image.`);
				}

				await Player.update({ image: images[message.author.id][i].image }, { where: { userId: user } });
			}
		}

		const updatedPlayer = await getUserDataAndCreate(Player, user);

		if (updatedPlayer.get('image') === image) {
			return message.reply(`**${message.author.username}**, You don't have this character image or you type it wrong. Do \`${prefixes[message.guild.id]}images\` to see your image collection.`);
		}

		message.reply(`**${message.author.username}**, Your character image has been set!`);
	},
};