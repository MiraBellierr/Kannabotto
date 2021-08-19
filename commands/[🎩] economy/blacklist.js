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

const Models = require('../../create-model');
const { createAllDataForNewUser } = require('../../functions');

module.exports = {
	name: 'blacklist',
	aliases: ['bl'],
	description: 'blacklist a user',
	example: 'blacklist them',
	run: async (client, message, args) => {
		if (message.author.id !== '548050617889980426') return;
		if (!args[0]) return;

		const user = client.users.cache.get(args[0]);

		if (!user) return message.reply('Couldn\'t find that user.');

		const Blacklist = Models.Blacklist();

		await createAllDataForNewUser(user.id);

		if (args[1] === '--games') {
			let reason = args.slice(2).join(' ');

			if (!args[2]) reason = 'No specific reason';

			await Blacklist.update({ reason2: reason }, { where: { userId: user.id } });
			await Blacklist.update({ games: 1 }, { where: { userId: user.id } });

			message.reply(`${message.author.username}, ${user.tag} has been blacklisted from using games commands (${reason})`);

			return;
		}
		if (args[1] !== '--games') {
			let reason = args.slice(1).join(' ');

			if (!args[1]) reason = 'No specific reason';

			await Blacklist.update({ reason1: reason }, { where: { userId: user.id } });
			await Blacklist.update({ blacklist: 1 }, { where: { userId: user.id } });

			message.reply(`${message.author.username}, ${user.tag} has been blacklisted from using economy and games commands (${reason})`);
		}
	},
};