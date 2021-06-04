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

module.exports = {
	name: 'addcoins',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args.length) return message.channel.send('`<ID> <amount>`');
		const id = args[0];
		if (!client.users.cache.get(id)) return message.channel.send('There is no user with this id');
		const amount = parseInt(args[1]);
		if (isNaN(amount)) return message.channel.send('Invalid input.');

		const Economy = Models.Economy();

		if (!await Economy.findOne({ where: { userId: id } })) {
			await Economy.create({
				userId: id,
			});
		}
		const economy = await Economy.findOne({ where: { userId: id } });
		await Economy.update({ balance: economy.get('balance') + amount }, { where: { userId: id } });
		message.channel.send(`Successfully added <a:JasmineCoins:718067589984551042> **${amount.toLocaleString()}** to **${client.users.cache.get(id).tag}**.`);


	},
};