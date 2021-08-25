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
const characters = require('../../database/characters.json');
const Models = require('../../create-model.js');
const { getMember, checkPlayerExist, getUserDataAndCreate } = require('../../functions');
const { promptMessage } = require('../../functions');
const emojis = ['✅', '❎'];

module.exports = {
	name: 'trade',
	description: 'trade image with other player',
	category: '[👹] rpg',
	example: `${bot_prefix}trade <mentions> "<your image>" "<other person image>"`,
	usage: '<mentions> "<your image>" "<other person image>"',
	run: async (client, message, args) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		if (args.length < 1) return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);

		const otherUser = await getMember(message, args[0]);

		if (!otherUser) return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);
		if (otherUser.user.id === message.author.id) return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);

		if (!await checkPlayerExist(otherUser.user.id)) return message.reply('The person that you want to trade with doesn\'t have a profile. do `J.start` to create a profile.');

		const Player = Models.Player();
		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;
		const player = await getUserDataAndCreate(Player, user);
		const mentionedPlayer = await getUserDataAndCreate(Player, otherUser.user.id);

		if (!images[message.author.id]) {
			images[message.author.id] = [
				{
					name: 'Default',
					image: player.get('image'),
					count: 1,
				},
			];
		}

		if (!images[otherUser.user.id]) {
			images[otherUser.user.id] = [
				{
					name: 'Default',
					image: mentionedPlayer.get('image'),
					count: 1,
				},
			];
		}
		const input = args.slice(1, args.length).join(' ').split('"');

		if (input[0] !== '') return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);
		if (input[2] !== ' ') return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);
		if (input[4] !== '') return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);

		const image1 = input[1];
		const image2 = input[3];

		if (image1 === image2) return message.reply('Cannot trade with the same image');

		if (image1 === 'default' || image2 === 'default') return message.reply(`The right syntax is \`${bot_prefix}trade <mentions> "<your image>" "<other person image>"\``);

		const authorImage = images[message.author.id].find(x => x.name.toLowerCase() === image1.toLowerCase());

		if (!authorImage) return message.reply('You don\'t have this image or this image does not exist.');

		const targetImage = images[otherUser.user.id].find(x => x.name.toLowerCase() === image2.toLowerCase());

		if (!targetImage) return message.reply('The person you want to trade image doesn\'t have that image or that image doesn\'t exist');

		const prompt = new Discord.MessageEmbed()
			.setTitle(`${message.author.username} wants to trade ${image1} with ${image2}!`)
			.setDescription('React with ✅ to accept the trade\nReact with ❎ to deny the trade')
			.setTimestamp();

		const m = await message.reply({ embeds: [prompt] });

		const reacted = await promptMessage(m, otherUser.user, 300000, emojis);

		if (reacted === '✅') {
			const characters1 = characters.find(x => x.name.toLowerCase() === authorImage.name.toLowerCase());

			const newCharacter1 = {
				name: characters1.name,
				image: characters1.image,
				count: 1,
			};

			const characters2 = characters.find(x => x.name.toLowerCase() === targetImage.name.toLowerCase());

			const newCharacter2 = {
				name: characters2.name,
				image: characters2.image,
				count: 1,
			};

			images[message.author.id] = removeA(images[message.author.id], authorImage);
			images[message.author.id].push(newCharacter2);
			images[otherUser.user.id] = removeA(images[otherUser.user.id], targetImage);
			images[otherUser.user.id].push(newCharacter1);

			await Images.update({ data: images }, { where: { id: 1 } });

			return message.reply('Trade has been made.');
		}
		else if (reacted === '❎') {
			return message.reply('Trade has been canceled');
		}
	},
};

function removeA(arr) {
	const a = arguments;
	let what, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}