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
	name: 'disable',
	description: 'disable a guild from using commands',
	example: 'disable them',
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

		if (args[1] === '--games') {
			let reason = args.slice(2).join(' ');
			if (!args[2]) reason = 'No specific reason';
			await Disable.update({ reason2: reason }, { where: { guildId: guild.id } });
			await Disable.update({ games: 1 }, { where: { guildId: guild.id } });
			message.reply(`${message.author.username}, Games commands are successfully disabled for ${guild.name} (${reason})`);

			return;
		}

		if (args[1] !== '--games') {
			let reason = args.slice(1).join(' ');
			if (!args[1]) reason = 'No specific reason';
			await Disable.update({ reason1: reason }, { where: { guildId: guild.id } });
			await Disable.update({ economy: 1 }, { where: { guildId: guild.id } });
			message.reply(`${message.author.username}, all economy commands are successfully disabled for ${guild.name} (${reason})`);
		}
	},
};