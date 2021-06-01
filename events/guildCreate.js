module.exports = (client, guild) => {

	client.user.setPresence({ activity: { name: `${client.guilds.cache.size.toLocaleString()} servers ✨ | Ping me for an info about me!`, type: 'WATCHING' }, status: 'idle' });

	const logChannel = client.channels.cache.get('707243604283752459');

	client.guilds.fetch(guild.id).then(g => {
		g.owner.fetch().then(owner => {
			logChannel.send(`The bot has been added to **${g.name}** with **${g.memberCount}** members. The owner is **${owner.user.tag}**`);

		});
	});
};