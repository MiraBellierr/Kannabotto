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
const { getUserDataAndCreate } = require('../../functions.js');

module.exports = {
	name: 'unblacklist',
	aliases: ['ubl'],
	description: 'unblacklist a user',
	example: 'unblacklist them',
	run: async (client, message, args) => {
		if (message.author.id !== '548050617889980426') return;
		if (!args[0]) return;
		const user = client.users.cache.get(args[0]);
		if (!user) return message.reply('Couldn\'t find that user.');

		const Blacklist = Models.Blacklist();
		const blacklist = await getUserDataAndCreate(Blacklist, user.id);


		if (args[1] === '--games') {
			if(blacklist.get('games') === 0) return message.reply('This user is not blacklisted from the games commands');
			await Blacklist.update({ games: 0 }, { where: { userId: user.id } });
			message.reply(`${message.author.username}, ${user.tag} has been removed from the games blacklist`);
			return;
		}

		if(blacklist.get('blacklist') === 0) return message.reply('This user is not blacklisted from the economy commands');

		await Blacklist.update({ blacklist: 0 }, { where: { userId: user.id } });
		message.reply(`${message.author.username}, ${user.tag} has been removed from the blacklist`);
	},
};