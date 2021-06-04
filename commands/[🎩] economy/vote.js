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
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'vote',
	description: 'Vote for Jasmine',
	category: '[🎩] economy',
	example: `${bot_prefix}vote`,
	run: async (client, message) => {
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Vote For Jasmine')
			.setColor('RANDOM')
			.setDescription('Voting helps Jasmine becomes popular :p')
			.addField('Links:', '- [botsfordiscord.com](https://botsfordiscord.com/bot/636748567586930728/vote)\n- [discordbotlist.com](https://discordbotlist.com/bots/jasmine/upvote)\n- [top.gg](https://top.gg/bot/636748567586930728/vote) - gives you <a:JasmineCoins:718067589984551042> 500')
			.setTimestamp()
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	},
};