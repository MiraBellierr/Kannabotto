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

const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');
const { getMember } = require('../../functions');

module.exports = {
	name: 'comment',
	description: 'youtube comment image overlay',
	category: '[📷] image manipulation',
	example: `${bot_prefix}comment <username | id | mentions> <text>`,
	usage: '[mention | attachment] <text>',
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}comment <username | id | mention> <text>\`.`);
		if (!args[1]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}comment <username | id | mention> <text>\`.`);
		const member = await getMember(message, args[0]);
		const image = member.user.displayAvatarURL({ format: 'png', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.channel.send('User not found.');
		const username = await getMember(message, args[0]).displayName || message.member.displayName;
		const m = await message.channel.send('*Please wait..*');
		const comment = args.slice(1).join(' ');
		console.log(comment);
		const url = `https://some-random-api.ml/canvas/youtube-comment?avatar=${image}&username=${username}&comment=${comment}`;
		const attachment = new Discord.MessageAttachment(await encodeURI(url), 'youtube.png');
		message.channel.send(attachment).then(() => m.delete());
	},
};