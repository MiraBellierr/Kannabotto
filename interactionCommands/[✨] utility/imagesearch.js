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
				const results = res.map((r, i) => new MessageEmbed().setTitle(search).setImage(r.url).setFooter(`Page ${i + 1}/${res.length}`).setColor('RANDOM').setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true })).setTimestamp());

				const paginated = new PaginateContent.DiscordJS.InteractionPaginate(client, interaction, results);
				await paginated.init();
			}
		});
	},
};