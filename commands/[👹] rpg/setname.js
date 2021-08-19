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
const { createAllDataForNewUser, checkPlayerExist } = require('../../functions');

module.exports = {
	name: 'setname',
	aliases: ['name', 'sn'],
	description: 'Set a name of your character',
	category: '[👹] rpg',
	example: `${bot_prefix}setname <name>`,
	usage: '<name>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Player = Models.Player();

		await createAllDataForNewUser(user);

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!checkPlayerExist(user)) return message.reply({ embeds: [result] });

		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}setname <name>\`.`);

		const name = args.join(' ');

		await Player.update({ name: name }, { where: { userId: user } });

		message.reply(`**${message.author.username}**, Your character name has been set!`);
	},
};