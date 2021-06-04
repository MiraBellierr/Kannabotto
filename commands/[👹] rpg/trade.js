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
const characters = require('../../database/characters.json');
const Models = require('../../create-model.js');
const { getMember } = require('../../functions');
const { promptMessage } = require('../../functions');
const emojis = ['✅', '❎'];
const fs = require('fs');

module.exports = {
	name: 'trade',
	description: 'trade image with other player',
	category: '[👹] rpg',
	example: `${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"`,
	usage: '<mentions> "<image you want to trade>" "<image you want to trade with>"',
	run: async (client, message, args) => {
		const user = message.author.id;
		if (args.length < 1) return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);
		const otherUser = getMember(message, args[0]);
		if (!otherUser) return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);
		if (otherUser.user.id === message.author.id) return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);

		const Player = Models.Player();

		const player = await Player.findOne({ where: { userId: user } });
		const mentionedPlayer = await Player.findOne({ where: { userId: otherUser.user.id } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);
		if (!mentionedPlayer) return message.channel.send('The person that you want to trade with doesn\'t have a profile. do `J.start` to create a profile.');
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
		if (input[0] !== '') return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);
		if (input[2] !== ' ') return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);
		if (input[4] !== '') return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);

		const image1 = input[1];
		const image2 = input[3];
		if (image1 === image2) return message.channel.send('Cannot trade with the same image');

		if (image1 === 'default' || image2 === 'default') return message.channel.send(`The right syntax is \`${bot_prefix}trade <mentions> "<image you want to trade>" "<image you want to trade with>"\``);

		let check1 = 0;
		for (let i = 0; i < images[message.author.id].length; i++) {
			if (image1.toLowerCase() === images[message.author.id][i].name.toLowerCase()) {
				check1 = 1;
				if (images[message.author.id][i].image === player.get('image')) {
					return message.channel.send(`**${message.author.username}**, You are currently equipped this image.`);
				}
			}
		}
		if (check1 === 0) return message.channel.send(`**${message.author.username}**, You don't have this image or the image doesn't exist.`);

		let check2 = 0;
		for (let i = 0; i < images[otherUser.user.id].length; i++) {
			if (image2.toLowerCase() === images[otherUser.user.id][i].name.toLowerCase()) {
				check2 = 1;
				if (images[otherUser.user.id][i].image === mentionedPlayer.get('image')) {
					return message.channel.send(`**${message.author.username}**, The person you mentioned are currently equipped that image.`);
				}
			}
		}
		if (check2 === 0) return message.channel.send(`**${message.author.username}**, the person you mentioned doesn't have that image or the image doesn't exist.`);

		const prompt = new Discord.MessageEmbed()
			.setTitle(`${message.author.username} wants to trade ${image1} with ${image2}!`)
			.setDescription('React with ✅ to accept the trade\nReact with ❎ to deny the trade')
			.setTimestamp();
		const m = await message.channel.send(prompt);
		const reacted = await promptMessage(m, otherUser.user, 300000, emojis);
		if (reacted === '✅') {
			const character1 = [];
			const character2 = [];
			for (let i = 0; i < characters.length; i++) {
				if (characters[i].name.toLowerCase() === image1.toLowerCase()) {
					character1.push(characters[i]);
				}
				if (characters[i].name.toLowerCase() === image2.toLowerCase()) {
					character2.push(characters[i]);
				}
			}
			for (let i = 0; i < images[message.author.id].length; i++) {
				if (image1.toLowerCase() === images[message.author.id][i].name.toLowerCase()) {
					images[message.author.id][i].name = character1[0].name;
					images[message.author.id][i].image = character1[0].image;
				}

			}
			for (let i = 0; i < images[otherUser.user.id].length; i++) {
				if (image2.toLowerCase() === images[otherUser.user.id][i].name.toLowerCase()) {
					images[otherUser.user.id][i].name = character2[0].name;
					images[otherUser.user.id][i].image = character2[0].image;
				}

			}
			fs.writeFile('./database/images.json', JSON.stringify(images, null, 2), (err) => {
				if (err) return console.log(err);
				return message.channel.send('Trade has been made.');
			});
		}
		else if (reacted === '❎') {
			return message.channel.send('Trade has been canceled');
		}
	},
};