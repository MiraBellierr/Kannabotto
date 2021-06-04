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
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');

module.exports = {
	name: 'rainbow',
	aliases: ['gay'],
	description: 'A rainbow overlay to an image',
	category: '[📷] image manipulation',
	example: `${bot_prefix}rainbow [username | attachment]`,
	usage: '[username | attachment]',
	run: async (client, message, args) => {
		let image = message.attachments.first() || getMember(message, args.join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}rainbow [username | attachment]\`.`);
		if (image === message.attachments.first()) {
			image = message.attachments.first().url;
		}
		const m = await message.channel.send('*Please wait..*');
		const attachment = new Discord.MessageAttachment(await `https://some-random-api.ml/canvas/gay?avatar=${image}`, 'glass.png');
		message.channel.send(attachment).then(() => m.delete());
	},
};