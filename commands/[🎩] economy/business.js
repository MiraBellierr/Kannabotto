/* eslint-disable no-inline-comments */
/* eslint-disable no-lonely-if */
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

const { bot_prefix } = require('../../config.json');
const breakrate = 0.4;
const Models = require('../../create-model');
const { checkGuildDisable, guildDisableMessage, checkBlacklist, blacklistMessage, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'business',
	aliases: ['bs', 'bsn', 'bn'],
	category: '[🎩] economy',
	description: 'Earn extra money by doing some businesses',
	example: `${bot_prefix}business`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Achievement = Models.Achievement();
		const Economy = Models.Economy();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		const inventory = await getUserDataAndCreate(Inventory, user);
		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		if (inventory.get('laptop') === 0) return message.reply(`**${message.author.username}**, you don't have a laptop to do a business.`);

		const timer = await cooldown('business', user, 30000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, Please wait **${timer.seconds}s** until you can do a business again.`);
		}
		else {
			await Cooldown.update({ business: Date.now() }, { where: { userId: user } });

			const breaks = Math.random() < breakrate;
			const gain = Math.floor(Math.random() * 50) + 3;
			const multiplier = Math.floor((inventory.get('bunny') / 100) * gain);
			const random = gain + multiplier;

			await message.reply(`**${message.author.username}**\n__What kind of business you want to do?__\n\`1\` - Youtube\n\`2\` - Website\n\`3\` - Sell product\n\`4\` - Social Media influencer`);

			const filter = u => u.author.id === message.author.id;

			const input = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
			});

			if (!input.size) {
				return message.reply(`**${message.author.username}**, shutting down the laptop...`);
			}
			if (input.first().content === '1') {
				// 60% win rate
				await Achievement.update({ youtube: achievement.get('youtube') + 1 }, { where: { userId: user } });

				const success = Math.random() < 0.6;
				const sub = Math.floor((Math.random() * 1000) + 1);

				if (success) {
					await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });

					return message.reply(`**${message.author.username}**, you gained ${sub} subscribers and got <a:jasminecoins:868105109748469780> **${random.toLocaleString()}** from the ads.`);
				}
				else {
					if (breaks) {
						await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });

						return message.reply(`**${message.author.username}**, it seems like your content is not interesting and no one is watching it. You gained nothing and your **<:laptop:868105109379379221> laptop** has broken.`);
					}
					else {
						return message.reply(`**${message.author.username}**, it seems like your content is not interesting and no one is watching it. You gained nothing.`);
					}
				}
			}
			else if (input.first().content === '2') {
				await Achievement.update({ website: achievement.get('website') + 1 }, { where: { userId: user } });

				const success = Math.random() < 0.6;

				if (success) {
					await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });

					return message.reply(`**${message.author.username}**, you created a website and sold it for <a:jasminecoins:868105109748469780> **${random.toLocaleString()}**`);
				}
				else {
					if (breaks) {
						await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });

						return message.reply(`**${message.author.username}**, you created a website but no one is willing to buy it, sad and your **<:laptop:868105109379379221> laptop** has broken.`);
					}
					else {
						return message.reply(`**${message.author.username}**, you created a website but no one is willing to buy it, sad.`);
					}
				}
			}
			else if (input.first().content === '3') {
				await Achievement.update({ product: achievement.get('product') + 1 }, { where: { userId: user } });

				const success = Math.random() < 0.6;

				if (success) {
					const products = ['phone', 'hat', 'T-shirt', 'discord bot', 'blanket'];
					const product = products[Math.floor(Math.random() * products.length)];

					await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });

					return message.reply(`**${message.author.username}**, you sold a ${product} on Amazon and earned <a:jasminecoins:868105109748469780> **${random.toLocaleString()}** from it.`);
				}
				else {
					if (breaks) {
						await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });

						return message.reply(`**${message.author.username}**, you ended up getting negative reviews from the customers and because of that, you gave them a full refund.. and your **<:laptop:868105109379379221> laptop** has broken.`);
					}
					else {
						return message.reply(`**${message.author.username}**, you ended up getting negative reviews from the customers and because of that, you gave them a full refund..`);
					}
				}
			}
			else if (input.first().content === '4') {
				await Achievement.update({ media: achievement.get('media') + 1 }, { where: { userId: user } });

				const success = Math.random() < 0.6;

				if (success) {
					const medias = ['Facebook', 'Discord', 'Twitter', 'Instagram'];
					const media = medias[Math.floor(Math.random() * medias.length)];

					await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });

					return message.reply(`**${message.author.username}**, you promoted products on ${media} and earned <a:jasminecoins:868105109748469780> **${random.toLocaleString()}** from it.`);
				}
				else {
					if (breaks) {
						await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });

						return message.reply(`**${message.author.username}**, you promoted products but you are not popular enough. You got nothing from it and your **<:laptop:868105109379379221> laptop** has broken.`);
					}
					else {
						return message.reply(`**${message.author.username}**, you promoted products but you are not popular enough. You got nothing from it.`);
					}
				}
			}
			else {
				return message.reply(`**${message.author.username}**, that job is not on the list.`);
			}
		}
	},
};