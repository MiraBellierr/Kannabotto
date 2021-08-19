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
const { getMember, checkBlacklist, checkGuildDisable, guildDisableMessage, blacklistMessage, getUserDataAndCreate, createAllDataForNewUser } = require('../../functions');
const Models = require('../../create-model');

module.exports = {
	name: 'balance',
	aliases: ['bal', 'money', 'cash'],
	category: '[🎩] economy',
	description: 'Shows user balance',
	example: `${bot_prefix}balance [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' '));
		const user = member.user;
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();


		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user.id);

		const inventory = await getUserDataAndCreate(Inventory, user.id);
		const economy = await getUserDataAndCreate(Economy, user.id);

		const moneyEmbed = new Discord.MessageEmbed()
			.setAuthor(`${user.username}'s balance`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setColor('YELLOW')
			.setFooter('https://patreon.com/kannacoco', client.user.displayAvatarURL())
			.setDescription(`**Pocket:** <a:jasminecoins:868105109748469780> ${economy.get('balance').toLocaleString()}\n**Bank:** <a:jasminecoins:868105109748469780> ${economy.get('bank').toLocaleString()}/${economy.get('totalBank').toLocaleString()}\n**Total:** <a:jasminecoins:868105109748469780> ${(economy.get('balance') + economy.get('bank')).toLocaleString()}\n**Multiplier:** ${inventory.get('bunny').toFixed(2)}%`);

		message.reply({ embeds: [moneyEmbed] });
	},
};