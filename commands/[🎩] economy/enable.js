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

const Models = require('../../create-model.js');

module.exports = {
	name: 'enable',
	description: 'enable a guild',
	example: 'enable them',
	run: async (client, message, args) => {
		if (message.author.id !== '548050617889980426') return;
		if (!args[0]) return;
		const guild = client.guilds.cache.get(args[0]);
		if (!guild) return message.reply('Couldn\'t find that guild.');

		const Disable = Models.Disable();

		if (!await Disable.findOne({ where: { guildId: guild.id } })) {
			await Disable.create({
				guildId: guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: guild.id } });

		if (args[1] === '--games') {
			if(disable.get('games') === 0) return message.reply('This guild is not blacklisted from the games commands');
			await Disable.update({ games: 1 }, { where: { guildId: guild.id } });
			message.reply(`${message.author.username}, ${guild.name} has been removed from the games blacklist`);
			return;
		}

		if(disable.get('economy') === 0) return message.reply('This guild is not blacklisted from the economy commands');

		await Disable.update({ economy: 0 }, { where: { guildId: guild.id } });
		message.reply(`${message.author.username}, ${guild.name} has been removed from the blacklist`);
	},
};