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

const { bot_prefix } = require('../../config.json');
const DiscordTogether = require('../../classes/discord-together');

module.exports = {
	name: 'watch2gether',
	aliases: ['watch'],
	description: 'watch youtube, play poker, chess, betrayal and fishing together in voice channel',
	example: `${bot_prefix}watch2gether <youtube | poker | chess | betrayal | fishing>`,
	usage: '<youtube | poker | chess | betrayal | fishing>',
	run: async (client, message, args) => {
		if (!message.member.voice) return message.channel.send('Please join the voice channel first.');
		try {
			client.discordTogether = new DiscordTogether(client);

			client.discordTogether.createTogetherCode(message.member.voice.channelID, args[0]).then(async invite => {
				return message.author.send(`${invite.code}`);
			});
		}
		catch (e) {
			return message.channel.send(e.message);
		}
	},
};