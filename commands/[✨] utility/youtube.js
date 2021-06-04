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
const yts = require('yt-search');
const { PaginateContent } = require('../../Pagination');
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'youtube',
	aliases: ['yt'],
	category: '[✨] utility',
	description: 'Search youtube videos',
	example: `${bot_prefix}youtube <video to search>`,
	run: async (client, message, args) => {
		if (!message.channel.nsfw) return message.channel.send('This command can only be used in the nsfw channel only');
		if (!args.length) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}youtube <video to search>\`.`);
		const search = args.join(' ');

		yts(search, async (err, res) => {
			if (err) return message.channel.send('No videos found! ^-^');
			const pages = [];
			for (let i = 0; i < res.videos.length; i++) {
				const values = `Video ${i + 1}/${res.videos.length}\n${res.videos[i].url}`;
				pages.push(values);
			}

			const paginated = new PaginateContent.DiscordJS(client, message, pages);
			await paginated.init();
		});
	},
};