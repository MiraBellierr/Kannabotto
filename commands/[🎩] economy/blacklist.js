const Models = require('../../create-model');

module.exports = {
	name: 'blacklist',
	aliases: ['bl'],
	description: 'blacklist a user',
	example: 'blacklist them',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args[0]) return;
		const user = client.users.cache.get(args[0]);
		if (!user) return message.channel.send('Couldn\'t find that user.');

		const Blacklist = Models.Blacklist();

		if (!await Blacklist.findOne({ where: { userId: user.id } })) {
			await Blacklist.create({
				userId: user.id,
			});
		}

		if (args[1] === '--games') {
			let reason = args.slice(2).join(' ');
			if (!args[2]) reason = 'No specific reason';
			await Blacklist.update({ reason2: reason }, { where: { userId: user.id } });
			await Blacklist.update({ games: 1 }, { where: { userId: user.id } });
			message.channel.send(`${message.author.username}, ${user.tag} has been blacklisted from using games commands (${reason})`);

			return;
		}
		if (args[1] !== '--games') {
			let reason = args.slice(1).join(' ');
			if (!args[1]) reason = 'No specific reason';
			await Blacklist.update({ reason1: reason }, { where: { userId: user.id } });
			await Blacklist.update({ blacklist: 1 }, { where: { userId: user.id } });
			message.channel.send(`${message.author.username}, ${user.tag} has been blacklisted from using economy and games commands (${reason})`);
		}
	},
};