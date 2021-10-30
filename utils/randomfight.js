const Models = require('../create-model');
const { getUserDataAndCreate, xpGain, chance, cooldown, getProgbar, levelUp } = require('../functions');
const Player = Models.Player();
const Bag = Models.Bag();
const Economy = Models.Economy();
const Discord = require('discord.js');
const emojis = require('../database/emojis.json');

module.exports = async (message, userId) => {
	const player = await getUserDataAndCreate(Player, userId);
	const bag = await getUserDataAndCreate(Bag, userId);
	const bearTimer = await cooldown('bear', userId, 3.6e+6);
	const economy = await getUserDataAndCreate(Economy, userId);

	const charactersArr = [];
	const characters = await Player.findAll({ attributes: ['userId'] });
	const charactersString = characters.map(c => c.userId);

	for (let i = 0; i < charactersString.length; i++) {
		charactersArr.push(charactersString[i]);
	}

	let enemy = charactersArr[Math.floor(Math.random() * charactersArr.length)];

	while (enemy === userId) {
		enemy = charactersArr[Math.floor(Math.random() * charactersArr.length)];
	}

	const bagEnemy = await getUserDataAndCreate(Bag, enemy);
	const playerEnemy = await getUserDataAndCreate(Player, enemy);

	let emoji = '';

	if (bag.get('weapon') !== 'No Weapon') emoji = message.client.weapons.get(bag.get('weapon')).emoji;

	let enemyWeaponEmoji = '';

	if (bagEnemy.get('weapon') !== 'No Weapon') enemyWeaponEmoji = message.client.weapons.get(bagEnemy.get('weapon')).emoji;

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
	let xpAdd = xpGain(player.get('level'), playerEnemy.get('level'));
	let half;
	let starAdd = Math.floor(Math.random() * 10) + 1;
	const chance_1 = chance(0.5);
	const chance_2 = chance(0.5);

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
			await Player.update({ battle: player.get('battle') + 1 }, { where: { userId } });
			await Player.update({ tie: player.get('tie') + 1 }, { where: { userId } });

			enemyHealth = 0;
			playerHealth = 0;
			xpAdd = 10;

			if (bearTimer.bool) {
				xpAdd = ((50 / 100) * 10) + 10;
			}

			const curxp = player.get('xp');

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
			break;
		}
		else if (enemyHealth < 1) {
			await Player.update({ battle: player.get('battle') + 1 }, { where: { userId } });
			await Player.update({ won: player.get('won') + 1 }, { where: { userId } });

			const curBal = economy.get('balance');

			await Economy.update({ balance: curBal + playerEnemy.get('level') }, { where: { userId } });

			enemyHealth = 0;
			playerHealth;


			if (bearTimer.bool) {
				xpAdd = ((50 / 100) * xpAdd) + xpAdd;
			}

			if (player.get('level') < playerEnemy.get('level')) {
				starAdd = 10 * (playerEnemy.get('level') - player.get('level'));
			}

			const curxp = player.get('xp');
			const curStar = player.get('rank');

			await Player.update({ rank: curStar + starAdd }, { where: { userId } });
			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
			break;
		}
		else if (playerHealth < 1) {
			await Player.update({ battle: player.get('battle') + 1 }, { where: { userId } });
			await Player.update({ lost: player.get('lost') + 1 }, { where: { userId } });

			playerHealth = 0;
			enemyHealth;
			xpAdd = 10;

			if (bearTimer.bool) {
				xpAdd = ((50 / 100) * 10) + 10;
			}

			const curxp = player.get('xp');

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
			break;
		}
		else if (i === 999) {
			enemyHealth;
			playerHealth;

			await Player.update({ battle: player.get('battle') + 1 }, { where: { userId } });
			await Player.update({ tie: player.get('tie') + 1 }, { where: { userId } });

			xpAdd = 10;

			if (bearTimer.bool) {
				xpAdd = ((50 / 100) * 10) + 10;
			}

			const curxp = player.get('xp');

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
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
		.setFooter(`Round 0/${i + 1}`)
		.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
		.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${playerEnemy.get('health') * 100}/${playerEnemy.get('health') * 100}\n${getProgbar(playerEnemy.get('health') * 100, playerEnemy.get('health') * 100, 20)}`);

	const thisMes = await message.reply({ embeds: [battle] });
	if (i > 0) {
		const battle3 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('#DDA0DD')
			.setImage(playerEnemy.get('image'))
			.setThumbnail(player.get('image'))
			.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
			.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth2}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth2, playerEnemy.get('health') * 100, 20)}`)
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
			battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
			battle4.setFooter(`Round ${i + 1}/${i + 1}. Tie. ${player.get('name')} gained 10 xp`);
		}
		else if (playerHealth < 1) {
			battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__ - :trophy: Winner' : `__${playerEnemy.get('name')}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
			battle4.setFooter(`Round ${i + 1}/${i + 1}. You lost. ${player.get('name')} gained 10 xp`);
		}
		else if (enemyHealth < 1) {
			battle4.addField(`__${player.get('name')}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
			battle4.setFooter(`Round ${i + 1}/${i + 1}. You won. ${player.get('name')} gained ${xpAdd} xp, ${starAdd} stars and ${playerEnemy.get('level')} coins`);
		}
		else if (i === 999) {
			battle4.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle4.addField(playerEnemy.get('name') === 'Your Character' ? '__Enemy Character__' : `__${playerEnemy.get('name')}__`, `**• ${emojis.xp} Level:** ${playerEnemy.get('level')}\n**• ${emojis.weapon} Weapon:** ${enemyWeaponEmoji} ${bagEnemy.get('weapon')}\n**• ${emojis.health} Health:** ${enemyHealth}/${playerEnemy.get('health') * 100}\n${getProgbar(enemyHealth, playerEnemy.get('health') * 100, 20)}`);
			battle4.setFooter(`Round ${i + 1}/10000. No winner. ${player.get('name')} gained 10 xp`);
		}

		setTimeout(() => {
			thisMes.edit({ embeds: [battle4] });
			message.client.battle.delete(userId);
			levelUp(player, userId, message);
		}, 2000);
	}, 2000);
};