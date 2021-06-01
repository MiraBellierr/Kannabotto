const Models = require('../../create-model');

module.exports = {
	name: 'addcoins',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args.length) return message.channel.send('`<ID> <amount>`');
		const id = args[0];
		if (!client.users.cache.get(id)) return message.channel.send('There is no user with this id');
		const amount = parseInt(args[1]);
		if (isNaN(amount)) return message.channel.send('Invalid input.');

		const Economy = Models.Economy();

		if (!await Economy.findOne({ where: { userId: id } })) {
			await Economy.create({
				userId: id,
			});
		}
		const economy = await Economy.findOne({ where: { userId: id } });
		await Economy.update({ balance: economy.get('balance') + amount }, { where: { userId: id } });
		message.channel.send(`Successfully added <a:JasmineCoins:718067589984551042> **${amount.toLocaleString()}** to **${client.users.cache.get(id).tag}**.`);


	},
};