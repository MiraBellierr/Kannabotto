const animals = require('../../database/animal.json');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const phrases = ['Wow, a dragon!', 'OMG, a dragon!', 'Oh no, a dragon'];
const successRates = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const breakRates = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
const Models = require('../../create-model.js');

module.exports = {
	name: 'hunt',
	category: '[🎩] economy',
	description: 'Go hunting and sell them for coins',
	example: `${bot_prefix}hunt`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;
			const breakRate = breakRates[Math.floor(Math.random() * breakRates.length)];
			const successRate = successRates[Math.floor(Math.random() * successRates.length)];

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

			if (inventory.get('huntingRifle') === 0) return message.channel.send(`**${message.author.username}**, You don't have a **hunting rifle**!`);

			const timeOut = 40000;

			const lastHunt = await cooldown.get('hunt');
			if (lastHunt !== null && timeOut - (Date.now() - lastHunt) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastHunt));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can hunt again.`);
			}
			else {
				await Cooldown.update({ hunt: Date.now() }, { where: { userId: user } });

				if (successRate === 1) {
					const animalID = Math.floor(Math.random() * 10) + 1;
					let rarity;
					if (animalID < 5) {
						rarity = 'common';
						await Achievement.update({ commonHunt: achievement.get('commonHunt') + 1 }, { where: { userId: user } });
						await Inventory.update({ commonHunt: inventory.get('commonHunt') + 1 }, { where: { userId: user } });
					}
					else if (animalID < 8) {
						rarity = 'uncommon';
						await Achievement.update({ uncommonHunt: achievement.get('uncommonHunt') + 1 }, { where: { userId: user } });
						await Inventory.update({ uncommonHunt: inventory.get('uncommonHunt') + 1 }, { where: { userId: user } });
					}
					else if (animalID < 9) {
						rarity = 'rare';
						await Achievement.update({ rareHunt: achievement.get('rareHunt') + 1 }, { where: { userId: user } });
						await Inventory.update({ rareHunt: inventory.get('rareHunt') + 1 }, { where: { userId: user } });
					}
					else if (animalID < 10) {
						rarity = 'mythical';
						await Achievement.update({ mythicalHunt: achievement.get('mythicalHunt') + 1 }, { where: { userId: user } });
						await Inventory.update({ mythicalHunt: inventory.get('mythicalHunt') + 1 }, { where: { userId: user } });
					}
					else {
						rarity = 'legendary';
						const phrase = phrases[Math.floor(Math.random() * phrases.length)];
						message.channel.send(`**${message.author.username}**\nA wild dragon has appreared! Type this phrase fast!\n\`${phrase}\``);
						const filter = m => m.author.id === message.author.id;
						const input = await message.channel.awaitMessages(filter, {
							max: 1,
							time: 30000,
						});
						if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
							await Achievement.update({ legendaryHunt: achievement.get('legendaryHunt') + 1 }, { where: { userId: user } });
							await Inventory.update({ legendaryHunt: inventory.get('legendaryHunt') + 1 }, { where: { userId: user } });
						}
						else {
							if (breakRate === 1) {
								await Inventory.update({ huntingRifle: inventory.get('huntingRifle') - 1 }, { where: { userId: user } });
								message.channel.send(`**${message.author.username}**, A dragon got away and your ** hunting-rifle** has broken..`);
							}
							else {
								message.channel.send(`**${message.author.username}**, A dragon got away..`);
							}
							return;
						}
					}
					await Achievement.update({ hunt: achievement.get('hunt') + 1 }, { where: { userId: user } });

					const animal = animals[rarity];
					message.channel.send(`**${message.author.username}**, You went to the woods and you killed a ${animal.symbol}.`);
				}
				else {
					message.channel.send(`**${message.author.username}**, You went to the woods but you didn't get anything.. sad.`);
				}
			}
		});
	},
};