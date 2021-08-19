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
const { checkPlayerExist, createAllDataForNewUser, getUserDataAndCreate, equipWeapon } = require('../../functions');

module.exports = {
	name: 'equip',
	description: 'equip the weapon that is in your bag',
	category: '[👹] rpg',
	example: `${bot_prefix}equip <weapon | none>`,
	usage: '<weapon | none>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Player = Models.Player();

		await createAllDataForNewUser(user);

		const player = await getUserDataAndCreate(Player, user);

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });
		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}equip <weapon>\`.`);

		const content = args[0].toLowerCase();

		const ability = {
			'sword': { physicalAttack: player.get('physicalAttack') + 10 },
			'staff': { magicalAttack: player.get('magicalAttack') + 10 },
			'shield': { physicalResistance: player.get('physicalResistance') + 5, magicalResistance: player.get('magicalResistance') + 5 },
			'bow': { physicalAttack: player.get('physicalAttack') + 6, physicalResistance: player.get('physicalResistance') + 4 },
			'fire-sword': { physicalAttack: player.get('physicalAttack') + 5, magicalAttack: player.get('magicalAttack') + 5 },
		};

		if (client.weapons.has(content)) {
			const weapon = client.weapons.get(content);
			await equipWeapon(message, weapon.name, weapon.emoji, ability[weapon.name]);
		}
		else {
			message.reply(`**${message.author.username}**, There is no weapon with that name.`);
		}
	},
};