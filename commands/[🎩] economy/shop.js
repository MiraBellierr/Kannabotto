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
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');

module.exports = {
	name:'shop',
	aliases: ['stall', 'store'],
	category: '[🎩] economy',
	description: 'Come and see what is inside that you like to buy',
	example: `${bot_prefix}shop`,
	run: async (client, message) => {

		const user = message.author.id;
		const Economy = Models.Economy();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);

		let items = [];

		client.items.forEach(item => {
			if (item.info) {
				items.push(item);
			}
		});

		items = items.map(element => `**• ${element.emoji} ${element.name}** - <a:jasminecoins:868105109748469780> ${element.price.toLocaleString()} - ${element.info}`);

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.addField(`Kanna shop - Your balance: <a:jasminecoins:868105109748469780> ${(economy.get('balance')).toLocaleString()}`, `${items.join('\n')}`)
			.setTimestamp()
			.setColor('RANDOM')
			.setThumbnail('https://cdn.discordapp.com/attachments/716107950032420897/723881420585697300/ezgif-3-b250403f94db.gif')
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));


		message.reply({ embeds: [embed] });
	},
};