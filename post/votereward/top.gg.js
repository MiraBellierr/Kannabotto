const Topgg = require('@top-gg/sdk');
const express = require('express');
const { createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const { webhookpassword } = require('../../config.json');
const Models = require('../../create-model');
const { MessageEmbed } = require('discord.js');
const { PORT1 } = require('../../port.json');
const { topgg } = require('../../routes.json');

module.exports = (client) => {
	const app = express();

	const webhook = new Topgg.Webhook(webhookpassword);

	// vote reward
	app.post(topgg, webhook.listener(async vote => {
		const Economy = Models.Economy();

		await createAllDataForNewUser(vote.user);

		const economy = await getUserDataAndCreate(Economy, vote.user);

		let reward = 500;
		let weekend = false;

		const dayToday = new Date(Date.now()).getDay();

		if (dayToday === 0 || dayToday === 6) {
			reward = reward * 2;
			weekend = true;
		}

		const voteReward = economy.get('balance') + reward;

		const channel = client.channels.cache.get('870151501950091264');

		client.users.fetch(vote.user).then(async user => {
			await Economy.update({ balance: voteReward }, { where: { userId: vote.user } });

			const embed = new MessageEmbed()
				.setTitle('Thank you for voting!')
				.setColor('#ff1493')
				.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
				.setDescription(`\`${user.tag} (${user.id})\` just voted!\n${user.tag} received <a:jasminecoins:868105109748469780> ${reward} ${weekend === true ? '(doubled on weekend)' : ''}\n\nYou can vote on top.gg [here](https://top.gg/bot/867048396358549544/vote) every 12 hours!`)
				.setFooter('Thank you for your support!');

			channel.send({ embeds: [embed] });

			user.send(`Thank for voting! You just received <a:jasminecoins:868105109748469780> ${reward}! ${weekend === true ? 'Doubled on weekend!' : ''}`).catch((e) => console.log(e));
		});


	}));

	app.listen(PORT1, () => { console.log(`[LOG] Webhook server running at ::${PORT1}/${topgg}`); });
};