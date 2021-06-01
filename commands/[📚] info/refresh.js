module.exports = {
	name: 'refresh',
	run: async (client, message) => {

		if (message.author.id !== '275989071774351360') return;

		client.user.setActivity(`${client.guilds.cache.size.toLocaleString()} servers | Ping me for an info about me!`, { type: 'COMPETING' });
		client.user.setStatus('idle');

		message.channel.send('The activity and status has been refreshed.');

	},
};