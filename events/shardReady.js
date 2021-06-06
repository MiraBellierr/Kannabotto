module.exports = (client, id, unavailableGuilds) => {
	console.log(`[LOG] Shard ${id} is ready`);
	console.log(`[WARN] Unavailable guilds: ${unavailableGuilds}`);
};