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
const { getUserDataAndCreate, createAllDataForNewUser } = require('../../functions');

module.exports = {
	name: 'addcoins',
	run: async (client, message, args) => {
		const clientApplication = await client.application.fetch(client.user.id);
		const owner = clientApplication.owner.id;

		if (message.author.id !== owner) return;
		if (!args.length) return message.reply('`<ID> <amount>`');

		const id = args[0];

		if (!client.users.cache.get(id)) return message.reply('There is no user with this id');

		const amount = parseInt(args[1]);

		if (isNaN(amount)) return message.reply('Invalid input.');

		await createAllDataForNewUser(id);

		const Economy = Models.Economy();
		const economy = await getUserDataAndCreate(Economy, id);

		await Economy.update({ balance: economy.get('balance') + amount }, { where: { userId: id } });

		message.reply(`Successfully added <a:jasminecoins:868105109748469780> **${amount.toLocaleString()}** to **${client.users.cache.get(id).tag}**.`);
	},
};