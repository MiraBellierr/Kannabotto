const router = require('express').Router();
const { getBotGuilds } = require('../utils/api');
const User = require('../database/schemas/User');
const { getMutualGuilds } = require('../utils/utils');

router.get('/guilds', async (req, res) => {
	const guilds = await getBotGuilds();
	const user = await User.findOne({ discordId: req.user.discordId });
	if (user) {
		const userGuilds = user.get('guilds');
		const mutualGuilds = getMutualGuilds(userGuilds, guilds);
		res.send(mutualGuilds);
	}
	else {
		return res.status(401).send({ msg: 'Unauthorized' });
	}
});

module.exports = router;