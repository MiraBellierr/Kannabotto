const Models = require('../../create-model.js');

module.exports = {
	name: 'enable',
	description: 'enable a guild',
	example: 'enable them',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args[0]) return;
		const guild = client.guilds.cache.get(args[0]);
		if (!guild) return message.channel.send('Couldn\'t find that user.');

		const Disable = Models.Disable();

		if (!await Disable.findOne({ where: { guildId: guild.id } })) {
			await Disable.create({
				guildId: guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: guild.id } });

		if (args[1] === '--games') {
			if(disable.get('games') === 0) return message.channel.send('This guild is not blacklisted from the games commands');
			await Disable.update({ games: 1 }, { where: { guildId: guild.id } });
			message.channel.send(`${message.author.username}, ${guild.name} has been removed from the games blacklist`);
			return;
		}

		if(disable.get('economy') === 0) return message.channel.send('This guild is not blacklisted from the economy commands');

		await Disable.update({ economy: 0 }, { where: { guildId: guild.id } });
		message.channel.send(`${message.author.username}, ${guild.name} has been removed from the blacklist`);
	},
};