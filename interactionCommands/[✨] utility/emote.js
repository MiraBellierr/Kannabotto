const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'emote',
	category: '[✨] utility',
	description: 'convert an emoji to an image form',
	options: [{
		name: 'emote',
		description: 'emote to be converted',
		type: 3,
		required: true,
	}],
	run: (client, interaction) => {
		try {
			const wordArr = interaction.options.getString('emote').split('');
			const emojiArr = wordArr.slice(-19, -1);
			const emojiID = emojiArr.join('');

			const embed = new MessageEmbed()
				.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			if (wordArr[1] === 'a') {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.gif`);
			}
			else {
				embed.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.png`);
			}

			interaction.reply({ embeds: [embed] });
		}
		catch (e) {
			interaction.reply('Emoji can\'t be found :c\n\n**NOTE**:\n- Unicode\'s emojis can\'t be retrieved (default emojis).\n- Please use this command with the right syntax `/emote <emoji>`.');
		}


	},
};