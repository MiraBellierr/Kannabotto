const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');

module.exports = {
	name: 'avatar',
	aliases: ['av'],
	category: '[📚] info',
	example: `${bot_prefix}avatar [mention]`,
	description: 'Returns user avatar',
	usage: '[mention]',
	run: (client, message, args) => {
		if (!args[0]) {
			const embeduser = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Your avatar')
				.setColor('RANDOM')
				.setImage(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));
			return message.channel.send(embeduser);
		}

		const user = getMember(message, args.join(' '));

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(`${user.user.username}'s Avatar`)
			.setColor('RANDOM')
			.setImage(user.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	},
};