const fs = require('fs');
const redirect = require('../database/redirect.json');
const randomcharacter = require('../database/randomCharacter.json');
const prefixes = require('../database/prefix.json');
const Models = require('../create-model');
const { getUserDataAndCreate, chance, cooldown, xpGain, getProgbar } = require('../functions');
const Player = Models.Player();
const Bag = Models.Bag();
const Economy = Models.Economy();
const Images = Models.Images();
const Discord = require('discord.js');
const emojis = require('../database/emojis.json');

module.exports = async (message, userId) => {
	if (!redirect[message.guild.id] || redirect[message.guild.id].channel === 'none') return message.reply(`There is no redirect channel for this guild. To redirect, do \`${prefixes[message.guild.id]}redirect <#channel>\`.`);
	if (message.channel.id !== redirect[message.guild.id].channel) return;

	const player = await getUserDataAndCreate(Player, userId);
	const bag = await getUserDataAndCreate(Bag, userId);
	const bearTimer = await cooldown('bear', userId, 3.6e+6);
	const economy = await getUserDataAndCreate(Economy, userId);

	if (!await Images.findOne({ where: { id: 1 } })) {
		await Images.create({
			data: {},
		});
	}

	let images = await Images.findOne({ where: { id: 1 } });
	images = images.dataValues.data;

	let emoji = '';

	if (bag.get('weapon') !== 'No Weapon') emoji = message.client.weapons.get(bag.get('weapon')).emoji;

	if (!randomcharacter[message.guild.id]) {
		randomcharacter[message.guild.id] = {
			id: 'none',
			level: 'none',
			defeat: true,
		};
	}

	if (randomcharacter[message.guild.id].defeat === true) return message.reply('There is no boss spawned in this channel');

	const characters = require('../database/characters.json');
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
	let gainedcoins = enemyLevel;

	const chance_1 = chance(0.5);
	const chance_2 = chance(0.5);

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
		else if (chance_1) {
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

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
			break;
		}
		else if (enemyHealth < 1) {
			const curBal = economy.get('balance');

			let coinsGain = enemyLevel;

			await Economy.update({ balance: curBal + coinsGain }, { where: { userId } });

			enemyHealth = 0;
			playerHealth;
			let xpAdd = xpGain(player.get('level'), enemyLevel);

			if (bearTimer.bool) {
				xpAdd = ((50 / 100) * xpAdd) + xpAdd;
			}

			const curxp = player.get('xp');

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });


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
						coinsGain = enemyLevel + 1000;
						gainedcoins += coinsGain;
						await Economy.update({ balance: curBal + coinsGain }, { where: { userId } });
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

				message.reply(`Congratulations, you have captured **${enemy[0].name}**`);
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

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
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

			await Player.update({ xp: curxp + xpAdd }, { where: { userId } });
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
		else if (chance_2) {
			playerHealth -= enemyDamage;
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
		else if (chance_1) {
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
		else if (chance_2) {
			playerHealth2 -= enemyDamage;
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
	const battle = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
		.setThumbnail(player.get('image'))
		.setImage(enemy[0].image)
		.setFooter(`Round 0/${i + 1}`)
		.setColor('#DDA0DD')
		.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerFullHealth}/${playerFullHealth}\n${getProgbar(playerFullHealth, playerFullHealth, 20)}`)
		.addField(`__${enemy[0].name}__`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${(enemy[0].health + enemyLevel) * 100}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar((enemy[0].health + enemyLevel) * 100, (enemy[0].health + enemyLevel) * 100, 20)}`);

	const thisMes = await message.reply({ embeds: [battle] });
	if (i > 0) {
		const battle2 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setThumbnail(player.get('image'))
			.setImage(enemy[0].image)
			.setColor('#DDA0DD')
			.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth2}/${playerFullHealth}\n${getProgbar(playerHealth2, playerFullHealth, 20)}`)
			.addField(`__${enemy[0].name}__`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${enemyHealth2}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth2, (enemy[0].health + enemyLevel) * 100, 20)}`)
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
			battle3.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle3.addField(`__${enemy[0].name}__`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
			battle3.setFooter(`Round ${i + 1}/${i + 1}. Tie. ${player.get('name')} gained 10 xp`);
		}
		else if (enemyHealth < 1) {
			battle3.addField(`__${player.get('name')}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle3.addField(`__${enemy[0].name}__`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
			battle3.setFooter(`Round ${i + 1}. You won. ${player.get('name')} gained 100 xp and ${gainedcoins} coins`);
		}
		else if (playerHealth < 1) {
			battle3.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle3.addField(`__${enemy[0].name}__ - :trophy: Winner`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
			battle3.setFooter(`Round ${i + 1}/${i + 1}. You lost. ${player.get('name')} gained 10 xp`);
		}
		else if (i === 999) {
			battle3.addField(`__${player.get('name')}__`, `**• ${emojis.xp} Level:** ${playerLevel}\n**• ${emojis.weapon} Weapon:** ${emoji} ${bag.get('weapon')}\n**• ${emojis.health} Health:** ${playerHealth}/${playerFullHealth}\n${getProgbar(playerHealth, playerFullHealth, 20)}`);
			battle3.addField(`__${enemy[0].name}__`, `**• ${emojis.xp} Level:** ${enemyLevel}\n**• ${emojis.weapon} Weapon:** None\n**• ${emojis.health} Health:** ${enemyHealth}/${(enemy[0].health + enemyLevel) * 100}\n${getProgbar(enemyHealth, (enemy[0].health + enemyLevel) * 100, 20)}`);
			battle3.setFooter(`Round ${i + 1}/10000. No winner. ${player.get('name')} gained 10 xp`);
		}

		setTimeout(() => thisMes.edit({ embeds: [battle3] }), 2000);
	}, 2000);
};