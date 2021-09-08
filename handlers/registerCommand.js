const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN } = require('../config.json');

module.exports = async function(client, guildId) {
	// eslint-disable-next-line no-unused-vars
	const commands = client.interactions.map(({ run, category, ...data }) => data);

	const rest = new REST({ version: '9' }).setToken(TOKEN);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(client.user.id, guildId),
				{ body: commands },
			);

			console.log(`Successfully reloaded application (/) commands for ${guildId}`);
		}
		catch (error) {
			console.error(error);
		}
	})();
};