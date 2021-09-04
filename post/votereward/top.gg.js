const Topgg = require('@top-gg/sdk');
const express = require('express');
const { createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const { authtopggwebhook } = require('../../config.json');
const Models = require('../../create-model');
const { MessageEmbed } = require('discord.js');

module.exports = (client) => {
	const app = express();

	const webhook = new Topgg.Webhook(authtopggwebhook);

	// vote reward
	app.post('/dblwebhook', webhook.listener(async vote => {
		const Economy = Models.Economy();

		await createAllDataForNewUser(vote.user);

		const economy = await getUserDataAndCreate(Economy, vote.user);

		let reward = 500;

		const dayToday = new Date(Date.now()).getDay();

		if (dayToday === 0 || dayToday === 6) {
			reward = 1000;
		}

		const voteReward = economy.get('balance') + reward;

		const channel = client.channels.cache.get('870151501950091264');

		client.users.fetch(vote.user).then(async user => {
			await Economy.update({ balance: voteReward }, { where: { userId: vote.user } });

			const embed = new MessageEmbed()
				.setTitle('Thank you for voting!')
				.setColor('#ff1493')
				.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
				.setDescription(`\`${user.tag} (${vote.user})\` just voted!\n${user.tag} received <a:jasminecoins:868105109748469780> ${reward === 1000 ? '1000 (doubled on weekend)' : '500'}\n\nYou can vote on top.gg [here](https://top.gg/bot/867048396358549544/vote) every 12 hours!`)
				.setFooter('Thank you for your support!');
			channel.send({ embeds: [embed] });
			user.send(`Thank for voting! You just received <a:jasminecoins:868105109748469780> 500! ${reward === 1000 ? '\nBut hey, it\'s weekend, you received another <a:jasminecoins:868105109748469780> 500' : ''}`).catch((e) => console.log(e));
		});


	}));

	app.listen(81);
};