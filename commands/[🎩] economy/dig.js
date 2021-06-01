const minerals = require('../../database/mineral.json');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const phrases = ['I found a manganese!', 'What is this!?', 'what is this shiny thing?'];
const successRates = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const breakRates = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
const Models = require('../../create-model');


module.exports = {
	name: 'dig',
	category: '[🎩] economy',
	description: 'Go digging and find out what will you find',
	example: `${bot_prefix}dig`,
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

			if (inventory.get('pickaxe') === 0) return message.channel.send(`**${message.author.username}**, You don't have a **pickaxe**!`);


			const timeOut = 40000;

			const lastDig = await cooldown.get('dig');
			if (lastDig !== null && timeOut - (Date.now() - lastDig) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastDig));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** until you can go digging again.`);
			}
			else {
				await Cooldown.update({ dig: Date.now() }, { where: { userId: user } });
				if (successRate === 1) {
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
						message.channel.send(`**${message.author.username}**\nA shiny stone has appreared! Type this phrase fast!\n\`${phrase}\``);
						const filter = m => m.author.id === message.author.id;
						const input = await message.channel.awaitMessages(filter, {
							max: 1,
							time: 30000,
						});
						if (input.first().content.toLowerCase() === phrase.toLowerCase()) {
							await Achievement.update({ manganese: achievement.get('manganese') + 1 }, { where: { userId: user } });
							await Inventory.update({ manganese: achievement.get('manganese') + 1 }, { where: { userId: user } });
						}
						else {
							if (breakRate === 1) {
								await Inventory.update({ dig: inventory.get('pickaxe') - 1 }, { where: { userId: user } });
								message.channel.send(`**${message.author.username}**, you failed to get the shiny stone and your **⛏️ pickaxe** has broken..`);
							}
							else {
								message.channel.send(`**${message.author.username}**, you failed to get a shiny stone..`);
							}
							return;
						}
					}
					await Achievement.update({ dig: achievement.get('dig') + 1 }, { where: { userId: user } });
					const mineral = minerals[rarity];
					message.channel.send(`**${message.author.username}**, You went into the cave and you found a ${mineral.symbol}.`);
				}
				else {
					message.channel.send(`**${message.author.username}**, You went to the cave but you didn't find anything..`);
				}
			}
		});
	},
};