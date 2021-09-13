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
const { PaginateContent } = require('../../Pagination');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'imagesearch',
	description: 'search the image from Google image',
	category: '[✨] utility',
	options: [{
		name: 'search',
		description: 'image to search',
		type: 3,
		required: true,
	}],
	run: async (client, interaction) => {
		if (!interaction.channel.nsfw) return interaction.reply('This command can only be used in NSFW channel.');

		const search = interaction.options.getString('search');

		const options = {
			searchTerm: search,
			queryStringAddition: '&tbs=isz:l',
		};

		gis(options, async (err, res) => {
			if (err) {
				console.error(err);
				return interaction.reply('An error occurred');
			}
			else {
				const results = res.map((r, i) => new MessageEmbed().setTitle(search).setImage(r.url).setFooter(`Page ${i + 1}/${res.length}`).setColor('#CD1C6C').setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true })).setTimestamp());

				const paginated = new PaginateContent.DiscordJS.InteractionPaginate(client, interaction, results);
				await paginated.init();
			}
		});
	},
};