const Models = require('./create-model.js');
const Player = Models.Player();

async function update() {
	const playerList = await Player.findAll({ attributes: ['userId'] });

	for (let i = 0; i < playerList.length; i++) {
		const player = await Player.findOne({ where: { userId: playerList[i].dataValues.userId } });
		console.log(`Update user ${player.get('userId')}`);
		console.log('-----------------------------------------------');
		console.log('Update health');
		await Player.update({ health: player.get('health') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update health - done');
		console.log('Update physicalAttack');
		await Player.update({ physicalAttack: player.get('physicalAttack') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update physicalAttack - done');
		console.log('Update magicalAttack');
		await Player.update({ magicalAttack: player.get('magicalAttack') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update magicalAttack - done');
		console.log('Update physicalResistance');
		await Player.update({ physicalResistance: player.get('physicalResistance') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update physicalResistance - done');
		console.log('Update magicalResistance');
		await Player.update({ magicalResistance: player.get('magicalResistance') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update magicalResistance - done');
		console.log('Update speed');
		await Player.update({ speed: player.get('speed') - 1 }, { where: { userId: playerList[i].dataValues.userId } });
		console.log('Update speed - done');
		console.log('-----------------------------------------------\n\n');
	}

	console.log('done..');
}

async function updateLevel() {
	const playerList = await Player.findAll({ attributes: ['userId'] });

	for (let i = 0; i < playerList.length; i++) {
		const player = await Player.findOne({ where: { userId: playerList[i].dataValues.userId } });

		if (player.get('level') === 0) {
			console.log(`Update user ${player.get('userId')}`);
			await Player.update({ level: player.get('level') + 1 }, { where: { userId: playerList[i].dataValues.userId } });
		}
	}
}

updateLevel();
