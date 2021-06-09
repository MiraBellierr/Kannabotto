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

module.exports = {
	name: 'info',
	category: '[👹] rpg',
	description: 'Get an information about a boss',
	example: `${bot_prefix}info <boss name | boss ID>`,
	usage: '<boss name | boss ID>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Player = Models.Player();

		const player = await Player.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);

		if (!args.length) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}info <boss name | boss ID>\`.`);
		const character = [];
		for (let i = 0; i < characters.length; i++) {
			if (characters[i].id === args[0] || characters[i].name.toLowerCase().includes(args.join(' ').toLowerCase())) {
				character.push(characters[i]);
			}
		}
		if (!character.length) return message.channel.send(`**${message.author.username}**, I didn't found this character in my database.`);
		const embed = new Discord.MessageEmbed()
			.setAuthor('Boss Info', message.author.displayAvatarURL({ dynamic: true }))
			.setColor('RANDOM')
			.setImage(character[0].image)
			.setTitle(character[0].name)
			.addField('General', `**• ID:** ${character[0].id}\n**• From:** ${character[0].from}`, true)
			.addField('Stats', `**• Health:** ${character[0].health}\n**• Physical Attack:** ${character[0].physical_attack}\n**• Magical Attack:** ${character[0].magical_attack}\n**• Physical Resistance:** ${character[0].physical_resistance}\n**• Magical Resistance:** ${character[0].magical_resistance}\n**• Speed:** ${character[0].speed}`, true);

		message.channel.send(embed);
	},
};