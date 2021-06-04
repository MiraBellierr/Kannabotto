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
const Discord = require('discord.js');
const breakrates = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
const Models = require('../../create-model');

module.exports = {
	name: 'business',
	aliases: ['bs', 'bsn', 'bn'],
	category: '[🎩] economy',
	description: 'Earn extra money by doing some businesses',
	example: `${bot_prefix}business`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
			const Cooldown = Models.Cooldown();
			const Inventory = Models.Inventory();
			const Achievement = Models.Achievement();
			const Economy = Models.Economy();

			if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
				await Disable.create({
					guildId: message.guild.id,
				});
			}
			const disable = await Disable.findOne({ where: { guildId: message.guild.id } });

			const warn = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('This command is disabled for this guild')
				.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();

			if (disable.get('economy') === 1) return message.channel.send(warn);


			if (!await Blacklist.findOne({ where: { userId: user } })) {
				await Blacklist.create({
					userId: user,
				});
			}
			const blacklist = await Blacklist.findOne({ where: { userId: user } });

			const warn1 = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('You have been blacklisted from this command')
				.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();


			if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


			if (!await Cooldown.findOne({ where: { userId: user } })) {
				await Cooldown.create({
					userId: user,
				});
			}
			const cooldown = await Cooldown.findOne({ where: { userId: user } });


			if (!await Inventory.findOne({ where: { userId: user } })) {
				await Inventory.create({
					userId: user,
				});
			}
			const inventory = await Inventory.findOne({ where: { userId: user } });


			if (!await Economy.findOne({ where: { userId: user } })) {
				await Economy.create({
					userId: user,
				});
			}
			const economy = await Economy.findOne({ where: { userId: user } });


			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			if (inventory.get('laptop') === 0) return message.channel.send(`**${message.author.username}**, you don't have a laptop to do a business.`);
			const timeOut = 30000;
			const businessTimeout = cooldown.get('business');
			if (businessTimeout !== null && timeOut - (Date.now() - businessTimeout) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - businessTimeout));
				message.channel.send(`**${message.author.username}**, Please wait **${timeObj.seconds}s** until you can do a business again.`);
			}
			else {
				await Cooldown.update({ business: Date.now() }, { where: { userId: user } });
				const breakrate = breakrates[Math.floor(Math.random() * breakrates.length)];
				const gain = Math.floor(Math.random() * 50) + 3;
				const multiplier = Math.floor((inventory.get('bunny') / 100) * gain);
				const random = gain + multiplier;
				await message.channel.send(`**${message.author.username}**\n__What kind of business you want to do?__\n\`1\` - Youtube\n\`2\` - Website\n\`3\` - Sell product\n\`4\` - Social Media influencer`);
				const filter = u => u.author.id === message.author.id;
				const input = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
				});
				if (!input.size) {
					return message.channel.send(`**${message.author.username}**, shutting down the laptop...`);
				}
				if (input.first().content === '1') {
				// 60% win rate
					const chances = [0, 1, 1, 1, 0];
					await Achievement.update({ youtube: achievement.get('youtube') + 1 }, { where: { userId: user } });
					const chance = chances[Math.floor(Math.random() * chances.length)];
					const sub = Math.floor((Math.random() * 1000) + 1);
					if (chance === 1) {
						await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });
						return message.channel.send(`**${message.author.username}**, you gained ${sub} subscribers and got <a:JasmineCoins:718067589984551042> **${random.toLocaleString()}** from the ads.`);
					}
					if (chance === 0) {
						if (breakrate === 1) {
							await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });
							return message.channel.send(`**${message.author.username}**, it seems like your content is not interesting and no one is watching it. You gained nothing and your **<:laptop:843067880882700318> laptop** has broken.`);
						}
						else {
							return message.channel.send(`**${message.author.username}**, it seems like your content is not interesting and no one is watching it. You gained nothing.`);
						}
					}
				}
				else if (input.first().content === '2') {
					const chances = [0, 1, 1, 1, 0];
					await Achievement.update({ website: achievement.get('website') + 1 }, { where: { userId: user } });

					const chance = chances[Math.floor(Math.random() * chances.length)];
					if (chance === 1) {
						await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });
						return message.channel.send(`**${message.author.username}**, you created a website and sold it for <a:JasmineCoins:718067589984551042> **${random.toLocaleString()}**`);
					}
					if (chance === 0) {
						if (breakrate === 1) {
							await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });
							return message.channel.send(`**${message.author.username}**, you created a website but no one is willing to buy it, sad and your **<:laptop:843067880882700318> laptop** has broken.`);
						}
						else {
							return message.channel.send(`**${message.author.username}**, you created a website but no one is willing to buy it, sad.`);
						}
					}
				}
				else if (input.first().content === '3') {
					const chances = [0, 1, 1, 1, 0];
					await Achievement.update({ product: achievement.get('product') + 1 }, { where: { userId: user } });
					const chance = chances[Math.floor(Math.random() * chances.length)];
					if (chance === 1) {
						const products = ['phone', 'hat', 'T-shirt', 'discord bot', 'blanket'];
						const product = products[Math.floor(Math.random() * products.length)];
						await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });
						return message.channel.send(`**${message.author.username}**, you sold a ${product} on Amazon and earned <a:JasmineCoins:718067589984551042> **${random.toLocaleString()}** from it.`);
					}
					if (chance === 0) {
						if (breakrate === 1) {
							await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });
							return message.channel.send(`**${message.author.username}**, you ended up getting negative reviews from the customers and because of that, you gave them a full refund.. and your **<:laptop:843067880882700318> laptop** has broken.`);
						}
						else {
							return message.channel.send(`**${message.author.username}**, you ended up getting negative reviews from the customers and because of that, you gave them a full refund..`);
						}
					}
				}
				else if (input.first().content === '4') {
					const chances = [0, 1, 1, 1, 0];
					await Achievement.update({ media: achievement.get('media') + 1 }, { where: { userId: user } });
					const chance = chances[Math.floor(Math.random() * chances.length)];
					if (chance === 1) {
						const medias = ['Facebook', 'Discord', 'Twitter', 'Instagram'];
						const media = medias[Math.floor(Math.random() * medias.length)];
						await Economy.update({ balance: economy.get('balance') + random }, { where: { userId: user } });
						return message.channel.send(`**${message.author.username}**, you promoted products on ${media} and earned <a:JasmineCoins:718067589984551042> **${random.toLocaleString()}** from it.`);
					}
					if (chance === 0) {
						if (breakrate === 1) {
							await Inventory.update({ laptop: inventory.get('laptop') - 1 }, { where: { userId: user } });
							return message.channel.send(`**${message.author.username}**, you promoted products but you are not popular enough. You got nothing from it and your **<:laptop:843067880882700318> laptop** has broken.`);
						}
						else {
							return message.channel.send(`**${message.author.username}**, you promoted products but you are not popular enough. You got nothing from it.`);
						}
					}
				}
				else {
					return message.channel.send(`**${message.author.username}**, that job is not on the list.`);
				}
			}
		});
	},
};