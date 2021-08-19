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

const animals = require('../../database/animal.json');
const { bot_prefix } = require('../../config.json');
const phrases = ['Wow, a dragon!', 'OMG, a dragon!', 'Oh no, a dragon'];
const successRates = 0.55;
const breakRates = 0.4;
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'hunt',
	category: '[🎩] economy',
	description: 'Go hunting and sell them for coins',
	example: `${bot_prefix}hunt`,
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

		if (inventory.get('hunting-rifle') === 0) return message.reply(`**${message.author.username}**, You don't have a **hunting rifle**!`);

		const timer = await cooldown('hunt', user, 40000);
		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can hunt again.`);
		}
		else {
			await Cooldown.update({ hunt: Date.now() }, { where: { userId: user } });

			if (success) {
				const animalID = Math.floor(Math.random() * 10) + 1;
				let rarity;

				if (animalID < 5) {
					rarity = 'common';

					await Achievement.update({ rabbit: achievement.get('rabbit') + 1 }, { where: { userId: user } });
					await Inventory.update({ rabbit: inventory.get('rabbit') + 1 }, { where: { userId: user } });
				}
				else if (animalID < 8) {
					rarity = 'uncommon';

					await Achievement.update({ turkey: achievement.get('turkey') + 1 }, { where: { userId: user } });
					await Inventory.update({ turkey: inventory.get('turkey') + 1 }, { where: { userId: user } });
				}
				else if (animalID < 9) {
					rarity = 'rare';

					await Achievement.update({ pig: achievement.get('pig') + 1 }, { where: { userId: user } });
					await Inventory.update({ pig: inventory.get('pig') + 1 }, { where: { userId: user } });
				}
				else if (animalID < 10) {
					rarity = 'mythical';

					await Achievement.update({ deer: achievement.get('deer') + 1 }, { where: { userId: user } });
					await Inventory.update({ deer: inventory.get('deer') + 1 }, { where: { userId: user } });
				}
				else {
					rarity = 'legendary';

					const phrase = phrases[Math.floor(Math.random() * phrases.length)];

					message.reply(`**${message.author.username}**\nA wild dragon has appreared! Type this phrase fast!\n\`${phrase}\``);

					const filter = m => m.author.id === message.author.id;

					const input = await message.channel.awaitMessages(filter, {
						max: 1,
						time: 30000,
					});

					if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
						await Achievement.update({ dragon: achievement.get('dragon') + 1 }, { where: { userId: user } });
						await Inventory.update({ dragon: inventory.get('dragon') + 1 }, { where: { userId: user } });
					}
					else {
						if (breaks) {
							await Inventory.update({ 'hunting-rifle': inventory.get('hunting-rifle') - 1 }, { where: { userId: user } });

							message.reply(`**${message.author.username}**, A dragon got away and your ** hunting-rifle** has broken..`);
						}
						else {
							message.reply(`**${message.author.username}**, A dragon got away..`);
						}
						return;
					}
				}

				await Achievement.update({ hunt: achievement.get('hunt') + 1 }, { where: { userId: user } });

				const animal = animals[rarity];

				message.reply(`**${message.author.username}**, You went to the woods and you killed a ${animal.symbol}.`);
			}
			else {
				message.reply(`**${message.author.username}**, You went to the woods but you didn't get anything.. sad.`);
			}
		}
	},
};