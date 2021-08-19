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

const gis = require('g-i-s');
const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { PaginateContent } = require('../../Pagination');
function capitalize(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
const prefix = require('../../database/prefix.json');

module.exports = {
	name: 'image',
	aliases: ['img'],
	category: '[✨] utility',
	description: 'Search images',
	example: `${bot_prefix}image <image to search>`,
	run: async (client, message, args) => {
		if (!message.channel.nsfw) return message.reply({ content: 'This command only can be used in nsfw channel.', allowedMentions: { repliedUser: true } });
		if (!args.length) return message.reply(`The right syntax is \`${prefix[message.guild.id]}image <image to search>\`.`);

		const m = await message.reply('*Loading...*');
		const search = args.join(' ');

		const opts = {
			searchTerm: search,
			queryStringAddition: '&tbs=ic',
			filterOutDomains: [
				'lookaside.fbsbx.com',
			],
		};

		gis(opts, async (err, res) => {
			if (err) return message.reply('I couldn\'t find it.. Sorry :c');

			const title = capitalize(search);
			const pages = [];

			for (let i = 0; i < res.length; i++) {
				const values = new Discord.MessageEmbed()
					.setTitle(title)
					.setColor('RANDOM')
					.setImage(res[i].url)
					.setFooter(`Page ${i + 1}/${res.length}`);

				pages.push(values);
			}

			const paginated = new PaginateContent.DiscordJS(client, message, pages);

			m.delete();

			await paginated.init();
		});
	},
};