const express = require('express');
const bodyParser = require('body-parser');
const { blistxyzAuthorization } = require('../../config.json');
const { createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const Models = require('../../create-model');
const { MessageEmbed } = require('discord.js');
const { blist } = require('../../routes.json');
const { PORT11 } = require('../../port.json');

module.exports = async (client) => {
	const app = express();

	app.use(bodyParser.json());

	app.post(blist, async function(req, res) {
		if (!req.headers.authorization || req.headers.authorization !== blistxyzAuthorization) return res.sendStatus(403);

		const user = await client.users.fetch(req.body.user);

		if (!user) return;

		const Economy = Models.Economy();

		await createAllDataForNewUser(user.id);

		const economy = await getUserDataAndCreate(Economy, user.id);

		let reward = 300;
		let weekend = false;

		const dayToday = new Date(Date.now()).getDay();

		if (dayToday === 0 || dayToday === 6) {
			reward = reward * 2;
			weekend = true;
		}

		const voteReward = economy.get('balance') + reward;

		const channel = client.channels.cache.get('870151501950091264');

		await Economy.update({ balance: voteReward }, { where: { userId: user.id } });

		const embed = new MessageEmbed()
			.setTitle('Thank you for voting!')
			.setColor('#ff1493')
			.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
			.setDescription(`\`${user.tag} (${user.id})\` just voted!\n${user.tag} received <a:jasminecoins:868105109748469780> ${reward} ${weekend === true ? '(doubled on weekend)' : ''}\n\nYou can vote on blist.xyz [here](https://blist.xyz/bot/867048396358549544/) every 12 hours!`)
			.setFooter('Thank you for your support!');

		channel.send({ embeds: [embed] });

		user.send(`Thank for voting! You just received <a:jasminecoins:868105109748469780> ${reward}! ${weekend === true ? 'Doubled on weekend!' : ''}`).catch((e) => console.log(e));

		res.sendStatus(200);
	});

	app.listen(PORT11, () => { console.log(`[LOG] Webhook server running at ::${PORT11}/${blist}`); });
};
