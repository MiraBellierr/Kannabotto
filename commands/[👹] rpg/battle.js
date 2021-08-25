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

/* eslint-disable no-lonely-if */
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const fs = require('fs');
const prefixes = require('../../database/prefix.json');
const { getMember, promptMessage, getUserDataAndCreate, checkPlayerExist, cooldown, createAllDataForNewUser } = require('../../functions');
const randomcharacter = require('../../database/randomCharacter.json');
const redirect = require('../../database/redirect.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'battle',
	aliases: ['b'],
	description: 'battle and gain xp and coins',
	category: '[👹] rpg',
	example: `${bot_prefix}battle [mention | id | username | boss]`,
	usage: '[mention | id | username | boss]',
	run: async (client, message, args) => {
		const user = message.author.id;

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!await checkPlayerExist(user)) return message.reply({ embeds: [result] });

		const Inventory = Models.Inventory();
		const Economy = Models.Economy();
		const Bag = Models.Bag();
		const Cooldown = Models.Cooldown();
		const Player = Models.Player();
		const Images = Models.Images();

		if (!await Images.findOne({ where: { id: 1 } })) {
			await Images.create({
				data: {},
			});
		}

		const imagess = await Images.findOne({ where: { id: 1 } });

		const images = imagess.dataValues.data;

		await createAllDataForNewUser(user);

		const inventory = await getUserDataAndCreate(Inventory, user);
		const economy = await getUserDataAndCreate(Economy, user);
		const bag = await getUserDataAndCreate(Bag, user);
		const player = await getUserDataAndCreate(Player, user);

		let emoji = '';

		if (bag.get('weapon') !== 'No Weapon') emoji = client.weapons.get(bag.get('weapon')).emoji;

		const timer = await cooldown('battle', user, 15000);
		const bearTimer = await cooldown('bear', user, 3.6e+6);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can battle again.`);
		}
		else {
			await Cooldown.update({ battle: Date.now() }, { where: { userId: user } });

			if (args.length > 0) {
				if (args[0].toLowerCase() === 'boss') {
					if (!redirect[message.guild.id] || redirect[message.guild.id].channel === 'none') return message.reply(`There is no redirect channel for this guild. To redirect, do \`${prefixes[message.guild.id]}redirect <#channel>\`.`);
					if (message.channel.id !== redirect[message.guild.id].channel) return;

					if (!randomcharacter[message.guild.id]) {
						randomcharacter[message.guild.id] = {
							id: 'none',
							level: 'none',
							defeat: true,
						};
					}

					if (randomcharacter[message.guild.id].defeat === true) return message.reply('There is no boss spawned in this channel');

					const characters = require('../../database/characters.json');
					const random_character = randomcharacter[message.guild.id];
					const enemy = [];

					for (let i = 0; i < characters.length; i++) {
						if (characters[i].id === random_character.id) {
							enemy.push(characters[i]);
						}
					}

					const enemyLevel = random_character.level;
					let playerHealth = player.get('health') * 100;
					let playerHealth2 = player.get('health') * 100;
					const playerLevel = player.get('level');
					const playerFullHealth = player.get('health') * 100;
					let playerPa = player.get('physicalAttack') - (enemy[0].physical_resistance + enemyLevel);

					if (playerPa < 1) playerPa = 1;

					let playerMa = player.get('magicalAttack') - (enemy[0].magical_resistance + enemyLevel);

					if (playerMa < 1) playerMa = 1;

					const playerDamage = playerPa + playerMa;
					let playerSpeed = player.get('speed');
					let playerSpeed2 = player.get('speed');
					let playerDamage2 = playerPa + playerMa;

					if (bag.get('weapon') === 'fire-sword') playerDamage2 = Math.floor(((80 / 100) * playerDamage2) + playerDamage2);

					let enemyHealth = (enemy[0].health + enemyLevel) * 100;
					let enemyHealth2 = (enemy[0].health + enemyLevel) * 100;
					let enemyPa = (enemy[0].physical_attack + enemyLevel) - player.get('physicalResistance');

					if (enemyPa < 1) enemyPa = 1;

					let enemyMa = (enemy[0].magical_attack + enemyLevel) - player.get('magicalResistance');

					if (enemyMa < 1) enemyMa = 1;

					const enemyDamage = enemyPa + enemyMa;
					const enemySpeed = enemy[0].speed + enemyLevel;

					let i, half;
					const random = Math.floor(((Math.random() * 30) + 3) * inventory.get('bunny'));
					const array = [0, 1];
					const random2 = array[Math.floor(Math.random() * array.length)];
					const random3 = array[Math.floor(Math.random() * array.length)];

					for (i = 0; i < 1000; i++) {
						if (bag.get('weapon') === 'bow') {
							playerSpeed = ((5 / 100) * playerSpeed) + playerSpeed;
						}

						if (playerSpeed > enemySpeed) {
							if (bag.get('weapon') === 'fire-sword') {
								if (i === 0) {
									enemyHealth -= playerDamage2;
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
							else {
								enemyHealth -= playerDamage;
							}
						}
						else if (enemySpeed > playerSpeed) {
							playerHealth -= enemyDamage;
						}
						else {

							if (random2 === 1) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth -= playerDamage2;
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
							else {
								playerHealth -= enemyDamage;
							}
						}
						if ((enemyHealth < 1 && playerHealth < 1) || enemyHealth < 1 || playerHealth < 1 || i === 999) {
							half = Math.floor(i / 2);
						}
						if (enemyHealth < 1 && playerHealth < 1) {
							enemyHealth = 0;
							playerHealth = 0;

							let xpAdd = 10;

							if (bearTimer.bool) {
								xpAdd = ((50 / 100) * 10) + 10;
							}

							const curxp = player.get('xp');

							await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
							break;
						}
						else if (enemyHealth < 1) {
							const curBal = economy.get('balance');

							await Economy.update({ balance: curBal + random }, { where: { userId: user } });

							enemyHealth = 0;
							playerHealth;
							let xpAdd = 100;

							if (bearTimer.bool) {
								xpAdd = ((50 / 100) * 100) + 100;
							}

							if (player.get('level') < enemyLevel) {
								xpAdd = 100 * (enemyLevel - player.get('level'));
								if (bearTimer.bool) {
									const xpAdd2 = 100 * (enemyLevel - player.get('level'));
									xpAdd = ((50 / 100) * xpAdd2) + xpAdd2;
								}
							}
							const curxp = player.get('xp');

							await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });

							if (!images[message.author.id]) {
								images[message.author.id] = [
									{
										name: 'Default',
										image: player.get('image'),
										count: 1,
									},
								];
							}

							randomcharacter[message.guild.id].defeat = true;

							fs.writeFile('./database/randomCharacter.json', JSON.stringify(randomcharacter, null, 2), (err) => {
								if (err) return message.reply(`An error occurred \`${err}\``);
							});

							const data = [];

							setTimeout(async function() {
								for (i = 0; i < images[message.author.id].length; i++) {
									await data.push(images[message.author.id][i]);

									if (images[message.author.id][i].name === enemy[0].name) {
										// eslint-disable-next-line no-shadow
										const curBal = economy.get('balance');

										await Economy.update({ balance: curBal + 1000 }, { where: { userId: user } });
										return;
									}
								}

								const image = {
									name: enemy[0].name,
									image: enemy[0].image,
									count: 1,
								};

								data.push(image);

								images[message.author.id] = data;

								await Images.update({ data: images }, { where: { id: 1 } });

								message.reply(`Congratulations, you get **${enemy[0].name}** image`);

								const embed = new Discord.MessageEmbed()
									.setImage(enemy[0].image);
								message.reply({ embeds: [embed] });
							}, 4100);
							break;
						}
						else if (playerHealth < 1) {
							playerHealth = 0;
							enemyHealth;

							let xpAdd = 10;

							if (bearTimer.bool) {
								xpAdd = ((50 / 100) * 10) + 10;
							}

							const curxp = player.get('xp');

							await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
							break;
						}
						else if (i === 999) {
							enemyHealth;
							playerHealth;

							let xpAdd = 10;

							if (bearTimer.bool) {
								xpAdd = ((50 / 100) * 10) + 10;
							}

							const curxp = player.get('xp');

							await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
							break;
						}
						if (playerSpeed > enemySpeed) {
							playerHealth -= enemyDamage;
						}
						else if (enemySpeed > playerSpeed) {
							if (bag.get('weapon') === 'fire-sword') {
								if (i === 0) {
									enemyHealth -= playerDamage2;
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
							else {
								enemyHealth -= playerDamage;
							}
						}
						else {
							if (random3 === 1) {
								playerHealth -= enemyDamage;
							}
							else {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth -= playerDamage2;
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
						}
					}
					for (i = 0; i < 1000; i++) {
						if (bag.get('weapon') === 'bow') {
							playerSpeed2 = ((5 / 100) * playerSpeed2) + playerSpeed2;
						}
						if (playerSpeed2 > enemySpeed) {
							if (bag.get('weapon') === 'fire-sword') {
								if (i === 0) {
									enemyHealth2 -= playerDamage2;
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
							else {
								enemyHealth2 -= playerDamage;
							}
						}
						else if (enemySpeed > playerSpeed2) {
							playerHealth2 -= enemyDamage;
						}
						else {

							if (random2 === 1) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth2 -= playerDamage2;
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
							else {
								playerHealth2 -= enemyDamage;
							}
						}
						if (i === half) {
							if (playerHealth2 < 1) playerHealth2 = 0;
							if (enemyHealth2 < 1) enemyHealth2 = 0;

							playerHealth2;
							enemyHealth2;
							break;
						}
						if (playerSpeed2 > enemySpeed) {
							playerHealth2 -= enemyDamage;
						}
						else if (enemySpeed > playerSpeed2) {
							if (bag.get('weapon') === 'fire-sword') {
								if (i === 0) {
									enemyHealth2 -= playerDamage2;
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
							else {
								enemyHealth2 -= playerDamage;
							}
						}
						else {
							if (random3 === 1) {
								playerHealth2 -= enemyDamage;
							}
							else {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth2 -= playerDamage2;
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
						}
					}
					const battle = new Discord.MessageEmbed()
						.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
						.setThumbnail(player.get('image'))
						.setImage(enemy[0].image)
						.setFooter(`Round 0/${i + 1}`)
						.setColor('#DDA0DD')
						.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
						.addField(enemy[0].name, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${(enemy[0].health + enemyLevel) * 100}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar((enemy[0].health + enemyLevel) * 100, (enemy[0].health + enemyLevel) * 100, 20)}`);

					const thisMes = await message.reply({ embeds: [battle] });
					if (i > 0) {
						const battle2 = new Discord.MessageEmbed()
							.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
							.setThumbnail(player.get('image'))
							.setImage(enemy[0].image)
							.setColor('#DDA0DD')
							.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
							.addField(enemy[0].name, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${enemyHealth2}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth2, (enemy[0].health + enemyLevel) * 100, 20)}`)
							.setFooter(`Round ${Math.floor(i / 2) + 1}/${i + 1}`);

						setTimeout(() => thisMes.edit({ embeds: [battle2] }), 2000);
					}
					setTimeout(function() {
						const battle3 = new Discord.MessageEmbed()
							.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
							.setThumbnail(player.get('image'))
							.setImage(enemy[0].image)
							.setColor('#DDA0DD');
						if (enemyHealth < 1 && playerHealth < 1) {
							battle3.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
							battle3.addField(enemy[0].name, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
							battle3.setFooter(`Round ${i + 1}/${i + 1}. Tie. ${player.get('name')} gained 10 xp`);
						}
						else if (enemyHealth < 1) {
							battle3.addField(`${player.get('name')} - :trophy: Winner`, `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
							battle3.addField(enemy[0].name, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
							battle3.setFooter(`Round ${i + 1}. You won. ${player.get('name')} gained 100 xp and ${random.toLocaleString()} coins`);
						}
						else if (playerHealth < 1) {
							battle3.addField(`${player.get('name')}`, `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
							battle3.addField(`${enemy[0].name} - :trophy: Winner`, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
							battle3.setFooter(`Round ${i + 1}/${i + 1}. You lost. ${player.get('name')} gained 10 xp`);
						}
						else if (i === 999) {
							battle3.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
							battle3.addField(enemy[0].name, `**• Level:** ${enemyLevel}\n**• Weapon:** None\n**• Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
							battle3.setFooter(`Round ${i + 1}/10000. No winner. ${player.get('name')} gained 10 xp`);
						}

						setTimeout(() => thisMes.edit({ embeds: [battle3] }), 2000);
					}, 2000);
					setTimeout(async function() {
						if (player.get('totalXp') < player.get('xp')) {
							await Player.update({ totalXp: 100 * Math.pow(player.get('level') + 1, 3) }, { where: { userId: user } });
							await Player.update({ level: player.get('level') + 1 }, { where: { userId: user } });
							await Player.update({ health: player.get('health') + 1 }, { where: { userId: user } });
							await Player.update({ physicalAttack: player.get('physicalAttack') + 1 }, { where: { userId: user } });
							await Player.update({ magicalAttack: player.get('magicalAttack') + 1 }, { where: { userId: user } });
							await Player.update({ physicalResistance: player.get('physicalResistance') + 1 }, { where: { userId: user } });
							await Player.update({ magicalResistance: player.get('magicalResistance') + 1 }, { where: { userId: user } });
							await Player.update({ speed: player.get('speed') + 1 }, { where: { userId: user } });
							message.reply(`🆙 | **${message.author.username}**, ${player.get('name')} has leveled up to level **${player.get('level') + 1}**`);
						}
					}, 4000);
					return;
				}
				else {
					let enemy = await getMember(message, args.join(' '));
					enemy = enemy.user.id;

					if (enemy === message.author.id) return message.reply('Player not found');


					const member = await getMember(message, args.join(' '));
					const enemyPlayer = await getMember(message, args.join(' '));

					if (!enemy) return message.reply(`**${message.author.username}**, I couldn't find that user.`);

					const bagEnemy = await getUserDataAndCreate(Bag, enemy);

					await createAllDataForNewUser(enemy);

					let enemyWeaponEmoji = '';

					if (bagEnemy.get('weapon') !== 'No Weapon') enemyWeaponEmoji = client.weapons.get(bagEnemy.get('weapon')).emoji;


					const playerEnemy = await getUserDataAndCreate(Player, enemy);

					if (!await checkPlayerExist(enemy)) return message.reply(`**${message.author.username}**, There is no player with this name in my database. Do \`${prefixes[message.guild.id]}start\` to create a profile.`);

					const prompt = new Discord.MessageEmbed()
						.setTitle(`${message.author.username} challenges ${member.user.username} in battle!`)
						.setDescription('React with ✅ to accept the battle\nReact with ❎ to deny the battle')
						.setTimestamp();

					const m = await message.reply({ embeds: [prompt] });

					const emojis = ['✅', '❎'];
					const reacted = await promptMessage(m, enemyPlayer.user, 300000, emojis);

					if (reacted === '✅') {
						m.delete();

						let playerHealth = player.get('health') * 100;
						let playerHealth2 = player.get('health') * 100;
						const playerFullHealth = player.get('health') * 100;
						let playerPa = player.get('physicalAttack') - playerEnemy.get('physicalResistance');

						if (playerPa < 1) playerPa = 1;

						let playerMa = player.get('magicalAttack') - playerEnemy.get('magicalResistance');

						if (playerMa < 1) playerMa = 1;

						const playerDamage = playerPa + playerMa;
						let playerSpeed = player.get('speed');
						let playerSpeed2 = player.get('speed');
						let playerDamage2 = playerPa + playerMa;

						if (bag.get('weapon') === 'fire-sword') playerDamage2 = Math.floor(((80 / 100) * playerDamage2) + playerDamage2);

						let enemyHealth = playerEnemy.get('health') * 100;
						let enemyHealth2 = playerEnemy.get('health') * 100;
						let enemyPa = playerEnemy.get('physicalAttack') - player.get('physicalResistance');

						if (enemyPa < 1) enemyPa = 1;

						let enemyMa = playerEnemy.get('magicalAttack') - player.get('magicalResistance');

						if (enemyMa < 1) enemyMa = 1;

						const enemyDamage = enemyPa + enemyMa;
						let enemySpeed = playerEnemy.get('speed');
						let enemySpeed2 = playerEnemy.get('speed');
						let enemyDamage2 = enemyPa + enemyMa;

						if (bagEnemy.get('weapon') === 'fire-sword') enemyDamage2 = Math.floor(((80 / 100) * enemyDamage2) + enemyDamage2);

						let i, half;
						const array = [0, 1];
						const random = array[Math.floor(Math.random() * array.length)];
						const random2 = array[Math.floor(Math.random() * array.length)];

						for (i = 0; i < 1000; i++) {
							if (bag.get('weapon') === 'bow') {
								playerSpeed = ((5 / 100) * playerSpeed) + playerSpeed;
							}

							if (bag.get('weapon') === 'bow') {
								enemySpeed = ((5 / 100) * enemySpeed) + enemySpeed;
							}
							if (playerSpeed > enemySpeed) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth -= playerDamage2;
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
							else if (enemySpeed > playerSpeed) {
								if (bagEnemy.get('weapon') === 'fire-sword') {
									if (i === 0) {
										playerHealth -= enemyDamage2;
									}
									else {
										playerHealth -= enemyDamage;
									}
								}
								else {
									playerHealth -= enemyDamage;
								}
							}
							else {
								// eslint-disable-next-line no-lonely-if
								if (random === 1) {
									if (bag.get('weapon') === 'fire-sword') {
										if (i === 0) {
											enemyHealth -= playerDamage2;
										}
										else {
											enemyHealth -= playerDamage;
										}
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
								else {
									if (bagEnemy.get('weapon') === 'fire-sword') {
										if (i === 0) {
											playerHealth -= enemyDamage2;
										}
										else {
											playerHealth -= enemyDamage;
										}
									}
									else {
										playerHealth -= enemyDamage;
									}
								}
							}
							if ((enemyHealth < 1 && playerHealth < 1) || enemyHealth < 1 || playerHealth < 1 || i === 999) {
								half = Math.floor(i / 2);
							}
							if (enemyHealth < 1 && playerHealth < 1) {
								enemyHealth = 0;
								playerHealth = 0;
								break;
							}
							else if (enemyHealth < 1) {
								enemyHealth = 0;
								playerHealth;
								break;
							}
							else if (playerHealth < 1) {
								playerHealth = 0;
								enemyHealth;
								break;
							}
							else if (i === 999) {
								enemyHealth;
								playerHealth;
								break;
							}
							if (playerSpeed > enemySpeed) {
								if (bagEnemy.get('weapon') === 'fire-sword') {
									if (i === 0) {
										playerHealth -= enemyDamage2;
									}
									else {
										playerHealth -= enemyDamage;
									}
								}
								else {
									playerHealth -= enemyDamage;
								}
							}
							else if (enemySpeed > playerSpeed) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth -= playerDamage2;
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
								else {
									enemyHealth -= playerDamage;
								}
							}
							else {
								// eslint-disable-next-line no-lonely-if
								if (random2 === 1) {
									if (bagEnemy.get('weapon') === 'fire-sword') {
										if (i === 0) {
											playerHealth -= enemyDamage2;
										}
										else {
											playerHealth -= enemyDamage;
										}
									}
									else {
										playerHealth -= enemyDamage;
									}
								}
								else {
									if (bag.get('weapon') === 'fire-sword') {
										if (i === 0) {
											enemyHealth -= playerDamage2;
										}
										else {
											enemyHealth -= playerDamage;
										}
									}
									else {
										enemyHealth -= playerDamage;
									}
								}
							}
						}
						for (i = 0; i < 1000; i++) {
							if (bag.get('weapon') === 'bow') {
								playerSpeed2 = ((5 / 100) * playerSpeed2) + playerSpeed2;
							}
							if (bagEnemy.get('weapon') === 'bow') {
								enemySpeed2 = ((5 / 100) * enemySpeed2) + enemySpeed2;
							}
							if (playerSpeed2 > enemySpeed2) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth2 -= playerDamage2;
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
							else if (enemySpeed2 > playerSpeed2) {
								if (bagEnemy.get('weapon') === 'fire-sword') {
									if (i === 0) {
										playerHealth2 -= enemyDamage2;
									}
									else {
										playerHealth2 -= enemyDamage;
									}
								}
								else {
									playerHealth2 -= enemyDamage;
								}
							}
							else {
								// eslint-disable-next-line no-lonely-if
								if (random === 1) {
									if (bag.get('weapon') === 'fire-sword') {
										if (i === 0) {
											enemyHealth2 -= playerDamage2;
										}
										else {
											enemyHealth2 -= playerDamage;
										}
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
								else {
									if (bagEnemy.get('weapon') === 'fire-sword') {
										if (i === 0) {
											playerHealth2 -= enemyDamage2;
										}
										else {
											playerHealth2 -= enemyDamage;
										}
									}
									else {
										playerHealth2 -= enemyDamage;
									}
								}
							}
							if (i === half) {
								if (playerHealth2 < 1) playerHealth2 = 0;
								if (enemyHealth2 < 1) enemyHealth2 = 0;
								playerHealth2;
								enemyHealth2;
								break;
							}
							if (playerSpeed2 > enemySpeed2) {
								if (bagEnemy.get('weapon') === 'fire-sword') {
									if (i === 0) {
										playerHealth2 -= enemyDamage2;
									}
									else {
										playerHealth2 -= enemyDamage;
									}
								}
								else {
									playerHealth2 -= enemyDamage;
								}
							}
							else if (enemySpeed2 > playerSpeed2) {
								if (bag.get('weapon') === 'fire-sword') {
									if (i === 0) {
										enemyHealth2 -= playerDamage2;
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
								else {
									enemyHealth2 -= playerDamage;
								}
							}
							else {
								// eslint-disable-next-line no-lonely-if
								if (random2 === 1) {
									if (bagEnemy.get('weapon') === 'fire-sword') {
										if (i === 0) {
											playerHealth2 -= enemyDamage2;
										}
										else {
											playerHealth2 -= enemyDamage;
										}
									}
									else {
										playerHealth2 -= enemyDamage;
									}
								}
								else {
									if (bag.get('weapon') === 'fire-sword') {
										if (i === 0) {
											enemyHealth2 -= playerDamage2;
										}
										else {
											enemyHealth2 -= playerDamage;
										}
									}
									else {
										enemyHealth2 -= playerDamage;
									}
								}
							}
						}
						const battle = new Discord.MessageEmbed()
							.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
							.setImage(playerEnemy.get('image'))
							.setThumbnail(player.get('image'))
							.setColor('#DDA0DD')
							.addField(player.get('name'), `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
							.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${playerEnemy.get('health') * 100}/${playerEnemy.get('health') * 100}\n${getProgbar(playerEnemy.get('health') * 100, playerEnemy.get('health') * 100, 20)}`);

						const thisMes = await message.reply({ embeds: [battle] });
						if (i > 0) {
							const battle2 = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
								.setImage(playerEnemy.get('image'))
								.setThumbnail(player.get('image'))
								.setColor('#DDA0DD')
								.addField(player.get('name'), `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
								.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth2}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth2, playerEnemy.get('health') * 100, 20)}`)
								.setFooter(`Round ${Math.floor(i / 2) + 1}/${i + 1}`);

							setTimeout(() => thisMes.edit({ embeds: [battle2] }), 2000);
						}
						setTimeout(function() {
							const battle4 = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
								.setThumbnail(player.get('image'))
								.setImage(playerEnemy.get('image'))
								.setColor('#DDA0DD');
							if (playerHealth < 1 && enemyHealth < 1) {
								battle4.addField(player.get('name'), `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
								battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
								battle4.setFooter(`Round ${i + 1}/${i + 1}. Tie`);
							}
							else if (playerHealth < 1) {
								battle4.addField(player.get('name'), `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
								battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character - :trophy: Winner' : `${playerEnemy.get('name')} - :trophy: Winner`, `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
								battle4.setFooter(`Round ${i + 1}/${i + 1}. ${playerEnemy.get('name')} won`);
							}
							else if (enemyHealth < 1) {
								battle4.addField(`${player.get('name')} - :trophy: Winner`, `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
								battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
								battle4.setFooter(`Round ${i + 1}/${i + 1}. ${player.get('name')} won`);
							}
							else if (i === 999) {
								battle4.addField(player.get('name'), `**• Level:** ${player.get('level')}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
								battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
								battle4.setFooter(`Round ${i + 1}/10000. No winner`);
							}
							setTimeout(() => thisMes.edit({ embeds: [battle4] }), 2000);
						}, 2000);
						return;
					}
					else if (reacted === '❎') {
						m.delete();
						return message.reply('battle declined.');
					}
					return;
				}
			}
			const charactersArr = [];
			const characters = await Player.findAll({ attributes: ['userId'] });
			const charactersString = characters.map(c => c.userId);

			for (let i = 0; i < charactersString.length; i++) {
				charactersArr.push(charactersString[i]);
			}

			let enemy = charactersArr[Math.floor(Math.random() * charactersArr.length)];

			const bagEnemy = await getUserDataAndCreate(Bag, enemy);
			const playerEnemy = await getUserDataAndCreate(Player, enemy);

			let enemyWeaponEmoji = '';

			if (bagEnemy.get('weapon') !== 'No Weapon') enemyWeaponEmoji = client.weapons.get(bagEnemy.get('weapon')).emoji;

			while (enemy === user || !checkPlayerExist(enemy)) {
				enemy = charactersArr[Math.floor(Math.random() * charactersArr.length)];
			}

			let playerHealth = player.get('health') * 100;
			let playerHealth2 = player.get('health') * 100;
			const playerFullHealth = player.get('health') * 100;
			const playerLevel = player.get('level');
			let playerPa = player.get('physicalAttack') - playerEnemy.get('physicalResistance');

			if (playerPa < 1) playerPa = 1;

			let playerMa = player.get('magicalAttack') - playerEnemy.get('magicalResistance');

			if (playerMa < 1) playerMa = 1;

			const playerDamage = playerPa + playerMa;
			let playerSpeed = player.get('speed');
			let playerSpeed2 = player.get('speed');
			let playerDamage2 = playerPa + playerMa;

			if (bag.get('weapon') === 'fire-sword') playerDamage2 = Math.floor(((80 / 100) * playerDamage2) + playerDamage2);

			let enemyHealth = playerEnemy.get('health') * 100;
			let enemyHealth2 = playerEnemy.get('health') * 100;
			let enemyPa = playerEnemy.get('physicalAttack') - player.get('physicalResistance');

			if (enemyPa < 1) enemyPa = 1;

			let enemyMa = playerEnemy.get('magicalAttack') - player.get('magicalResistance');

			if (enemyMa < 1) enemyMa = 1;

			const enemyDamage = enemyPa + enemyMa;
			let enemySpeed = playerEnemy.get('speed');
			let enemySpeed2 = playerEnemy.get('speed');
			let enemyDamage2 = enemyPa + enemyMa;

			if (bagEnemy.get('weapon') === 'fire-sword') enemyDamage2 = Math.floor(((80 / 100) * enemyDamage2) + enemyDamage2);

			let i;
			let xpAdd = 100;
			let half;
			let starAdd = Math.floor(Math.random() * 10) + 1;
			const random = Math.floor(((Math.random() * 30) + 3) * inventory.get('bunny'));
			const array = [0, 1];
			const random3 = array[Math.floor(Math.random() * array.length)];
			const random4 = array[Math.floor(Math.random() * array.length)];

			for (i = 0; i < 1000; i++) {
				if (bag.get('weapon') === 'bow') {
					playerSpeed = ((5 / 100) * playerSpeed) + playerSpeed;
				}
				if (bagEnemy.get('weapon') === 'bow') {
					enemySpeed = ((5 / 100) * enemySpeed) + enemySpeed;
				}
				if (playerSpeed > enemySpeed) {
					if (bag.get('weapon') === 'fire-sword') {
						if (i === 0) {
							enemyHealth -= playerDamage2;
						}
						else {
							enemyHealth -= playerDamage;
						}
					}
					else {
						enemyHealth -= playerDamage;
					}
				}
				else if (enemySpeed > playerSpeed) {
					if (bagEnemy.get('weapon') === 'fire-sword') {
						if (i === 0) {
							playerHealth -= enemyDamage2;
						}
						else {
							playerHealth -= enemyDamage;
						}
					}
					else {
						playerHealth -= enemyDamage;
					}
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (random3 === 1) {
						if (bag.get('weapon') === 'fire-sword') {
							if (i === 0) {
								enemyHealth -= playerDamage2;
							}
							else {
								enemyHealth -= playerDamage;
							}
						}
						else {
							enemyHealth -= playerDamage;
						}
					}
					else {
						if (bagEnemy.get('weapon') === 'fire-sword') {
							if (i === 0) {
								playerHealth -= enemyDamage2;
							}
							else {
								playerHealth -= enemyDamage;
							}
						}
						else {
							playerHealth -= enemyDamage;
						}
					}
				}
				if ((enemyHealth < 1 && playerHealth < 1) || enemyHealth < 1 || playerHealth < 1 || i === 999) {
					half = Math.floor(i / 2);
				}

				if (enemyHealth < 1 && playerHealth < 1) {
					await Player.update({ battle: player.get('battle') + 1 }, { where: { userId: user } });
					await Player.update({ tie: player.get('tie') + 1 }, { where: { userId: user } });

					enemyHealth = 0;
					playerHealth = 0;
					xpAdd = 10;

					if (bearTimer.bool) {
						xpAdd = ((50 / 100) * 10) + 10;
					}

					const curxp = player.get('xp');

					await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
					break;
				}
				else if (enemyHealth < 1) {
					await Player.update({ battle: player.get('battle') + 1 }, { where: { userId: user } });
					await Player.update({ won: player.get('won') + 1 }, { where: { userId: user } });

					const curBal = economy.get('balance');

					await Economy.update({ balance: curBal + random }, { where: { userId: user } });

					enemyHealth = 0;
					playerHealth;

					if (bearTimer.bool) {
						xpAdd = ((50 / 100) * 100) + 100;
					}

					if (player.get('level') < playerEnemy.get('level')) {
						xpAdd = 100 * (playerEnemy.get('level') - player.get('level'));

						if (bearTimer.bool) {
							const xpAdd2 = 100 * (playerEnemy.get('level') - player.get('level'));
							xpAdd = ((50 / 100) * xpAdd2) + xpAdd2;
						}

						starAdd = 10 * (playerEnemy.get('level') - player.get('level'));
					}

					const curxp = player.get('xp');
					const curStar = player.get('rank');

					await Player.update({ rank: curStar + starAdd }, { where: { userId: user } });
					await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
					break;
				}
				else if (playerHealth < 1) {
					await Player.update({ battle: player.get('battle') + 1 }, { where: { userId: user } });
					await Player.update({ lost: player.get('lost') + 1 }, { where: { userId: user } });

					playerHealth = 0;
					enemyHealth;
					xpAdd = 10;

					if (bearTimer.bool) {
						xpAdd = ((50 / 100) * 10) + 10;
					}

					const curxp = player.get('xp');

					await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
					break;
				}
				else if (i === 999) {
					enemyHealth;
					playerHealth;

					await Player.update({ battle: player.get('battle') + 1 }, { where: { userId: user } });
					await Player.update({ tie: player.get('tie') + 1 }, { where: { userId: user } });

					xpAdd = 10;

					if (bearTimer.bool) {
						xpAdd = ((50 / 100) * 10) + 10;
					}

					const curxp = player.get('xp');

					await Player.update({ xp: curxp + xpAdd }, { where: { userId: user } });
					break;
				}
				if (playerSpeed > enemySpeed) {
					if (bagEnemy.get('weapon') === 'fire-sword') {
						if (i === 0) {
							playerHealth -= enemyDamage2;
						}
						else {
							playerHealth -= enemyDamage;
						}
					}
					else {
						playerHealth -= enemyDamage;
					}
				}
				else if (enemySpeed > playerSpeed) {
					if (bag.get('weapon') === 'fire-sword') {
						if (i === 0) {
							enemyHealth -= playerDamage2;
						}
						else {
							enemyHealth -= playerDamage;
						}
					}
					else {
						enemyHealth -= playerDamage;
					}
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (random4 === 1) {
						if (bagEnemy.get('weapon') === 'fire-sword') {
							if (i === 0) {
								playerHealth -= enemyDamage2;
							}
							else {
								playerHealth -= enemyDamage;
							}
						}
						else {
							playerHealth -= enemyDamage;
						}
					}
					else {
						if (bag.get('weapon') === 'fire-sword') {
							if (i === 0) {
								enemyHealth -= playerDamage2;
							}
							else {
								enemyHealth -= playerDamage;
							}
						}
						else {
							enemyHealth -= playerDamage;
						}
					}
				}
			}
			for (i = 0; i < 1000; i++) {
				if (bag.get('weapon') === 'bow') {
					playerSpeed2 = ((5 / 100) * playerSpeed2) + playerSpeed2;
				}
				if (bagEnemy.get('weapon') === 'bow') {
					enemySpeed2 = ((5 / 100) * enemySpeed2) + enemySpeed2;
				}
				if (playerSpeed2 > enemySpeed2) {
					if (bag.get('weapon') === 'fire-sword') {
						if (i === 0) {
							enemyHealth2 -= playerDamage2;
						}
						else {
							enemyHealth2 -= playerDamage;
						}
					}
					else {
						enemyHealth2 -= playerDamage;
					}
				}
				else if (enemySpeed2 > playerSpeed2) {
					if (bagEnemy.get('weapon') === 'fire-sword') {
						if (i === 0) {
							playerHealth2 -= enemyDamage2;
						}
						else {
							playerHealth2 -= enemyDamage;
						}
					}
					else {
						playerHealth2 -= enemyDamage;
					}
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (random3 === 1) {
						if (bag.get('weapon') === 'fire-sword') {
							if (i === 0) {
								enemyHealth2 -= playerDamage2;
							}
							else {
								enemyHealth2 -= playerDamage;
							}
						}
						else {
							enemyHealth2 -= playerDamage;
						}
					}
					else {
						if (bagEnemy.get('weapon') === 'fire-sword') {
							if (i === 0) {
								playerHealth2 -= enemyDamage2;
							}
							else {
								playerHealth2 -= enemyDamage;
							}
						}
						else {
							playerHealth2 -= enemyDamage;
						}
					}
				}
				if (i === half) {
					if (playerHealth2 < 1) playerHealth2 = 0;
					if (enemyHealth2 < 1) enemyHealth2 = 0;
					playerHealth2;
					enemyHealth2;
					break;
				}
				if (playerSpeed2 > enemySpeed2) {
					if (bagEnemy.get('weapon') === 'fire-sword') {
						if (i === 0) {
							playerHealth2 -= enemyDamage2;
						}
						else {
							playerHealth2 -= enemyDamage;
						}
					}
					else {
						playerHealth2 -= enemyDamage;
					}
				}
				else if (enemySpeed2 > playerSpeed2) {
					if (bag.get('weapon') === 'fire-sword') {
						if (i === 0) {
							enemyHealth2 -= playerDamage2;
						}
						else {
							enemyHealth2 -= playerDamage;
						}
					}
					else {
						enemyHealth2 -= playerDamage;
					}
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (random4 === 1) {
						if (bagEnemy.get('weapon') === 'fire-sword') {
							if (i === 0) {
								playerHealth2 -= enemyDamage2;
							}
							else {
								playerHealth2 -= enemyDamage;
							}
						}
						else {
							playerHealth2 -= enemyDamage;
						}
					}
					else {
						if (bag.get('weapon') === 'fire-sword') {
							if (i === 0) {
								enemyHealth2 -= playerDamage2;
							}
							else {
								enemyHealth2 -= playerDamage;
							}
						}
						else {
							enemyHealth2 -= playerDamage;
						}
					}
				}
			}

			const battle = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setImage(playerEnemy.get('image'))
				.setThumbnail(player.get('image'))
				.setColor('#DDA0DD')
				.setFooter(`Round 0/${i + 1}`)
				.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
				.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${playerEnemy.get('health') * 100}/${playerEnemy.get('health') * 100}\n${getProgbar(playerEnemy.get('health') * 100, playerEnemy.get('health') * 100, 20)}`);

			const thisMes = await message.reply({ embeds: [battle] });
			if (i > 0) {
				const battle3 = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setColor('#DDA0DD')
					.setImage(playerEnemy.get('image'))
					.setThumbnail(player.get('image'))
					.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
					.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth2}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth2, playerEnemy.get('health') * 100, 20)}`)
					.setFooter(`Round ${Math.floor(i / 2) + 1}/${i + 1}`);

				setTimeout(() => thisMes.edit({ embeds: [battle3] }), 2000);
			}
			setTimeout(function() {
				const battle4 = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setImage(playerEnemy.get('image'))
					.setThumbnail(player.get('image'))
					.setColor('#DDA0DD');
				if (playerHealth < 1 && enemyHealth < 1) {
					battle4.addField(`${player.get('name')}`, `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
					battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
					battle4.setFooter(`Round ${i + 1}/${i + 1}. Tie. ${player.get('name')} gained 10 xp`);
				}
				else if (playerHealth < 1) {
					battle4.addField(player.get('name'), `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
					battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character - :trophy: Winner' : `${playerEnemy.get('name')} - :trophy: Winner`, `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
					battle4.setFooter(`Round ${i + 1}/${i + 1}. You lost. ${player.get('name')} gained 10 xp`);
				}
				else if (enemyHealth < 1) {
					battle4.addField(`${player.get('name')} - :trophy: Winner`, `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
					battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
					battle4.setFooter(`Round ${i + 1}/${i + 1}. You won. ${player.get('name')} gained ${xpAdd} xp, ${starAdd} 🌟 and ${random.toLocaleString()} coins`);
				}
				else if (i === 999) {
					battle4.addField(`${player.get('name')}`, `**• Level:** ${playerLevel}\n**• Weapon:** ${emoji} ${bag.get('weapon')}\n**• Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
					battle4.addField(playerEnemy.get('name') === 'Your Character' ? 'Enemy Character' : playerEnemy.get('name'), `**• Level:** ${playerEnemy.get('level')}\n**• Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
					battle4.setFooter(`Round ${i + 1}/10000. No winner. ${player.get('name')} gained 10 xp`);
				}

				setTimeout(() => thisMes.edit({ embeds: [battle4] }), 2000);
			}, 2000);

			const player1 = await Player.findOne({ where: { userID: user } });

			if (player1.get('totalXp') < player1.get('xp')) {
				await Player.update({ totalXp: 100 * Math.pow(player.get('level') + 1, 3) }, { where: { userId: message.author.id } });
				await Player.update({ level: player.get('level') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ health: player.get('health') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 1 }, { where: { userId: message.author.id } });
				await Player.update({ speed: player.get('speed') + 1 }, { where: { userId: message.author.id } });
				setTimeout(async function() {
					message.reply(`🆙 | **${message.author.username}**, ${player.get('name')} has leveled up to level **${player.get('level') + 1}**`);
				}, 4000);
			}
		}
	},
};
function getProgbar(current, max, length) {
	const curBer = Math.floor((current / max) * length);
	let str = '';
	for(let i = 0; i < length; i++) {
		str += i < curBer ? '■' : '□';
	}
	return str;
}