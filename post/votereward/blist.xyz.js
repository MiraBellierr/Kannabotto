const express = require('express');
const bodyParser = require('body-parser');
const { blistxyzAuthorization } = require('../../config.json');
const { createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const Models = require('../../create-model');
const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
	const app = express();

	app.use(bodyParser.json());

	app.post('/blistxyz', async function(req, res) {
		if (!req.headers.authorization || req.headers.authorization !== blistxyzAuthorization) return;

		const user = await client.users.fetch(req.body.user);

		if (!user) return;

		const Economy = Models.Economy();

		await createAllDataForNewUser(user.id);

		const economy = await getUserDataAndCreate(Economy, user.id);

		let reward = 500;

		const dayToday = new Date(Date.now()).getDay();

		if (dayToday === 0 || dayToday === 6) {
			reward = 1000;
		}

		const voteReward = economy.get('balance') + reward;

		const channel = client.channels.cache.get('870151501950091264');

		await Economy.update({ balance: voteReward }, { where: { userId: user.id } });

		const embed = new MessageEmbed()
			.setTitle('Thank you for voting!')
			.setColor('#ff1493')
			.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
			.setDescription(`\`${user.tag} (${user.id})\` just voted!\n${user.tag} received <a:jasminecoins:868105109748469780> ${reward === 1000 ? '1000 (doubled on weekend)' : '500'}\n\nYou can vote on blist.xyz [here](https://blist.xyz/bot/867048396358549544/) every 12 hours!`)
			.setFooter('Thank you for your support!');
		channel.send({ embeds: [embed] });
		user.send(`Thank for voting! You just received <a:jasminecoins:868105109748469780> 500! ${reward === 1000 ? '\nBut hey, it\'s weekend, you received another <a:jasminecoins:868105109748469780> 500' : ''}`).catch((e) => console.log(e));

		res.sendStatus(200);
	});

	app.listen(3000);
};
