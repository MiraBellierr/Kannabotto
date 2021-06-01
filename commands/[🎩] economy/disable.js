const Models = require('../../create-model.js');

module.exports = {
	name: 'disable',
	description: 'disable a guild from using commands',
	example: 'disable them',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args[0]) return;
		const guild = client.guilds.cache.get(args[0]);
		if (!guild) return message.channel.send('Couldn\'t find that guild.');

		const Disable = Models.Disable();

		if (!await Disable.findOne({ where: { guildId: guild.id } })) {
			await Disable.create({
				guildId: guild.id,
			});
		}

		if (args[1] === '--games') {
			let reason = args.slice(2).join(' ');
			if (!args[2]) reason = 'No specific reason';
			await Disable.update({ reason2: reason }, { where: { guildId: guild.id } });
			await Disable.update({ games: 1 }, { where: { guildId: guild.id } });
			message.channel.send(`${message.author.username}, Games commands are successfully disabled for ${guild.name} (${reason})`);

			return;
		}

		if (args[1] !== '--games') {
			let reason = args.slice(1).join(' ');
			if (!args[1]) reason = 'No specific reason';
			await Disable.update({ reason1: reason }, { where: { guildId: guild.id } });
			await Disable.update({ economy: 1 }, { where: { guildId: guild.id } });
			message.channel.send(`${message.author.username}, all economy commands are successfully disabled for ${guild.name} (${reason})`);
		}
	},
};