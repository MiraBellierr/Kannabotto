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

const fishes = require('../../database/fish.json');
const { bot_prefix } = require('../../config.json');
const phrases = ['Wow, a whale!', 'OMG, a whale!', 'Oh no, a whale'];
const successRates = 0.55;
const breakRates = 0.4;
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');


module.exports = {
	name: 'fish',
	aliases: ['cast'],
	category: '[🎩] economy',
	description: 'Go fishing to get extra rewards',
	example: `${bot_prefix}fish`,
	run: async (client, message) => {
		const user = message.author.id;
		const breaks = Math.random() < breakRates;
		const success = Math.random() < successRates;

		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const inventory = await getUserDataAndCreate(Inventory, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		if (inventory.get('fishing-rod') === 0) return message.reply(`**${message.author.username}**, You don't have a **fishing rod**!`);

		const timer = await cooldown('fish', user, 40000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** until you can go fishing again.`);
		}
		else {
			await Cooldown.update({ fish: Date.now() }, { where: { userId: user } });

			if (success) {
				const fishID = Math.floor(Math.random() * 10) + 1;
				let rarity;

				if (fishID < 5) {
					rarity = 'junk';

					await Achievement.update({ junk: achievement.get('junk') + 1 }, { where: { userId: user } });
					await Inventory.update({ junk: inventory.get('junk') + 1 }, { where: { userId: user } });
				}
				else if (fishID < 8) {
					rarity = 'common';

					await Achievement.update({ tuna: achievement.get('tuna') + 1 }, { where: { userId: user } });
					await Inventory.update({ tuna: inventory.get('tuna') + 1 }, { where: { userId: user } });
				}
				else if (fishID < 9) {
					rarity = 'uncommon';

					await Achievement.update({ goldfish: achievement.get('goldfish') + 1 }, { where: { userId: user } });
					await Inventory.update({ goldfish: inventory.get('goldfish') + 1 }, { where: { userId: user } });
				}
				else if (fishID < 10) {
					rarity = 'rare';

					await Achievement.update({ squid: achievement.get('squid') + 1 }, { where: { userId: user } });
					await Inventory.update({ squid: inventory.get('squid') + 1 }, { where: { userId: user } });
				}
				else {
					rarity = 'legendary';

					const phrase = phrases[Math.floor(Math.random() * phrases.length)];

					message.reply(`**${message.author.username}**\nA wild whale has appreared! Type this phrase fast!\n\`${phrase}\``);

					const filter = m => m.author.id === message.author.id;

					const input = await message.channel.awaitMessages({
						filter,
						max: 1,
						time: 30000,
					});

					if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
						await Achievement.update({ whale: achievement.get('whale') + 1 }, { where: { userId: user } });
						await Inventory.update({ whale: inventory.get('whale') + 1 }, { where: { userId: user } });
					}
					else {
						if (breaks) {
							await Inventory.update({ 'fishing-rod': inventory.get('fishing-rod') - 1 }, { where: { userId: user } });

							message.reply(`**${message.author.username}**, A whale got away and your **🎣 fishing-rod** has broken..`);
						}
						else {
							message.reply(`**${message.author.username}**, A whale got away..`);
						}
						return;
					}
				}

				await Achievement.update({ fish: achievement.get('fish') + 1 }, { where: { userId: user } });

				const fish = fishes[rarity];

				message.reply(`**${message.author.username}**, You went to the river and you caught a ${fish.symbol}.`);
			}
			else {
				message.reply(`**${message.author.username}**, You went to the river but you didn't get anything.. even a junk..`);
			}
		}
	},
};