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
const { checkPlayerExist, getUserDataAndCreate, createAllDataForNewUser } = require('../../functions');

module.exports = {
	name: 'bag',
	description: 'Check what is in your beg',
	category: '[👹] rpg',
	example: `${bot_prefix}bag`,
	run: async (client, message) => {
		const user = message.author.id;

		const Bag = Models.Bag();

		await createAllDataForNewUser(user);

		const bag = await getUserDataAndCreate(Bag, user);

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const embed = new Discord.MessageEmbed();

		embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		embed.setColor('RANDOM');
		embed.setThumbnail(client.user.avatarURL());
		embed.setDescription('Your Weapons');

		bag.get('sword') === 0 && bag.get('staff') === 0 && bag.get('shield') === 0 && bag.get('bow') === 0 && bag.get('fire-sword') === 0 ? embed.addField('Your bag is empty', `**•** Buy one in \`${prefixes[message.guild.id]}market\``) : '';
		bag.get('sword') === 1 ? embed.addField('<:sword:868105110100779028> Sword', '**• +10 Physical Attack**') : '';
		bag.get('staff') === 1 ? embed.addField('<:staff:868105110138519582> Staff', '**• +10 Magical Attack**') : '';
		bag.get('shield') === 1 ? embed.addField('🛡️ Shield', '**• +5 Physical Resistance\n• +5 Magical Resistance**') : '';
		bag.get('bow') === 1 ? embed.addField('🏹 Bow', '**• +6 Physical Attack\n• +4 physical Resistance\nPassive: Increase 5% speed every turn**') : '';
		bag.get('fire-sword') === 1 ? embed.addField('<a:firesword:868105110176301086> Fire-Sword', '**• +5 Physical Attack\n• +5 Magical Attack\nPassive: Increase 80% of your overall damage for the first turn**') : '';

		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));

		message.reply({ embeds: [embed] });
	},
};