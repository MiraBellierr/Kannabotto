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

module.exports = (client, guild) => {

	client.user.setPresence({ activity: { name: `${client.guilds.cache.size.toLocaleString()} servers ✨ | Ping me for an info about me!`, type: 'WATCHING' }, status: 'idle' });

	const logChannel = client.channels.cache.get('865525377458634762');

	client.guilds.fetch(guild.id).then(g => {
		logChannel.send(`The bot has been added to **${g.name}** with **${g.memberCount}** members.`);
		console.log(`[LOG] The bot has been added to **${g.name}** with **${g.memberCount}** members.`);
	});
};