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
const Discord = require('discord.js');
const phrases = ['Wow, a whale!', 'OMG, a whale!', 'Oh no, a whale'];
const successRates = 0.55;
const breakRates = 0.4;
const Models = require('../../create-model.js');


module.exports = {
	name: 'fish',
	aliases: ['cast'],
	category: '[🎩] economy',
	description: 'Go fishing to get extra rewards',
	example: `${bot_prefix}fish`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;
			const breaks = Math.random() < breakRates;
			const success = Math.random() < successRates;

			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
			const Cooldown = Models.Cooldown();
			const Inventory = Models.Inventory();
			const Economy = Models.Economy();
			const Achievement = Models.Achievement();

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


			if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
				await Blacklist.create({
					userId: message.author.id,
				});
			}
			const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

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


			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			if (inventory.get('fishingRod') === 0) return message.channel.send(`**${message.author.username}**, You don't have a **fishing rod**!`);


			const timeOut = 40000;

			const lastFish = await cooldown.get('fish');
			if (lastFish !== null && timeOut - (Date.now() - lastFish) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastFish));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** until you can go fishing again.`);
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
						await Achievement.update({ commonFish: achievement.get('commonFish') + 1 }, { where: { userId: user } });
						await Inventory.update({ commonFish: inventory.get('commonFish') + 1 }, { where: { userId: user } });
					}
					else if (fishID < 9) {
						rarity = 'uncommon';
						await Achievement.update({ uncommonFish: achievement.get('uncommonFish') + 1 }, { where: { userId: user } });
						await Inventory.update({ uncommonFish: inventory.get('uncommonFish') + 1 }, { where: { userId: user } });
					}
					else if (fishID < 10) {
						rarity = 'rare';
						await Achievement.update({ rareFish: achievement.get('rareFish') + 1 }, { where: { userId: user } });
						await Inventory.update({ rareFish: inventory.get('rareFish') + 1 }, { where: { userId: user } });
					}
					else {
						rarity = 'legendary';
						const phrase = phrases[Math.floor(Math.random() * phrases.length)];
						message.channel.send(`**${message.author.username}**\nA wild whale has appreared! Type this phrase fast!\n\`${phrase}\``);
						const filter = m => m.author.id === message.author.id;
						const input = await message.channel.awaitMessages(filter, {
							max: 1,
							time: 30000,
						});
						if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
							await Achievement.update({ legendaryFish: achievement.get('legendaryFish') + 1 }, { where: { userId: user } });
							await Inventory.update({ legendaryFish: inventory.get('legendaryFish') + 1 }, { where: { userId: user } });
						}
						else {
							if (breaks) {
								await Inventory.update({ fishingRod: inventory.get('fishingRod') - 1 }, { where: { userId: user } });
								message.channel.send(`**${message.author.username}**, A whale got away and your **🎣 fishing-rod** has broken..`);
							}
							else {
								message.channel.send(`**${message.author.username}**, A whale got away..`);
							}
							return;
						}
					}
					await Achievement.update({ fish: achievement.get('fish') + 1 }, { where: { userId: user } });
					const fish = fishes[rarity];
					message.channel.send(`**${message.author.username}**, You went to the river and you caught a ${fish.symbol}.`);
				}
				else {
					message.channel.send(`**${message.author.username}**, You went to the river but you didn't get anything.. even a junk..`);
				}
			}
		});
	},
};
