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

const Discord = require('discord.js');
const ud = require('urban-dictionary');
const { PaginateContent } = require('../../Pagination');

module.exports = {
	name: 'urban',
	description: 'Send a definition about a word',
	category: '[✨] utility',
	options: [{
		name: 'word',
		description: 'a word to be defined',
		type: 3,
		required: true,
	}],
	run: (client, interaction) => {
		if (!interaction.channel.nsfw) return interaction.reply('This command can only be used in NSFW channel.');

		ud.define(interaction.options.getString('word')).then(async (results) => {
			const pages = [];


			for (let i = 0; i < results.length; i++) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
					.setColor(0x56aaff)
					.setDescription(results[i].definition)
					.addField('Example', results[i].example)
					.addField('Upvotes', results[i].thumbs_up.toString(), true)
					.setFooter(`Written by ${results[i].author} | Page ${i + 1}/${results.length}`)
					.setTimestamp()
					.setTitle(results[i].word);

				pages.push(embed);
			}

			const paginated = new PaginateContent.DiscordJS.InteractionPaginate(client, interaction, pages);
			await paginated.init();

		}).catch((error) => {
			console.error(`define (promise) - error ${error.message}`);
			interaction.reply({ content: 'I couldn\'t find the definition for this word', ephemeral: true });
		});
	},
};