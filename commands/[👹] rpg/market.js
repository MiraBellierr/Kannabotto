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
const { checkPlayerExist, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name: 'market',
	description: 'Weapon shop',
	category: '[👹] rpg',
	example: `${bot_prefix}market`,
	run: async (client, message) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Economy = Models.Economy();

		const economy = await getUserDataAndCreate(Economy, user);

		let weapons = [];

		client.weapons.forEach(weapon => {
			weapons.push(weapon);
		});

		weapons = weapons.map(element => `**• ${element.emoji} ${element.name}** - <a:jasminecoins:868105109748469780> ${element.price.toLocaleString()} - ${element.ability} ${element.passive ? `\n(${element.passive})` : ''}`);
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('RANDOM')
			.setTimestamp()
			.addField(`Kanna Weapon Market - Your balance: <a:jasminecoins:868105109748469780> ${(economy.get('balance')).toLocaleString()}`, weapons.join('\n'))
			.setThumbnail('https://cdn.discordapp.com/attachments/716107950032420897/723881420585697300/ezgif-3-b250403f94db.gif')
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));

		message.reply({ embeds: [embed] });
	},
};