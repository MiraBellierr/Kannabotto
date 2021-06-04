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

const fs = require('fs');
const bg = require('../../database/background.json');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'background',
	aliases: ['bg'],
	category: '[🎮] level',
	example: `${bot_prefix}background <attachment>`,
	description: 'Set your level card background',
	usage: '<attachment>',
	run: async (client, message, args) => {
		if (args[0] === 'default') {
			bg[message.author.id].background = 'https://cdn.discordapp.com/attachments/710732218254753842/717194057516056576/3430.jpg';
			const h = await message.channel.send('*Please Wait...*');
			fs.writeFile('./database/background.json', JSON.stringify(bg, null, 2), (err) => {
				if (err) {
					message.channel.send(`Something went wrong.. \`${err}\`. Please report it to the support server.`);
				}
				else {
					message.channel.send('Your background image has been set!').then(()=>{ h.delete();});
				}
			});
			return;
		}
		if(!bg[message.author.id]) {
			bg[message.author.id] = {
				background: 'https://cdn.discordapp.com/attachments/710732218254753842/717194057516056576/3430.jpg',
			};
		}
		const newBg = message.attachments.first();
		if(!newBg) return message.reply(`You need to upload the image to set new background.\n\`${prefixes[message.guild.id]}bg default\` for default background`);
		bg[message.author.id].background = newBg.url;
		const h = await message.channel.send('*Please Wait...*');
		fs.writeFile('./database/background.json', JSON.stringify(bg, null, 2), (err) => {
			if (err) {
				message.channel.send(`Something went wrong.. \`${err}\`. Please report it to the support server.`);
			}
			else {
				message.channel.send('Your background image has been set!').then(()=>{ h.delete();});
			}
		});
	},
};