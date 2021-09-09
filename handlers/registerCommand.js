// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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