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
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'blur',
	description: 'fast blur the image by <number> pixels',
	category: '[📷] image manipulation',
	example: `${bot_prefix}blur <number> [username | attachment]`,
	usage: '<number> [username | attachment]',
	run: async (client, message, args) => {
		const image = message.attachments.first() || await getMember(message, args.slice(1).join(' ')).user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!args[0]) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}blur <number> [username | attachment]\`.`);
		if (isNaN(args[0])) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}blur <number> [username | attachment]\`.`);
		if (args[0] > 100 || args[0] < 1) return message.reply('you can only choose a number between 1-100');
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}blur <number> [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.blur(parseInt(args[0]))
					.write('./images/blur.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/blur.png'] }).then(() => m.delete());
	},
};