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

const minerals = require('../../database/mineral.json');
const { bot_prefix } = require('../../config.json');
const phrases = ['I found a manganese!', 'What is this!?', 'what is this shiny thing?'];
const successRates = 0.55;
const breakRates = 0.4;
const Models = require('../../create-model');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');


module.exports = {
	name: 'dig',
	category: '[🎩] economy',
	description: 'Go digging and find out what will you find',
	example: `${bot_prefix}dig`,
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

		if (inventory.get('pickaxe') === 0) return message.reply(`**${message.author.username}**, You don't have a **pickaxe**!`);

		const timer = await cooldown('dig', user, 40000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** until you can go digging again.`);
		}
		else {
			await Cooldown.update({ dig: Date.now() }, { where: { userId: user } });

			if (success) {
				const mineralID = Math.floor(Math.random() * 10) + 1;
				let rarity;

				if (mineralID < 5) {
					rarity = 'iron';

					await Achievement.update({ iron: achievement.get('iron') + 1 }, { where: { userId: user } });
					await Inventory.update({ iron: inventory.get('iron') + 1 }, { where: { userId: user } });
				}
				else if (mineralID < 8) {
					rarity = 'copper';

					await Achievement.update({ copper: achievement.get('copper') + 1 }, { where: { userId: user } });
					await Inventory.update({ copper: inventory.get('copper') + 1 }, { where: { userId: user } });
				}
				else if (mineralID < 9) {
					rarity = 'gold';

					await Achievement.update({ gold: achievement.get('gold') + 1 }, { where: { userId: user } });
					await Inventory.update({ gold: inventory.get('gold') + 1 }, { where: { userId: user } });
				}
				else if (mineralID < 10) {
					rarity = 'bauxite';

					await Achievement.update({ bauxite: achievement.get('bauxite') + 1 }, { where: { userId: user } });
					await Inventory.update({ bauxite: inventory.get('bauxite') + 1 }, { where: { userId: user } });
				}
				else {
					rarity = 'manganese';

					const phrase = phrases[Math.floor(Math.random() * phrases.length)];

					message.reply(`**${message.author.username}**\nA shiny stone has appreared! Type this phrase fast!\n\`${phrase}\``);

					const filter = m => m.author.id === message.author.id;

					const input = await message.channel.awaitMessages({
						filter,
						max: 1,
						time: 30000,
					});

					if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
						await Achievement.update({ manganese: achievement.get('manganese') + 1 }, { where: { userId: user } });
						await Inventory.update({ manganese: inventory.get('manganese') + 1 }, { where: { userId: user } });
					}
					else {
						if (breaks) {
							await Inventory.update({ dig: inventory.get('pickaxe') - 1 }, { where: { userId: user } });

							message.reply(`**${message.author.username}**, you failed to get the shiny stone and your **⛏️ pickaxe** has broken..`);
						}
						else {
							message.reply(`**${message.author.username}**, you failed to get a shiny stone..`);
						}
						return;
					}
				}

				await Achievement.update({ dig: achievement.get('dig') + 1 }, { where: { userId: user } });

				const mineral = minerals[rarity];

				message.reply(`**${message.author.username}**, You went into the cave and you found a ${mineral.symbol}.`);
			}
			else {
				message.reply(`**${message.author.username}**, You went to the cave but you didn't find anything..`);
			}
		}
	},
};