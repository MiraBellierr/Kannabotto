const { getMember, getUserDataAndCreate, createAllDataForNewUser, checkPlayerExist, promptMessage, chance, getProgbar, levelUp } = require('../functions');
const Models = require('../create-model');
const Bag = Models.Bag();
const Player = Models.Player();
const prefixes = require('../database/prefix.json');
const Discord = require('discord.js');
const emojis = require('../database/emojis.json');

module.exports = async (userId, message, args) => {
	let enemy = await getMember(message, args.join(' '));
	enemy = enemy.user.id;

	const player = await getUserDataAndCreate(Player, userId);
	const bag = await getUserDataAndCreate(Bag, userId);

	if (enemy === message.author.id) return message.reply('Player not found');


	const member = await getMember(message, args.join(' '));
	const enemyPlayer = await getMember(message, args.join(' '));

	if (!enemy) return message.reply(`**${message.author.username}**, I couldn't find that user.`);

	const bagEnemy = await getUserDataAndCreate(Bag, enemy);

	await createAllDataForNewUser(enemy);

	let emoji = '';

	if (bag.get('weapon') !== 'No Weapon') emoji = message.client.weapons.get(bag.get('weapon')).emoji;

	let enemyWeaponEmoji = '';

	if (bagEnemy.get('weapon') !== 'No Weapon') enemyWeaponEmoji = message.client.weapons.get(bagEnemy.get('weapon')).emoji;

	if (!await checkPlayerExist(enemy)) return message.reply(`**${message.author.username}**, There is no player with this name in my database. Do \`${prefixes[message.guild.id]}start\` to create a profile.`);

	const playerEnemy = await getUserDataAndCreate(Player, enemy);

	const prompt = new Discord.MessageEmbed()
		.setTitle(`${message.author.username} challenges ${member.user.username} in battle!`)
		.setDescription('React with ✅ to accept the battle\nReact with ❎ to deny the battle')
		.setTimestamp();

	const m = await message.reply({ embeds: [prompt] });

	const emojis2 = ['✅', '❎'];
	const reacted = await promptMessage(m, enemyPlayer.user, 300000, emojis2);

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
		const chance_1 = chance(0.5);
		const chance_2 = chance(0.5);

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
				if (chance_1) {
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
				else if (bagEnemy.get('weapon') === 'fire-sword') {
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
				if (chance_2) {
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
				else if (bag.get('weapon') === 'fire-sword') {
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
				if (chance_1) {
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
				else if (bagEnemy.get('weapon') === 'fire-sword') {
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
				if (chance_2) {
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
				else if (bag.get('weapon') === 'fire-sword') {
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
		const battle = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(playerEnemy.get('image'))
			.setThumbnail(player.get('image'))
			.setColor('#DDA0DD')
			.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
			.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${playerEnemy.get('health') * 100}/${playerEnemy.get('health') * 100}\n${getProgbar(playerEnemy.get('health') * 100, playerEnemy.get('health') * 100, 20)}`);

		const thisMes = await message.reply({ embeds: [battle] });
		if (i > 0) {
			const battle2 = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setImage(playerEnemy.get('image'))
				.setThumbnail(player.get('image'))
				.setColor('#DDA0DD')
				.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
				.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth2}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth2, playerEnemy.get('health') * 100, 20)}`)
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
				battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
				battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
				battle4.setFooter(`Round ${i + 1}/${i + 1}. Tie`);
				message.client.battle.delete(userId);
			}
			else if (playerHealth < 1) {
				battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
				battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__ - :trophy: Winner' : `__${playerEnemy.get('name')}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
				battle4.setFooter(`Round ${i + 1}/${i + 1}. ${playerEnemy.get('name')} won`);
				message.client.battle.delete(userId);
			}
			else if (enemyHealth < 1) {
				battle4.addField(`__${player.get('name')}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
				battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
				battle4.setFooter(`Round ${i + 1}/${i + 1}. ${player.get('name')} won`);
				message.client.battle.delete(userId);
			}
			else if (i === 999) {
				battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${player.get('level')}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
				battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
				battle4.setFooter(`Round ${i + 1}/10000. No winner`);
				message.client.battle.delete(userId);
			}
			setTimeout(() => {
				thisMes.edit({ embeds: [battle4] });
				message.client.battle.delete(userId);
				levelUp(player, userId, message);
			}, 2000);
		}, 2000);
		return;
	}
	else if (reacted === '❎') {
		m.delete();
		return message.reply('battle declined.');
	}
};