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

const { loadItems } = require('../handlers/item');
const { loadWeapons } = require('../handlers/weapon');
const registerInteraction = require('../handlers/registerCommand');

module.exports = async client => {

	client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size.toLocaleString()} servers ✨ | Ping me for info about me!`, type: 'WATCHING' }], status: 'idle' });

	console.log(`Hi, ${client.user.username} is now online!`);

	client.guilds.cache.forEach((guild) => {
		registerInteraction(client, guild.id);
	});

	loadItems(client);
	loadWeapons(client);

	const channel = client.channels.cache.get('865525377458634762');
	const errorChannel = client.channels.cache.get('879702885670211595');

	if (!channel || !errorChannel) return;

	channel.send(`${client.user.username} has been restarted. Maybe there was an error.`);
	errorChannel.send({ content: 'error.log', files: ['./error.log'] });
};