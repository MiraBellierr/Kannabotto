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

module.exports = {
	name: 'market',
	description: 'Weapon shop',
	category: '[👹] rpg',
	example: `${bot_prefix}market`,
	run: async (client, message) => {
		const user = message.author.id;

		const Bag = Models.Bag();
		const Player = Models.Player();
		const Economy = Models.Economy();

		if (!await Bag.findOne({ where: { userId: user } })) {
			await Bag.create({
				userId: user,
			});
		}
		const bag = await Bag.findOne({ where: { userId: user } });


		const player = await Player.findOne({ where: { userId: user } });


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('RANDOM')
			.setThumbnail(client.user.displayAvatarURL())
			.setTitle(`Weapon Market - Your balance: ${(economy.get('balance')).toLocaleString()}`)
			.addFields(
				{ name: bag.get('sword') === 0 ? '<:sword:868105110100779028> Sword - <a:jasminecoins:868105109748469780> 5,000' : '~~<:sword:868105110100779028> Sword - <a:jasminecoins:868105109748469780> 5,000~~ *Bought*', value: '**• +10 Physical Attack**' },
				{ name: bag.get('staff') === 0 ? '<:staff:868105110138519582> Staff - <a:jasminecoins:868105109748469780> 5,000' : '~~<:staff:868105110138519582> Staff - <a:jasminecoins:868105109748469780> 5,000~~ *Bought*', value: '**• +10 Magical Attack**' },
				{ name: bag.get('shield') === 0 ? '🛡️ Shield - <a:jasminecoins:868105109748469780> 8,000' : '~~🛡️ Shield - <a:jasminecoins:868105109748469780> 8,000~~ *Bought*', value: '**• +5 Physical Resistance\n• +5 Magical Resistance**' },
				{ name: bag.get('bow') === 0 ? '🏹 Bow - <a:jasminecoins:868105109748469780> 10,000' : '~~🏹 Bow - <a:jasminecoins:868105109748469780> 10,000~~ *Bought*', value: '**• +6 Physical Attack\n• +4 physical Resistance\nPassive: Increase 5% speed every turn**' },
				{ name: bag.get('swordFire') === 0 ? '<a:firesword:868105110176301086> Fire-Sword - <a:jasminecoins:868105109748469780> 10,000' : '~~<a:firesword:868105110176301086> Fire-Sword - <a:jasminecoins:868105109748469780> 10,000~~ *Bought*', value: '**• +5 Physical Attack\n• +5 Magical Attack\nPassive: Deals 80% of your overall damage for the first turn**' },

			);


		message.channel.send(embed);
	},
};