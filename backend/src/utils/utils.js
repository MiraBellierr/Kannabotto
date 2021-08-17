function getMutualGuilds(userGuilds, botGuilds) {
	return userGuilds.filter((guild) => botGuilds.find((botGuild) => (botGuild.id === guild.id) && (guild.permissions & 0x20) === 0x20));
}

module.exports = { getMutualGuilds };