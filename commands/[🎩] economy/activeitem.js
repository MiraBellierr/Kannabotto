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
const { getMember, guildDisableMessage, blacklistMessage, getUserDataAndCreate, createAllDataForNewUser, checkGuildDisable, checkBlacklist } = require('../../functions');
const Models = require('../../create-model');

module.exports = {
	name: 'activeitem',
	aliases: ['ai'],
	category: '[🎩] economy',
	description: 'Shows user active items',
	example: `${bot_prefix}active [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		import('parse-ms').then(async ms => {
			const member = await getMember(message, args.join(' '));
			const user = member.user;

			const Cooldown = Models.Cooldown();

			if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
			if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

			const cooldown = await getUserDataAndCreate(Cooldown, user.id);

			await createAllDataForNewUser(user.id);

			const timeoutGuard = 4.32e+7;
			const timeoutBear = 3.6e+6;
			const guard = await cooldown.get('guard');
			const guardTime = timeoutGuard - (Date.now() - guard);
			const guardObj = ms.default(guardTime);
			const bear = await cooldown.get('bear');
			const bearTime = timeoutBear - (Date.now() - bear);
			const bearObj = ms.default(bearTime);

			const embed = new Discord.MessageEmbed()
				.setAuthor(`${user.username}'s active item`, user.displayAvatarURL({ dynamic: true }))
				.setColor('#CD1C6C')
				.setTitle('Active item:')
				.setTimestamp()
				.setDescription(`${(guard === null && guardTime < 1) && (bear === null && bearTime < 1) ? 'You have no active item' : ''}${guard !== null && guardTime > 0 ? `**• <:bearguard:868105110289543188> Guard** - ${guardObj.hours}h${guardObj.minutes}m${guardObj.seconds}s left` : ''}${bear !== null && bearTime > 0 ? `\n**• <a:angrybear:868105109853327370> Bear** -- ${bearObj.minutes}m${bearObj.seconds}s left` : ''}`);

			message.reply({ embeds: [embed] });
		});
	},
};