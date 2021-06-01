module.exports = async client => {

	client.user.setPresence({ activity: { name: `${client.guilds.cache.size.toLocaleString()} servers ✨ | Ping me for an info about me!`, type: 'WATCHING' }, status: 'idle' });
	console.log(`Hi, ${client.user.username} is now online!`);
};